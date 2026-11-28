/* =====================================================================
   THE ARCHIVE — music player + library (plan §3–§4)

   Loaded by lore/archive-ambience.js once its data is ready. Lives in the
   shell's persistent container, so music carries on across page swaps.
   Tracks + universe defaults: lore/data/ambience.js.

   - Off until turned on; on/off, volume, Follow page and loop mode are
     remembered (localStorage 'ax-music'). The current track and position
     are kept for the browser tab (sessionStorage 'ax-music-pos') so a
     plain page load (file://, reload) resumes where it was.
   - Never plays over a Champion theme: archive.js fires 'archive:theme'
     and the player steps aside, then comes back when the theme stops.
   - Every track shows: custom title / Original: "real name" / by · work (year).
   ===================================================================== */
(function () {
  'use strict';
  var shell = window.ArchiveShell, amb = window.ArchiveAmbience;
  if (window.ArchiveMusic || !shell || !amb) return;

  var ROOT = new URL(shell.root);
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = window.ARCHIVE_AMBIENCE || {};
  var TRACKS = (DATA.tracks || []).filter(function (t) { return t && t.id && t.file; });
  var BYID = {};
  TRACKS.forEach(function (t) { BYID[t.id] = t; });
  var ROWS = [['main', 'Main Theme'], ['champion', 'Champions'], ['battlefield', 'Battlefields'], ['arc', 'Arcs']];

  function asset(p) { return new URL(p, ROOT).href; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function cssUrl(p) { return 'url(&quot;' + esc(asset(p).replace(/"/g, '%22')) + '&quot;)'; }
  function byIndexId(id) {
    var ix = window.ARCHIVE_INDEX || {};
    return (ix.pages || []).filter(function (p) { return p.id === id; })[0] || null;
  }

  /* ---------- settings ---------- */
  var S = { on: false, vol: 0.45, follow: true, loop: 'one' };
  try {
    var st = JSON.parse(localStorage.getItem('ax-music') || 'null');
    if (st) Object.keys(S).forEach(function (k) { if (st[k] != null) S[k] = st[k]; });
  } catch (e) {}
  S.vol = Math.min(1, Math.max(0, +S.vol || 0));
  function save() { try { localStorage.setItem('ax-music', JSON.stringify(S)); } catch (e) {} }

  /* ---------- track helpers ---------- */
  /* "by · work (year)"; by and year are optional (e.g. Dokkan Battle themes have no credited composer) */
  function sourceLine(t) {
    var w = esc(t.work) + (t.year ? ' (' + esc(t.year) + ')' : '');
    return t.by ? esc(t.by) + ' &middot; ' + w : w;
  }
  /* custom title / Original: "…" / by · work (year) */
  function creditBlock(t) {
    return '<span class="axm-cr"><span class="t">' + esc(t.title) + '</span>' +
      '<span class="o">Original: &ldquo;' + esc(t.original) + '&rdquo;</span>' +
      '<span class="s">' + sourceLine(t) + '</span></span>';
  }
  function iconOf(t) {
    if (t.icon) return t.icon;
    if (t.type === 'champion' && t.champion) { var c = byIndexId(t.champion); if (c && c.image) return c.image; }
    if (t.type === 'arc' && t.arc) { var a = byIndexId(t.arc); if (a && a.icon) return a.icon; }
    var u = amb.universe(t.universe);
    return (u && u.backdrop) || null;
  }
  function tracksOf(uid) {
    var out = [];
    ROWS.forEach(function (r) { TRACKS.forEach(function (t) { if (t.universe === uid && t.type === r[0]) out.push(t); }); });
    return out;
  }

  /* ---------- page context ---------- */
  var CTX = amb.context(location.href);
  function pageTrack(ctx) {
    var e = ctx.entry;
    if (e && e.track && BYID[e.track]) return BYID[e.track];
    var u = amb.universe(ctx.universe);
    return (u && u.track && BYID[u.track]) || null;
  }
  function champTrack(ctx) {
    var e = ctx.entry;
    if (!e || e.type !== 'character') return null;
    return TRACKS.filter(function (t) { return t.type === 'champion' && t.champion === e.id; })[0] || null;
  }
  /* tracks tied to the current page get a "Here" marker */
  function hereSet(ctx) {
    var e = ctx.entry, set = {}, w = pageTrack(ctx);
    if (w) set[w.id] = true;
    if (e) TRACKS.forEach(function (t) {
      if ((t.champion && t.champion === e.id) || (t.arc && (t.arc === e.id || t.arc === e.arc)) ||
          (t.pages && t.pages.indexOf(e.id) >= 0)) set[t.id] = true;
    });
    return set;
  }

  /* ---------- audio engine: two players so tracks crossfade ---------- */
  var P = [new Audio(), new Audio()];
  var act = 0, cur = null, playing = false, ducked = false, pending = false;
  var MISSING = {}, lastAnnounced = null;
  P.forEach(function (a) { a.preload = 'auto'; });

  function ramp(a, to, ms, done) {
    clearInterval(a._ramp); a._ramp = null;
    if (REDUCED || ms <= 0) { a.volume = to; if (done) done(); return; }
    var from = a.volume, t0 = Date.now();
    a._ramp = setInterval(function () {
      var k = Math.min(1, (Date.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k >= 1) { clearInterval(a._ramp); a._ramp = null; if (done) done(); }
    }, 30);
  }
  function fadeOut(a, ms) { if (a.paused) return; ramp(a, 0, ms, function () { a.pause(); }); }

  function savePos() {
    if (!cur) return;
    try { sessionStorage.setItem('ax-music-pos', JSON.stringify({ id: cur.id, t: P[act].currentTime || 0 })); } catch (e) {}
  }
  var lastSave = 0;
  P.forEach(function (a) {
    a.addEventListener('timeupdate', function () {
      if (a !== P[act]) return;
      var n = Date.now(); if (n - lastSave > 2500) { lastSave = n; savePos(); }
    });
    /* only fires in "Play universe" mode (Repeat track loops the element) */
    a.addEventListener('ended', function () {
      if (a !== P[act] || !cur) return;
      var list = tracksOf(cur.universe), i = list.indexOf(cur);
      start(list.length ? list[(i + 1) % list.length] : cur, { restart: true });
    });
    a.addEventListener('error', function () {
      if (a !== P[act] || !cur || !a.getAttribute('src')) return;
      MISSING[cur.id] = true; playing = false; pending = false; render();
    });
  });
  window.addEventListener('pagehide', savePos);

  function stepAsideFromThemes() {
    ducked = false;
    if (window.ArchiveJS && window.ArchiveJS.pauseThemes) window.ArchiveJS.pauseThemes();
  }

  function playActive(fade) {
    var a = P[act], pr;
    try { pr = a.play(); } catch (e) { pr = Promise.reject(e); }
    return Promise.resolve(pr).then(function () {
      if (a !== P[act]) return;
      playing = true; pending = false;
      ramp(a, S.vol, fade ? 900 : 0);
      if (cur && lastAnnounced !== cur.id) { lastAnnounced = cur.id; announce(cur); }
      render();
    }).catch(function (err) {
      if (a !== P[act]) return;
      playing = false;
      if (err && err.name === 'NotAllowedError') pending = true;   /* autoplay blocked: the next click starts it */
      render();
    });
  }

  /* opts: time (seconds), fade, restart */
  function start(t, opts) {
    opts = opts || {};
    if (!t) return;
    stepAsideFromThemes();
    if (cur && cur.id === t.id && !opts.restart) { resume(); return; }
    var old = P[act], nu = P[1 - act];
    if (cur) fadeOut(old, opts.fade ? 900 : 150);
    clearInterval(nu._ramp); nu._ramp = null;
    nu.pause();
    nu.src = asset(t.file);
    nu.loop = S.loop === 'one';
    nu.volume = opts.fade ? 0 : S.vol;
    if (opts.time) {
      var tt = opts.time;
      nu.addEventListener('loadedmetadata', function once() {
        nu.removeEventListener('loadedmetadata', once);
        try { if (tt < nu.duration - 1) nu.currentTime = tt; } catch (e) {}
      });
    }
    act = 1 - act; cur = t; delete MISSING[t.id];
    if (opts.restart) lastAnnounced = null;
    render();
    savePos();
    return playActive(opts.fade);
  }
  function resume() {
    if (!cur) return;
    stepAsideFromThemes();
    var a = P[act];
    if (!a.paused) { playing = true; ramp(a, S.vol, 300); render(); return; }
    a.volume = 0;
    playActive(true);
  }
  function pause(ms) {
    playing = false; pending = false;
    fadeOut(P[act], ms == null ? 300 : ms);
    savePos(); render();
  }

  /* On / off (remembered between visits) */
  function turnOn() {
    S.on = true; save();
    var t = pageTrack(CTX);
    if (cur && S.follow && t && t.id !== cur.id && ((CTX.entry && CTX.entry.track) || cur.universe !== CTX.universe)) { start(t, { fade: true }); return; }
    if (cur) { resume(); return; }
    if (t) start(t, { fade: true });
    else { render(); openPanel(); }          /* nothing for this page: let the reader choose */
  }
  function turnOff() { S.on = false; ducked = false; save(); pause(400); }

  /* Follow page */
  function follow() {
    if (!S.on || !S.follow) return;
    var w = pageTrack(CTX);
    if (!w || (cur && cur.id === w.id)) return;
    var override = !!(CTX.entry && CTX.entry.track);
    if (cur && !override && cur.universe === CTX.universe) return;    /* same universe: keep playing */
    if (ducked) { ducked = false; P[act].pause(); }
    start(w, { fade: true });
  }

  /* a Champion theme (infobox) started or stopped */
  document.addEventListener('archive:theme', function (ev) {
    var on = ev.detail && ev.detail.playing;
    if (on) { if (playing) { pause(250); ducked = true; render(); } }
    else if (ducked && S.on && cur) { ducked = false; resume(); }
  });

  /* autoplay was blocked: the next click or key press starts it */
  function unblock() { if (pending && S.on && cur) { pending = false; P[act].volume = 0; playActive(true); } }
  ['pointerdown', 'keydown'].forEach(function (t) { document.addEventListener(t, unblock, true); });

  /* ---------- UI ---------- */
  var IC = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4L13 8z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.8h2.8v10.4H4zM9.2 2.8H12v10.4H9.2z" fill="currentColor"/></svg>',
    note: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12.2V3.6l7-1.4v8.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="4.4" cy="12.3" rx="1.9" ry="1.5" fill="currentColor"/><ellipse cx="11.4" cy="10.7" rx="1.9" ry="1.5" fill="currentColor"/></svg>',
    one: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 7.5V6a2 2 0 0 1 2-2h7.5M10.5 2l2 2-2 2M13 8.5V10a2 2 0 0 1-2 2H3.5M5.5 14l-2-2 2-2"/><path d="M7.4 6.8l1-.6v3.6" stroke-linecap="round"/></svg>',
    all: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 7.5V6a2 2 0 0 1 2-2h7.5M10.5 2l2 2-2 2M13 8.5V10a2 2 0 0 1-2 2H3.5M5.5 14l-2-2 2-2"/></svg>',
    follow: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 8.5h4l1.5-4 2 8 1.5-4H14" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    vol: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 6h2.3L8 3.3v9.4L4.8 10H2.5z" fill="currentColor"/><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.2 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3L5 8l5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l8 8M12 4l-8 8" stroke-linecap="round"/></svg>'
  };

  var root = document.createElement('div');
  root.className = 'axm';
  root.innerHTML =
    '<div class="axm-toast" role="status" aria-live="polite"></div>' +
    '<div class="axm-panel" role="dialog" aria-label="Music library" hidden>' +
      '<div class="axm-head">' +
        '<div class="axm-tabs" role="tablist"><button type="button" role="tab" data-view="lib">Library</button><button type="button" role="tab" data-view="credits">Credits</button></div>' +
        '<button type="button" class="axm-x" aria-label="Close music library">' + IC.x + '</button>' +
      '</div>' +
      '<div class="axm-now"></div>' +
      '<div class="axm-body"></div>' +
      '<div class="axm-peek" hidden></div>' +
    '</div>' +
    '<div class="axm-pill">' +
      '<button type="button" class="axm-pp"></button>' +
      '<button type="button" class="axm-open" aria-haspopup="dialog" aria-expanded="false"></button>' +
    '</div>';
  shell.keep.appendChild(root);

  var toast = root.querySelector('.axm-toast'), panel = root.querySelector('.axm-panel');
  var nowEl = root.querySelector('.axm-now'), body = root.querySelector('.axm-body'), peek = root.querySelector('.axm-peek');
  var pill = root.querySelector('.axm-pill'), ppBtn = root.querySelector('.axm-pp'), openBtn = root.querySelector('.axm-open');
  var VIEW = 'lib', STEP = null, SEL = null, lastPointer = 'mouse';

  function stateText() {
    if (!cur) return 'Music off';
    if (MISSING[cur.id]) return 'Audio file not found';
    if (pending) return 'Click anywhere to resume';
    if (ducked) return 'Paused for Champion theme';
    return playing ? 'Now playing' : 'Paused';
  }

  /* the notice and the library sit just above the pill, whatever its height */
  function measurePill() { root.style.setProperty('--axm-pill-h', pill.offsetHeight + 'px'); }
  window.addEventListener('resize', measurePill);

  function renderPill() {
    renderPillContent();
    measurePill();
  }
  function renderPillContent() {
    pill.classList.toggle('is-playing', playing);
    pill.classList.toggle('is-bare', !cur);
    ppBtn.innerHTML = playing ? IC.pause : (cur ? IC.play : IC.note);
    ppBtn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    if (!cur) {
      openBtn.innerHTML = '<span class="axm-cr"><span class="t">Music</span><span class="s">Off &middot; open library</span></span>';
      openBtn.setAttribute('aria-label', 'Open music library');
      return;
    }
    var stx = stateText();
    openBtn.innerHTML = creditBlock(cur) + (stx !== 'Now playing' ? '<span class="axm-state">' + stx + '</span>' : '');
    openBtn.setAttribute('aria-label', 'Open music library. ' + stx + ': ' + cur.title + ', original ' + cur.original + (cur.by ? ', by ' + cur.by : '') + ', from ' + cur.work);
  }

  function renderNow() {
    var ch = champTrack(CTX), u = cur ? amb.universe(cur.universe) : null;
    nowEl.innerHTML =
      '<div class="axm-now-main"' + (u && u.color ? ' style="--c:' + esc(u.color) + '"' : '') + '>' +
        '<button type="button" class="axm-big" data-act="pp" aria-label="' + (playing ? 'Pause music' : 'Play music') + '">' + (playing ? IC.pause : IC.play) + '</button>' +
        '<div class="axm-now-text"><span class="k">' + stateText() + '</span>' +
        (cur ? creditBlock(cur) : '<span class="axm-cr"><span class="s">Press play for this page&rsquo;s music, or pick a track below.</span></span>') +
      '</div></div>' +
      '<div class="axm-ctrls">' +
        '<button type="button" class="axm-chip' + (S.follow ? ' on' : '') + '" data-act="follow" aria-pressed="' + S.follow + '" title="Switch music to match each page&rsquo;s universe">' + IC.follow + 'Follow page: ' + (S.follow ? 'On' : 'Off') + '</button>' +
        '<button type="button" class="axm-chip" data-act="loop" title="Loop mode: click to change">' + (S.loop === 'one' ? IC.one + 'Repeat track' : IC.all + 'Play universe') + '</button>' +
        '<label class="axm-vol" title="Volume">' + IC.vol + '<input type="range" min="0" max="1" step="0.01" value="' + S.vol + '" aria-label="Volume"></label>' +
      '</div>' +
      (ch && (!cur || cur.id !== ch.id || !playing) ? '<button type="button" class="axm-champ" data-act="champ">' + IC.play + 'Play Champion theme <span>' + esc(ch.title) + '</span></button>' : '');
  }

  function uniList() {
    var ids = ['multiversal'];
    ((window.ARCHIVE_INDEX || {}).universes || []).forEach(function (u) { ids.push(u.id); });
    (DATA.universes || []).forEach(function (u) { if (ids.indexOf(u.id) < 0) ids.push(u.id); });
    return ids.filter(function (id) {
      var inMap = (DATA.universes || []).some(function (x) { return x.id === id; });
      return amb.universe(id) && (inMap || tracksOf(id).length);
    });
  }
  function emblem(u) {
    if (u.emblem) return '<span class="em em--img"><img src="' + esc(asset(u.emblem)) + '" alt=""></span>';
    return '<span class="em em--glyph" aria-hidden="true">' + (u.id === 'multiversal' ? '&#10022;' : esc((u.title || '?').replace(/^The /, '').charAt(0))) + '</span>';
  }

  function renderLibrary() {
    var here = hereSet(CTX);
    if (!STEP) {
      body.innerHTML = '<div class="axm-unis">' + uniList().map(function (id) {
        var u = amb.universe(id), n = tracksOf(id).length;
        return '<button type="button" class="axm-uni" data-uni="' + esc(id) + '" style="--c:' + esc(u.color || '#8a909b') + '">' +
          (u.backdrop ? '<span class="slice" style="background-image:' + cssUrl(u.backdrop) + ';background-position:' + esc(u.focus || '50% 50%') + '"></span>' : '') +
          emblem(u) + '<span class="nm">' + esc(u.title) + (CTX.universe === id ? ' <i class="axm-here">Here</i>' : '') + '</span>' +
          '<span class="ct">' + (n ? n + ' track' + (n === 1 ? '' : 's') : 'No tracks yet') + '</span></button>';
      }).join('') + '</div>';
      peek.hidden = true;
      return;
    }
    var u = amb.universe(STEP), list = tracksOf(STEP);
    var h = '<div class="axm-step2" style="--c:' + esc(u.color || '#8a909b') + '"><div class="axm-s2head">' +
      '<button type="button" class="axm-back" data-act="back" aria-label="Back to universes">' + IC.back + '</button>' +
      emblem(u) + '<span class="nm">' + esc(u.title) + '</span></div>';
    if (!list.length) h += '<p class="axm-empty">No tracks yet.</p>';
    ROWS.forEach(function (r) {
      var row = list.filter(function (t) { return t.type === r[0]; });
      if (!row.length) return;
      h += '<div class="axm-row"><div class="axm-row-k">' + r[1] + '</div><div class="axm-grid axm-grid--' + r[0] + '">' + row.map(function (t) {
        var ic = iconOf(t), isCur = cur && cur.id === t.id;
        return '<button type="button" class="axm-tile axm-tile--' + t.type + (isCur && playing ? ' is-playing' : '') + (isCur ? ' is-cur' : '') +
          (SEL === t.id ? ' is-sel' : '') + (MISSING[t.id] ? ' is-missing' : '') + '" data-track="' + esc(t.id) + '"' +
          ' aria-label="' + esc(t.title) + ' (original: ' + esc(t.original) + ', ' + esc(t.by || t.work) + ')">' +
          '<span class="img"' + (ic ? ' style="background-image:' + cssUrl(ic) + (t.type === 'main' && u.focus ? ';background-position:' + esc(u.focus) : '') + '"' : '') + '></span>' +
          (t.type === 'main' ? '<span class="lbl">' + esc(t.title) + '</span>' : '') +
          (here[t.id] ? '<i class="axm-here">Here</i>' : '') + '</button>';
      }).join('') + '</div></div>';
    });
    body.innerHTML = h + '</div>';
    renderPeek();
  }
  /* title + source of the hovered / tapped tile, before it plays */
  function renderPeek() {
    var t = SEL && BYID[SEL];
    if (!t || VIEW !== 'lib' || !STEP) { peek.hidden = true; return; }
    var isCur = cur && cur.id === t.id;
    peek.hidden = false;
    peek.innerHTML = creditBlock(t) + '<button type="button" class="axm-peek-play" data-act="peekplay" data-track="' + esc(t.id) + '">' +
      (isCur && playing ? 'Playing' : 'Play') + '</button>';
  }

  function renderCredits() {
    var h = '<div class="axm-credits"><h5>Music</h5>', any = false;
    uniList().forEach(function (id) {
      var list = tracksOf(id);
      if (!list.length) return;
      any = true;
      h += '<div class="axm-cg"><div class="axm-cg-k">' + esc(amb.universe(id).title) + '</div>' +
        list.map(function (t) { return '<div class="axm-ci">' + creditBlock(t) + '</div>'; }).join('') + '</div>';
    });
    if (!any) h += '<p class="axm-empty">No tracks yet.</p>';
    h += '<h5>Backdrops</h5>';
    uniList().forEach(function (id) {
      var u = amb.universe(id);
      if (!u.backdrop) return;
      h += '<div class="axm-ci"><span class="axm-cr"><span class="t">' + esc(u.title) + '</span><span class="s">' +
        amb.creditHTML((window.IMAGE_CREDITS || {})[u.backdrop]) + '</span></span></div>';
    });
    body.innerHTML = h + '</div>';
    peek.hidden = true;
  }

  function render() {
    renderPill();
    if (panel.hidden) return;
    renderNow();
    root.querySelectorAll('.axm-tabs button').forEach(function (b) {
      var on = b.getAttribute('data-view') === VIEW;
      b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (VIEW === 'credits') renderCredits(); else renderLibrary();
  }

  /* "Now playing" notice: full credit, even with the player collapsed */
  var toastTimer = null;
  function announce(t) {
    if (!panel.hidden) return;
    toast.innerHTML = '<span class="k">Now playing</span>' + creditBlock(t);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 6500);
  }
  toast.addEventListener('click', function () { toast.classList.remove('show'); });

  function openPanel() {
    panel.hidden = false; toast.classList.remove('show');
    if (!STEP && cur) STEP = cur.universe;
    else if (!STEP && tracksOf(CTX.universe).length) STEP = CTX.universe;
    openBtn.setAttribute('aria-expanded', 'true');
    render();
  }
  function closePanel() { panel.hidden = true; SEL = null; openBtn.setAttribute('aria-expanded', 'false'); }

  ppBtn.addEventListener('click', function () { if (playing) turnOff(); else turnOn(); });
  openBtn.addEventListener('click', function () { if (panel.hidden) openPanel(); else closePanel(); });
  root.querySelector('.axm-x').addEventListener('click', closePanel);
  root.querySelector('.axm-tabs').addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-view]'); if (!b) return;
    VIEW = b.getAttribute('data-view'); SEL = null; render();
  });

  /* choosing a track yourself turns Follow page off */
  function pick(t) {
    if (!t) return;
    S.follow = false; S.on = true; save();
    if (cur && cur.id === t.id) { if (!playing) resume(); render(); return; }
    start(t, { fade: true });
  }

  panel.addEventListener('pointerdown', function (ev) { lastPointer = ev.pointerType || 'mouse'; });
  panel.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'pp') { if (playing) turnOff(); else turnOn(); return; }
    if (a === 'follow') { S.follow = !S.follow; save(); render(); if (S.follow) follow(); return; }
    if (a === 'loop') { S.loop = S.loop === 'one' ? 'all' : 'one'; save(); P[act].loop = S.loop === 'one'; render(); return; }
    if (a === 'champ') { var ch = champTrack(CTX); if (ch) { S.on = true; save(); start(ch, { fade: true }); } return; }
    if (a === 'back') { STEP = null; SEL = null; render(); return; }
    if (a === 'peekplay') { pick(BYID[b.getAttribute('data-track')]); return; }
    if (b.hasAttribute('data-uni')) { STEP = b.getAttribute('data-uni'); SEL = null; render(); return; }
    var tid = b.getAttribute('data-track');
    if (tid && BYID[tid]) {
      /* touch: the first tap shows the title and source, the second plays */
      if (lastPointer === 'touch' && SEL !== tid) { SEL = tid; render(); return; }
      SEL = tid; pick(BYID[tid]);
    }
  });
  /* mouse / keyboard: hovering or focusing a tile shows its credit */
  function peekFrom(ev) {
    var b = ev.target.closest && ev.target.closest('.axm-tile');
    if (!b || SEL === b.getAttribute('data-track')) return;
    SEL = b.getAttribute('data-track');
    body.querySelectorAll('.axm-tile').forEach(function (x) { x.classList.toggle('is-sel', x === b); });
    renderPeek();
  }
  body.addEventListener('mouseover', peekFrom);
  body.addEventListener('focusin', peekFrom);
  panel.addEventListener('input', function (ev) {
    if (ev.target.type !== 'range') return;
    S.vol = +ev.target.value;
    var a = P[act]; if (!a._ramp && !a.paused) a.volume = S.vol;
    clearTimeout(panel._vt); panel._vt = setTimeout(save, 250);
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !panel.hidden) { closePanel(); openBtn.focus(); } });
  /* outside clicks close the library (composedPath: the clicked element may have been re-rendered away) */
  document.addEventListener('click', function (ev) {
    if (panel.hidden) return;
    var path = ev.composedPath ? ev.composedPath() : [ev.target];
    if (path.indexOf(root) < 0 && !root.contains(ev.target)) closePanel();
  });

  /* ---------- pages ---------- */
  document.addEventListener('archive:ambience', function (ev) {
    CTX = amb.context(ev.detail ? ev.detail.url : location.href);
    follow();
    render();
  });

  /* first load: carry on from this tab's last track (plain page loads), else the page's own */
  (function boot() {
    var saved = null;
    try { saved = JSON.parse(sessionStorage.getItem('ax-music-pos') || 'null'); } catch (e) {}
    var sv = saved && BYID[saved.id], w = pageTrack(CTX), first = sv || w;
    if (S.follow && sv && w && w.id !== sv.id && ((CTX.entry && CTX.entry.track) || sv.universe !== CTX.universe)) first = w;
    if (S.on && first) {
      if (first === sv) lastAnnounced = sv.id;      /* resuming: no "Now playing" notice */
      start(first, { time: first === sv ? saved.t : 0, fade: true });
    } else if (sv) {
      /* music is off: keep the last track ready (shown as Paused) */
      var a = P[act];
      cur = sv; a.src = asset(sv.file); a.loop = S.loop === 'one'; a.volume = S.vol;
      a.addEventListener('loadedmetadata', function once() {
        a.removeEventListener('loadedmetadata', once);
        try { a.currentTime = saved.t || 0; } catch (e) {}
      });
    }
    render();
  })();

  window.ArchiveMusic = {
    play: turnOn, pause: turnOff, open: openPanel, close: closePanel,
    state: function () {
      return { on: S.on, playing: playing, pending: pending, ducked: ducked, follow: S.follow, loop: S.loop,
        vol: S.vol, track: cur && cur.id, time: P[act].currentTime, volume: P[act].volume };
    }
  };
})();
