/* =====================================================================
   THE ARCHIVE — ambience (universe backdrops; music player in Stage 4)

   Loaded by lore/archive-shell.js on every Archive page. Everything it
   draws lives inside the shell's persistent container (#ax-shell-keep),
   so it survives page swaps. Data: lore/data/ambience.js (universe map),
   lore/data/archive-index.js (which universe each page belongs to) and
   data/image-credits.js (backdrop credits). Memory pages don't load those
   data files themselves, so they are loaded here when missing.

   API: window.ArchiveAmbience = {
     context(url) → { universe, entry, backdrop: { src, focus, credit } | null }
     universe(id) → universe-map entry (merged with ARCHIVE_INDEX) | null
     creditHTML(credit) → one line of credit markup (image-credits entry)
   }
   Then loads lore/archive-music.js (player + library).
   Fires on document:  archive:ambience  detail { url, universe, backdrop }
   ===================================================================== */
(function () {
  'use strict';
  var shell = window.ArchiveShell;
  if (window.ArchiveAmbience || !shell) return;

  var ROOT = new URL(shell.root);
  var html = document.documentElement;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* stylesheet: kept across swaps */
  if (!document.getElementById('axa-style')) {
    var link = document.createElement('link');
    link.id = 'axa-style'; link.rel = 'stylesheet';
    link.href = new URL('lore/archive-ambience.css', ROOT).href;
    link.setAttribute('data-shell-keep', '');
    document.head.appendChild(link);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rel(url) {
    var p = new URL(url, location.href).pathname, base = ROOT.pathname;
    if (p.indexOf(base) !== 0) return '';
    try { return decodeURIComponent(p.slice(base.length)); } catch (e) { return p.slice(base.length); }
  }
  function asset(path) { return new URL(path, ROOT).href; }

  /* ---------- data ---------- */
  var BY_PATH = null;
  function indexByPath() {
    if (BY_PATH) return BY_PATH;
    BY_PATH = {};
    var ix = window.ARCHIVE_INDEX || {};
    (ix.universes || []).forEach(function (u) { if (u.path) BY_PATH[u.path] = { type: 'universe', universe: u.id, id: u.id }; });
    (ix.pages || []).forEach(function (p) { if (p.path && !BY_PATH[p.path]) BY_PATH[p.path] = p; });
    return BY_PATH;
  }
  function universe(id) {
    var A = window.ARCHIVE_AMBIENCE || {};
    var a = (A.universes || []).filter(function (u) { return u.id === id; })[0];
    var x = ((window.ARCHIVE_INDEX || {}).universes || []).filter(function (u) { return u.id === id; })[0];
    if (!a && !x) return null;
    var out = {};
    [x, a].forEach(function (o) { if (o) Object.keys(o).forEach(function (k) { out[k] = o[k]; }); });
    out.id = id;
    out.title = (a && a.title) || (x && x.title) || id;
    return out;
  }

  /* universe a page belongs to (plan §1 mapping rules) */
  function universeOf(entry) {
    if (!entry) return 'multiversal';
    if (entry.type === 'character') return entry.universe || 'multiversal';
    if (entry.half === 'entwined') return 'multiversal';
    return entry.universe || 'multiversal';
  }

  function backdropFor(entry, uid) {
    var o = entry && entry.backdrop, src = null, focus = null;
    if (o === 'none') return null;
    if (o && o.indexOf('/') >= 0) { src = o; focus = entry.backdropFocus; }
    else {
      var u = universe(o || uid);
      if (!u || !u.backdrop) return null;
      src = u.backdrop; focus = (o ? null : entry && entry.backdropFocus) || u.focus;
    }
    return { src: src, focus: focus || '50% 50%', credit: (window.IMAGE_CREDITS || {})[src] || null };
  }

  function context(url) {
    var entry = indexByPath()[rel(url || location.href)] || null;
    var uid = universeOf(entry);
    return { universe: uid, entry: entry, backdrop: backdropFor(entry, uid) };
  }

  /* ---------- backdrop layer ---------- */
  var bd = document.createElement('div');
  bd.className = 'axa-bd'; bd.setAttribute('aria-hidden', 'true');
  bd.innerHTML = '<div class="axa-bd-layer"></div><div class="axa-bd-layer"></div><div class="axa-bd-shade"></div>';
  var layers = bd.querySelectorAll('.axa-bd-layer');
  var front = 0, curKey = null, req = 0, offTimer = null;

  var credit = document.createElement('div');
  credit.className = 'axa-credit'; credit.hidden = true;
  credit.innerHTML =
    '<button type="button" class="axa-credit-btn" aria-label="Backdrop credit" aria-expanded="false">' +
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
      '<rect x="1.5" y="2.5" width="13" height="11" rx="2"/><circle cx="5.5" cy="6.3" r="1.3"/><path d="M2 12l3.8-3.6 2.7 2.4 2.2-2 3.3 3"/></svg>' +
    '</button><span class="axa-credit-text"></span>';
  var creditBtn = credit.querySelector('button'), creditText = credit.querySelector('.axa-credit-text');
  creditBtn.addEventListener('click', function () {
    var open = credit.classList.toggle('open');
    creditBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (ev) {
    if (credit.classList.contains('open') && !credit.contains(ev.target)) {
      credit.classList.remove('open'); creditBtn.setAttribute('aria-expanded', 'false');
    }
  });

  shell.keep.appendChild(bd);
  shell.keep.appendChild(credit);

  /* "Art by X · Work"  /  "Source (owner) · note"  /  "Photo: X" */
  function creditMarkup(c) {
    if (!c) return '<span class="src">Uncredited</span>';
    var a = c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' : '<span class="src">';
    var z = c.url ? '</a>' : '</span>';
    if (c.artist) return 'Art by ' + a + esc(c.artist) + z + (c.work ? ' &middot; ' + esc(c.work) : '');
    if (c.photo) return 'Photo: ' + a + esc(c.photo) + z;
    return a + esc(c.source) + z + (c.owner ? ' (' + esc(c.owner) + ')' : '') + (c.note ? ', ' + esc(c.note) : '');
  }

  /* full credit in the margin when there is room beside the column, else a small button */
  function layoutCredit() {
    if (credit.hidden) return;
    var col = document.querySelector('main.ax-page, body > .container');
    var gutter = col ? col.getBoundingClientRect().left : 0;
    var wide = gutter >= 200;
    credit.classList.toggle('compact', !wide);
    creditText.style.maxWidth = wide ? Math.min(330, gutter - 30) + 'px' : '';
    if (wide) { credit.classList.remove('open'); creditBtn.setAttribute('aria-expanded', 'false'); }
  }
  var rz = null;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(layoutCredit, 80); });

  function showCredit(b) {
    if (!b) { credit.hidden = true; return; }
    creditText.innerHTML = '<span class="k">Backdrop</span>' + creditMarkup(b.credit);
    credit.hidden = false;
    layoutCredit();
  }

  function clearBackdrop() {
    curKey = null;
    layers[0].classList.remove('on'); layers[1].classList.remove('on');
    showCredit(null);
    clearTimeout(offTimer);
    offTimer = setTimeout(function () { if (!curKey) html.classList.remove('ax-bd'); }, REDUCED ? 0 : 700);
  }

  function setBackdrop(b) {
    var key = b ? b.src + '|' + b.focus : null;
    if (key === curKey) { showCredit(b); return; }
    var token = ++req;
    if (!b) { clearBackdrop(); return; }
    var url = asset(b.src), img = new Image();
    var cached = false;
    function apply() {
      if (token !== req) return;
      clearTimeout(offTimer);
      curKey = key;
      html.classList.add('ax-bd');
      var next = layers[1 - front];
      next.style.backgroundImage = 'url("' + url.replace(/"/g, '%22') + '")';
      next.style.backgroundPosition = b.focus;
      bd.classList.toggle('instant', cached || REDUCED);
      void next.offsetWidth;                 /* start the fade from 0 */
      next.classList.add('on');
      layers[front].classList.remove('on');
      front = 1 - front;
      showCredit(b);
    }
    img.onload = apply;
    img.onerror = function () { if (token === req) clearBackdrop(); };   /* missing image → grey */
    img.src = url;
    if (img.complete && img.naturalWidth) { cached = true; img.onload = null; apply(); }
  }

  function update(url) {
    var ctx = context(url);
    setBackdrop(ctx.backdrop);
    var ev;
    var detail = { url: url, universe: ctx.universe, backdrop: ctx.backdrop };
    try { ev = new CustomEvent('archive:ambience', { detail: detail }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('archive:ambience', false, false, detail); }
    document.dispatchEvent(ev);
  }

  window.ArchiveAmbience = { context: context, universe: universe, creditHTML: creditMarkup };

  /* data first (Memory pages don't carry it), then the current page */
  var need = [];
  if (!window.ARCHIVE_INDEX) need.push(shell.load('lore/data/archive-index.js'));
  if (!window.IMAGE_CREDITS) need.push(shell.load('data/image-credits.js'));
  need.push(shell.load('lore/data/ambience.js'));
  Promise.all(need).then(function () {
    BY_PATH = null;
    update(location.href);
    document.addEventListener('archive:page', function (ev) {
      if (ev.detail && ev.detail.swapped) update(ev.detail.url); else layoutCredit();
    });
    shell.load('lore/archive-music.js');          /* music player + library */
  });
})();
