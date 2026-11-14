/* =====================================================================
   THE ARCHIVE — shared script for every Lore wiki page
   Needs: data/archive-index.js loaded first.
   Page setup:
     <html data-root="../../../">           path back to the site root
     <body data-page="<index id>">          the current page's index id
   ===================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var IDX = window.ARCHIVE_INDEX || { universes: [], pages: [] };
  var PAGE = document.body.getAttribute('data-page') || '';

  var byId = {};
  IDX.universes.forEach(function (u) { u.type = 'universe'; byId[u.id] = u; });
  IDX.pages.forEach(function (p) { byId[p.id] = p; });

  var TYPE_LABEL = {
    universe: 'Universe', portal: 'Portal', category: 'Category', library: 'Library', event: 'Event',
    story: 'Story', character: 'Character', location: 'Location', faction: 'Faction',
    object: 'Object', system: 'System', memory: 'Memory', tool: 'Tool'
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function href(e) { return ROOT + e.path; }
  function exists(e) { return e && e.status !== 'planned'; }
  function uniTitle(id) { return byId[id] ? byId[id].title : ''; }

  /* <a> for an index entry: real link, or a red link if not built */
  function linkHTML(id, text, extraClass) {
    var e = byId[id];
    var label = esc(text || (e ? e.title : id));
    var cls = extraClass ? ' ' + extraClass : '';
    if (exists(e)) return '<a class="' + cls.trim() + '" href="' + href(e) + '">' + label + '</a>';
    return '<a class="ax-red' + cls + '" title="Not written yet" aria-disabled="true">' + label + '</a>';
  }

  /* ------------------------------------------------------------------
     Header
     ------------------------------------------------------------------ */
  function menuItem(e, opts) {
    opts = opts || {};
    var sw = opts.swatch ? '<span class="sw" style="background:' + opts.swatch + '"></span>' : '';
    if (exists(e)) return '<a href="' + href(e) + '">' + sw + esc(e.title) + '</a>';
    return '<span class="ax-menu-dead" title="Not built yet">' + sw + esc(e.title) + '<span class="note">soon</span></span>';
  }
  function navLink(id, label) {
    var e = byId[id];
    if (exists(e)) return '<div class="ax-nav-item"><a class="ax-nav-btn" href="' + href(e) + '">' + label + '</a></div>';
    return '<div class="ax-nav-item"><span class="ax-nav-btn" title="Not built yet" style="cursor:default;opacity:.55">' + label + '</span></div>';
  }

  function renderHeader() {
    var slot = document.getElementById('ax-header');
    if (!slot) return;
    var cur = byId[PAGE] || {};

    var apart = '<div class="ax-menu-label">Portal</div>' + menuItem(byId['worlds-apart']) +
      '<hr><div class="ax-menu-label">Universes</div>' +
      IDX.universes.map(function (u) { return menuItem(u, { swatch: u.color }); }).join('');

    var entwined = '<div class="ax-menu-label">Portal</div>' + menuItem(byId['worlds-entwined']) +
      '<hr><div class="ax-menu-label">Events</div>' +
      IDX.pages.filter(function (p) { return p.type === 'event' && p.half === 'entwined'; }).map(function (p) { return menuItem(p); }).join('') +
      '<hr><div class="ax-menu-label">Acts</div><span class="ax-menu-dead">Act I<span class="note">being written</span></span>';

    var explore = menuItem(byId['power-rankings']) + menuItem(byId['categories']) + menuItem(byId['characters']) + menuItem(byId['memories']) +
      '<hr><a href="#" data-random>Random article</a>';

    var inApart = cur.half === 'apart';
    var inEntwined = cur.half === 'entwined';

    slot.outerHTML =
      '<div class="ax-sitebar"><div class="ax-sitebar-inner">' +
        '<a href="' + ROOT + 'index.html">&larr; Champions Ultimate Edition</a>' +
        '<span>The Archive &middot; Lore wiki</span>' +
      '</div></div>' +
      '<header class="ax-header"><div class="ax-header-inner">' +
        '<a class="ax-wordmark" href="' + href(byId['the-archive']) + '"><span class="k">Champions Lore</span><span class="w">The Archive</span></a>' +
        '<nav class="ax-nav">' +
          '<div class="ax-nav-item"><button class="ax-nav-btn' + (inApart ? ' is-apart' : '') + '">Worlds Apart <span class="chev">&#9662;</span></button><div class="ax-menu">' + apart + '</div></div>' +
          '<div class="ax-nav-item"><button class="ax-nav-btn"' + (inEntwined ? ' style="border-bottom-color:var(--entwined)"' : '') + '><span class="dot" style="background:var(--entwined)"></span>Worlds Entwined <span class="chev">&#9662;</span></button><div class="ax-menu">' + entwined + '</div></div>' +
          navLink('characters', 'Characters') +
          navLink('memories', 'Memories') +
          '<div class="ax-nav-item"><button class="ax-nav-btn">Explore <span class="chev">&#9662;</span></button><div class="ax-menu">' + explore + '</div></div>' +
        '</nav>' +
        '<div class="ax-search"><span class="ico">&#9906;</span>' +
          '<input type="search" placeholder="Search the Archive" aria-label="Search the Archive" autocomplete="off">' +
          '<div class="ax-search-results" role="listbox"></div></div>' +
      '</div></header>';

    /* dropdowns: click to toggle (touch), hover works via CSS */
    document.querySelectorAll('.ax-nav-item > button').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var item = b.parentElement, was = item.classList.contains('open');
        document.querySelectorAll('.ax-nav-item.open').forEach(function (o) { o.classList.remove('open'); });
        if (!was) item.classList.add('open');
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.ax-nav-item.open').forEach(function (o) { o.classList.remove('open'); });
    });

    document.querySelectorAll('[data-random]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var pool = IDX.pages.filter(function (p) { return exists(p) && p.id !== PAGE && p.type !== 'portal'; });
        if (pool.length) location.href = href(pool[Math.floor(Math.random() * pool.length)]);
      });
    });

    initSearch();
  }

  /* ------------------------------------------------------------------
     Search
     ------------------------------------------------------------------ */
  function initSearch() {
    var input = document.querySelector('.ax-search input');
    var box = document.querySelector('.ax-search-results');
    if (!input) return;
    var all = IDX.universes.concat(IDX.pages);
    var active = -1;

    function render(q) {
      q = q.trim().toLowerCase();
      if (!q) { box.classList.remove('show'); return; }
      var hits = all.filter(function (e) {
        return (e.title + ' ' + (e.aliases || []).join(' ')).toLowerCase().indexOf(q) !== -1;
      }).sort(function (a, b) {
        var as = a.title.toLowerCase().indexOf(q) === 0 ? 0 : 1, bs = b.title.toLowerCase().indexOf(q) === 0 ? 0 : 1;
        return as - bs || (exists(b) - exists(a)) || a.title.localeCompare(b.title);
      }).slice(0, 12);
      active = -1;
      if (!hits.length) { box.innerHTML = '<div class="ax-sr-empty">No pages match &ldquo;' + esc(q) + '&rdquo;.</div>'; box.classList.add('show'); return; }
      box.innerHTML = hits.map(function (e) {
        var sub = [];
        if (e.universe) sub.push(uniTitle(e.universe));
        if (e.type === 'memory' && e.anchor) sub.push(uniTitle(e.anchor) + '’s Memory');
        if (!exists(e)) sub.push('not written yet');
        var inner = '<span><span class="t">' + esc(e.title) + '</span>' + (sub.length ? '<br><span class="s">' + esc(sub.join(' · ')) + '</span>' : '') + '</span>' +
          '<span class="tag">' + (TYPE_LABEL[e.type] || '') + '</span>';
        return exists(e) ? '<a class="ax-sr" href="' + href(e) + '">' + inner + '</a>'
                         : '<div class="ax-sr is-red">' + inner + '</div>';
      }).join('');
      box.classList.add('show');
    }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value) render(input.value); });
    input.addEventListener('keydown', function (ev) {
      var rows = box.querySelectorAll('a.ax-sr');
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        ev.preventDefault();
        if (!rows.length) return;
        active = (active + (ev.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
        rows.forEach(function (r, i) { r.classList.toggle('active', i === active); });
      } else if (ev.key === 'Enter') {
        var go = rows[active >= 0 ? active : 0];
        if (go) location.href = go.getAttribute('href');
      } else if (ev.key === 'Escape') { box.classList.remove('show'); input.blur(); }
    });
    document.addEventListener('click', function (ev) { if (!ev.target.closest('.ax-search')) box.classList.remove('show'); });
  }

  /* ------------------------------------------------------------------
     Auto-links:  <a data-link="harry-potter"></a>
     ------------------------------------------------------------------ */
  function resolveLinks(root) {
    (root || document).querySelectorAll('[data-link]').forEach(function (el) {
      var id = el.getAttribute('data-link'), e = byId[id];
      if (!el.textContent.trim()) el.textContent = e ? e.title : id;
      if (el.classList.contains('mem-link')) {
        if (e) {
          el.setAttribute('href', href(e));
          el.setAttribute('data-mem', (e.anchor ? uniTitle(e.anchor) + ' Memory: ' : 'Memory: ') + e.title);
        }
        return;
      }
      if (exists(e)) { el.setAttribute('href', href(e)); el.classList.remove('ax-red'); }
      else { el.removeAttribute('href'); el.classList.add('ax-red'); el.setAttribute('title', 'Not written yet'); }
    });
  }

  /* inline Memory link: first tap on touch shows the tooltip, second follows */
  function initMemLinks() {
    var lastTouch = false;
    document.addEventListener('pointerdown', function (e) { lastTouch = e.pointerType === 'touch'; }, true);
    document.querySelectorAll('.mem-link').forEach(function (el) {
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', function (e) {
        if (lastTouch && !el.classList.contains('is-open')) {
          e.preventDefault();
          document.querySelectorAll('.mem-link.is-open').forEach(function (o) { o.classList.remove('is-open'); });
          el.classList.add('is-open');
        }
      });
    });
    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('.mem-link')) document.querySelectorAll('.mem-link.is-open').forEach(function (o) { o.classList.remove('is-open'); });
    });
  }

  /* ------------------------------------------------------------------
     Tabs
     ------------------------------------------------------------------ */
  function initTabs() {
    var tabs = document.querySelectorAll('.ax-tab');
    if (!tabs.length) return;
    function show(id, push) {
      var ok = false;
      tabs.forEach(function (t) { var on = t.getAttribute('data-tab') === id; t.classList.toggle('active', on); if (on) ok = true; });
      if (!ok) return false;
      document.querySelectorAll('.ax-panel').forEach(function (p) { p.classList.toggle('active', p.id === id); });
      if (push) history.replaceState(null, '', '#' + id);
      return true;
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('data-tab'), true); }); });
    var h = location.hash.slice(1);
    if (!(h && show(h))) {
      show(tabs[0].getAttribute('data-tab'));
      /* hash pointing at a heading inside the first panel still scrolls normally */
    }
    /* links like <a href="#memories" data-tab-link> switch tabs */
    document.querySelectorAll('[data-tab-link]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href').slice(1);
        if (show(id, true)) { ev.preventDefault(); window.scrollTo({ top: document.querySelector('.ax-tabs').offsetTop - 70, behavior: 'smooth' }); }
      });
    });
  }

  /* ------------------------------------------------------------------
     Table of contents:  <nav class="ax-toc" data-toc="story"></nav>
     ------------------------------------------------------------------ */
  function slug(s) { return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function initTOC() {
    document.querySelectorAll('[data-toc]').forEach(function (toc) {
      var scope = document.getElementById(toc.getAttribute('data-toc')) || document;
      var heads = scope.querySelectorAll('.ax-article h2, .ax-article h3, .ax-article h4');
      var root = { level: 1, kids: [] }, stack = [root];
      heads.forEach(function (h) {
        if (h.hasAttribute('data-no-toc') || h.closest('.ax-appear')) return;
        if (!h.id) h.id = slug(h.textContent);
        var lvl = +h.tagName.charAt(1), node = { level: lvl, h: h, kids: [] };
        while (stack.length > 1 && stack[stack.length - 1].level >= lvl) stack.pop();
        stack[stack.length - 1].kids.push(node);
        stack.push(node);
      });
      function render(list) {
        return '<ol>' + list.map(function (n) {
          return '<li><a href="#' + n.h.id + '">' + esc(n.h.textContent.trim()) + '</a>' + (n.kids.length ? render(n.kids) : '') + '</li>';
        }).join('') + '</ol>';
      }
      toc.innerHTML = '<div class="ax-toc-head"><span class="t">Contents</span><button type="button">hide</button></div>' + render(root.kids);
      toc.querySelector('button').addEventListener('click', function () {
        toc.classList.toggle('collapsed');
        this.textContent = toc.classList.contains('collapsed') ? 'show' : 'hide';
      });
    });
  }

  /* ------------------------------------------------------------------
     Memories of an arc:  <div data-memories-arc="the-sorcerers-stone"></div>
     Counts:              <span data-count="memories:<arc>[:written]"></span>
     ------------------------------------------------------------------ */
  function memoriesOf(arc) { return IDX.pages.filter(function (p) { return p.type === 'memory' && p.arc === arc; }); }
  function memoriesBy(anchor) { return IDX.pages.filter(function (p) { return p.type === 'memory' && p.anchor === anchor; }); }

  function memCard(m, num, sub) {
    var anchor = byId[m.anchor] || {};
    var art = m.banner ? ' style="background-image:url(\'' + ROOT + m.banner + '\')"' : '';
    var por = anchor.image ? '<img class="por" src="' + ROOT + anchor.image + '" alt="' + esc(anchor.title || '') + '" loading="lazy">' : '<span class="por"></span>';
    return '<a class="ax-mem-card" href="' + href(m) + '">' +
      '<div class="art"' + art + '><span class="num">#' + num + '</span>' +
      '<span class="status ax-chip ' + (m.written ? 'ax-chip--written">Written' : 'ax-chip--stub">Being written') + '</span>' +
      (m.mature ? '<span class="mature ax-chip ax-chip--mature" title="Contains an intimate scene (not explicit)">Mature</span>' : '') + '</div>' +
      '<div class="body">' + por + '<div><div class="t">' + esc(m.title) + '</div>' +
      '<div class="s">' + sub + '</div></div></div></a>';
  }

  /* Memory art galleries, built from each Memory's `banner` (and `cast`) in the index.
       <div class="ax-gallery" data-memory-art="arc:the-goblet-of-fire"></div>   appends that arc's Memory art, story order
       <div data-memory-art="anchor:dracaena-malfoy" data-own-label="Her Memories" data-cast-label="Memories she appears in"></div> */
  function storyOrdered(list) {
    var pos = {}; IDX.pages.forEach(function (p, i) { pos[p.id] = i; });
    return list.slice().sort(function (a, b) {
      var oa = (byId[a.arc] || {}).order || 0, ob = (byId[b.arc] || {}).order || 0;
      return oa - ob || pos[a.id] - pos[b.id];
    });
  }
  function artFig(m) {
    return '<figure><img src="' + ROOT + m.banner + '" alt="' + esc(m.title) + '" data-zoom data-caption="' + esc(m.title) + '" loading="lazy" data-fallback="figure">' +
      '<figcaption><a data-link="' + esc(m.id) + '"></a></figcaption></figure>';
  }
  function initMemoryArt() {
    document.querySelectorAll('[data-memory-art]').forEach(function (box) {
      var spec = box.getAttribute('data-memory-art').split(':'), kind = spec[0], id = spec[1];
      var art = IDX.pages.filter(function (p) { return p.type === 'memory' && p.banner; });
      if (kind === 'arc') {
        box.insertAdjacentHTML('beforeend', art.filter(function (m) { return m.arc === id; }).map(artFig).join(''));
        return;
      }
      var own = storyOrdered(art.filter(function (m) { return m.anchor === id; }));
      var cast = storyOrdered(art.filter(function (m) { return m.anchor !== id && (m.cast || []).indexOf(id) >= 0; }));
      var html = '';
      [[box.getAttribute('data-own-label') || 'Own Memories', own], [box.getAttribute('data-cast-label') || 'Appears in', cast]].forEach(function (g) {
        if (!g[1].length) return;
        html += '<h4 class="ax-gal-sub">' + esc(g[0]) + ' <span class="n">' + g[1].length + '</span></h4><div class="ax-gallery">' + g[1].map(artFig).join('') + '</div>';
      });
      box.innerHTML = html || '<div class="ax-empty">No Memory art yet.</div>';
    });
  }

  function initMemories() {
    /* all Memories of one story arc, in story order */
    document.querySelectorAll('[data-memories-arc]').forEach(function (box) {
      var list = memoriesOf(box.getAttribute('data-memories-arc'));
      box.classList.add('ax-mem-grid');
      box.innerHTML = list.map(function (m, i) {
        var anchor = byId[m.anchor] || {};
        return memCard(m, i + 1, '<b>' + esc(anchor.title || '') + '</b> &middot; Memory');
      }).join('');
    });
    /* all Memories anchored to one character, grouped by arc */
    document.querySelectorAll('[data-memories-anchor]').forEach(function (box) {
      var who = box.getAttribute('data-memories-anchor');
      var mine = memoriesBy(who);
      var arcs = IDX.pages.filter(function (p) { return p.type === 'story'; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
      var html = '';
      arcs.forEach(function (arc) {
        var inArc = mine.filter(function (m) { return m.arc === arc.id; });
        if (!inArc.length) return;
        var all = memoriesOf(arc.id);
        html += '<h3 class="ax-mem-arc">' + linkHTML(arc.id) + '<span class="n">' + inArc.length + '</span></h3>' +
          '<div class="ax-mem-grid">' + inArc.map(function (m) {
            return memCard(m, all.indexOf(m) + 1, '<b>' + esc(arc.title) + '</b> &middot; ' + esc(arc.label || ''));
          }).join('') + '</div>';
      });
      box.innerHTML = html || '<div class="ax-empty">No Memories yet.</div>';
    });
    /* counts:  memories:<arc>[:written]   anchor:<character>[:written] */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var parts = el.getAttribute('data-count').split(':');
      var list = parts[0] === 'anchor' ? memoriesBy(parts[1]) : memoriesOf(parts[1]);
      if (parts[2] === 'written') list = list.filter(function (m) { return m.written; });
      el.textContent = list.length;
    });
  }


  /* ------------------------------------------------------------------
     Hub renderers (main page, portals, category, Memories library)
       <div data-char-cards="[universe]"></div>   built character cards
       <div data-char-list="[universe]"></div>    every character, built or planned, by universe
       <div data-arcs="[universe]"></div>         story arcs with icons + Memory counts
       <div data-universe-tiles></div>            one tile per universe
       <div data-memory-library></div>            every Memory, by universe and arc
     ------------------------------------------------------------------ */
  function charsOf(uni, builtOnly) {
    return IDX.pages.filter(function (p) {
      return p.type === 'character' && (!uni || p.universe === uni) && (!builtOnly || exists(p));
    });
  }
  function arcsOf(uni) {
    return IDX.pages.filter(function (p) { return p.type === 'story' && p.half === 'apart' && (!uni || p.universe === uni); })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function initHubs() {
    document.querySelectorAll('[data-char-cards]').forEach(function (box) {
      var uni = box.getAttribute('data-char-cards');
      var list = charsOf(uni, true);
      box.classList.add('ax-cards');
      box.innerHTML = list.map(function (p) {
        var u = byId[p.universe] || {};
        var img = p.image || (p.forms && p.forms[0].image);
        return '<a class="ax-ccard" href="' + href(p) + '" style="--cc:' + (p.color || u.color || 'var(--accent)') + '">' +
          '<div class="pic"' + (img ? ' style="background-image:url(\'' + ROOT + img + '\')"' : '') + '></div>' +
          '<div class="body"><div class="k"><span class="sw" style="background:' + (u.color || '#888') + '"></span>' + esc(u.title || '') + '</div>' +
          '<div class="t">' + esc(p.title) + '</div>' +
          (p.blurb ? '<div class="d">' + esc(p.blurb) + '</div>' : '') +
          '<div class="tags">' + (p.forms ? '<span class="ax-pill">' + p.forms.filter(function (f) { return f.kind === 'champion'; }).length + ' Champion forms</span>' : '') +
          (p.release && !(IDX.current && verCmp(p.release, IDX.current) <= 0) ? '<span class="ax-pill ax-pill--upcoming">Upcoming &middot; ' + esc(p.release) + '</span>' : '') +
          '</div></div></a>';
      }).join('') || '<div class="ax-empty">No character articles yet.</div>';
    });
    document.querySelectorAll('[data-char-list]').forEach(function (box) {
      var only = box.getAttribute('data-char-list');
      var unis = IDX.universes.filter(function (u) { return !only || u.id === only; });
      box.innerHTML = unis.map(function (u) {
        var list = charsOf(u.id).sort(function (a, b) { return (exists(b) - exists(a)) || a.title.localeCompare(b.title); });
        if (!list.length) return '';
        return '<div class="ax-clist"><h3><span class="sw" style="background:' + u.color + '"></span>' + (exists(u) ? linkHTML(u.id) : esc(u.title)) +
          '<span class="n">' + list.filter(exists).length + ' / ' + list.length + ' written</span></h3>' +
          '<div class="items">' + list.map(function (p) { return linkHTML(p.id); }).join('') + '</div></div>';
      }).join('');
    });
    document.querySelectorAll('[data-arcs]').forEach(function (box) {
      var list = arcsOf(box.getAttribute('data-arcs'));
      box.classList.add('ax-arcs');
      box.innerHTML = list.map(function (a) {
        var n = memoriesOf(a.id).length, w = memoriesOf(a.id).filter(function (m) { return m.written; }).length;
        var chip = a.status === 'built' ? '<span class="ax-chip ax-chip--written">Archive</span>'
                 : a.status === 'legacy' ? '<span class="ax-chip ax-chip--stub" title="Still on its pre-Archive page">Classic page</span>'
                 : '<span class="ax-chip ax-chip--stub">Not written</span>';
        var inner = (a.icon ? '<img src="' + ROOT + a.icon + '" alt="" loading="lazy">' : '<span class="noicon">' + (a.glyph || a.order || '') + '</span>') +
          '<div class="main"><div class="t">' + esc(a.title) + '</div><div class="s">' + esc(a.label || '') + (n ? ' &middot; ' + n + ' Memories (' + w + ' written)' : '') + '</div></div>' + chip;
        return exists(a) ? '<a class="ax-arc" href="' + href(a) + '">' + inner + '</a>' : '<div class="ax-arc is-planned">' + inner + '</div>';
      }).join('') || '<div class="ax-empty">No story arcs yet.</div>';
    });
    document.querySelectorAll('[data-universe-tiles]').forEach(function (box) {
      box.classList.add('ax-unis');
      box.innerHTML = IDX.universes.map(function (u) {
        var arcs = arcsOf(u.id).length, chars = charsOf(u.id, true).length;
        var mems = IDX.pages.filter(function (p) { return p.type === 'memory' && byId[p.arc] && byId[p.arc].universe === u.id; }).length;
        var stats = [arcs ? arcs + ' arcs' : '', chars ? chars + (chars === 1 ? ' article' : ' articles') : '', mems ? mems + ' Memories' : ''].filter(Boolean).join(' &middot; ');
        var inner = '<span class="bar" style="background:' + u.color + '"></span><div class="t">' + esc(u.title) + '</div>' +
          '<div class="s">' + (stats || 'Nothing written yet') + '</div>';
        return exists(u) ? '<a class="ax-uni" href="' + href(u) + '">' + inner + '</a>' : '<div class="ax-uni is-planned" title="Portal not built yet">' + inner + '<span class="soon">soon</span></div>';
      }).join('');
    });
    document.querySelectorAll('[data-memory-library]').forEach(function (box) {
      var html = '';
      IDX.universes.forEach(function (u) {
        var arcs = arcsOf(u.id).filter(function (a) { return memoriesOf(a.id).length; });
        if (!arcs.length) return;
        html += '<h2 class="ax-lib-uni"><span class="sw" style="background:' + u.color + '"></span>' + (exists(u) ? linkHTML(u.id) : esc(u.title)) + '</h2>';
        arcs.forEach(function (a) {
          var list = memoriesOf(a.id);
          html += '<h3 class="ax-mem-arc">' + linkHTML(a.id) + '<span class="n">' + list.length + '</span></h3><div class="ax-mem-grid">' +
            list.map(function (m, i) {
              var anchor = byId[m.anchor] || {};
              return memCard(m, i + 1, '<b>' + esc(anchor.title || '') + '</b> &middot; ' + esc(a.label || ''));
            }).join('') + '</div>';
        });
      });
      box.innerHTML = '<div class="ax-lib-bar"><label><input type="checkbox"> Written Memories only</label></div>' + (html || '<div class="ax-empty">No Memories yet.</div>');
      var cb = box.querySelector('input');
      cb.addEventListener('change', function () { box.classList.toggle('written-only', cb.checked); });
    });
  }

  /* ------------------------------------------------------------------
     Story sequence (prev / next) + infobox nav
     <div data-seq></div>   <span data-seq-prev></span> <span data-seq-next></span>
     ------------------------------------------------------------------ */
  function initSeq() {
    var cur = byId[PAGE];
    if (!cur || cur.type !== 'story') return;
    var arcs = IDX.pages.filter(function (p) { return p.type === 'story' && p.universe === cur.universe; })
      .sort(function (a, b) { return a.order - b.order; });
    var i = arcs.indexOf(cur), prev = arcs[i - 1], next = arcs[i + 1];
    function cell(e) { return e ? linkHTML(e.id) : '<span class="none">&mdash;</span>'; }
    document.querySelectorAll('[data-seq-prev]').forEach(function (el) { el.innerHTML = cell(prev); });
    document.querySelectorAll('[data-seq-next]').forEach(function (el) { el.innerHTML = cell(next); });
    document.querySelectorAll('[data-seq]').forEach(function (el) {
      el.className = 'ax-seq';
      el.innerHTML =
        '<div class="prev"><div class="l">&larr; Preceded by</div>' + cell(prev) + '</div>' +
        '<div class="mid">' + esc(uniTitle(cur.universe)) + '<br>' + (i + 1) + ' of ' + arcs.length + '</div>' +
        '<div class="next"><div class="l">Followed by &rarr;</div>' + cell(next) + '</div>';
    });
  }

  /* ------------------------------------------------------------------
     Navbox:  <div data-navbox="wizarding-world"></div>
     ------------------------------------------------------------------ */
  var NAV_GROUPS = [
    ['story', 'Story arcs'], ['character', 'Characters'], ['location', 'Locations'],
    ['faction', 'Factions'], ['object', 'Objects'], ['system', 'Systems']
  ];
  function initNavbox() {
    document.querySelectorAll('[data-navbox]').forEach(function (box) {
      var uni = box.getAttribute('data-navbox'), u = byId[uni];
      var rows = NAV_GROUPS.map(function (g) {
        var items = IDX.pages.filter(function (p) { return p.universe === uni && p.type === g[0]; });
        if (g[0] === 'story') items.sort(function (a, b) { return a.order - b.order; });
        if (!items.length) return '';
        return '<div class="ax-navbox-row"><div class="g">' + g[1] + '</div><div class="items">' +
          items.map(function (p) { return p.id === PAGE ? '<span class="self">' + esc(p.title) + '</span>' : linkHTML(p.id); }).join('<span class="dot">&bull;</span>') +
          '</div></div>';
      }).join('');
      box.className = 'ax-navbox';
      var head = exists(u) ? linkHTML(uni) : esc(u ? u.title : uni);
      box.innerHTML = '<div class="ax-navbox-head"><span class="t">' + head + '</span><button type="button">hide</button></div>' + rows;
      box.querySelector('button').addEventListener('click', function () {
        box.classList.toggle('collapsed');
        this.textContent = box.classList.contains('collapsed') ? 'show' : 'hide';
      });
    });
  }

  /* ------------------------------------------------------------------
     Lightbox:  <img data-zoom data-caption="...">
     ------------------------------------------------------------------ */
  function initLightbox() {
    var imgs = document.querySelectorAll('img[data-zoom]');
    if (!imgs.length) return;
    var lb = document.createElement('div');
    lb.className = 'ax-lightbox';
    lb.innerHTML = '<img alt=""><div class="cap"></div>';
    document.body.appendChild(lb);
    imgs.forEach(function (img) {
      img.addEventListener('click', function () {
        lb.querySelector('img').src = img.currentSrc || img.src;
        var cap = esc(img.getAttribute('data-caption') || img.alt || '');
        var c = creditFor(img);
        cap += c ? ' &middot; ' + creditLine(c)
                 : ' &middot; <span style="opacity:.7">Artist uncredited</span>';
        lb.querySelector('.cap').innerHTML = cap;
        lb.classList.add('show');
      });
    });
    lb.addEventListener('click', function (e) { if (!e.target.closest('a')) lb.classList.remove('show'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('show'); });
  }

  /* ------------------------------------------------------------------
     Power overview — multiversal power scale (1-10 per category).
     <div data-power='{"strength":1,...}' data-tier="Peak human"> <div class="ax-power-note">…</div> </div>
     Ratings compare every universe and every Champion on one scale.
     ------------------------------------------------------------------ */
  var TIER = ['Ordinary human', 'Peak human', 'Superhuman', 'Building level', 'City level',
              'Country level', 'Planetary', 'Stellar', 'Universal', 'Multiversal'];
  var SPEED = ['Ordinary human', 'Athletic human', 'Superhuman reflexes', 'Supersonic', 'Hypersonic',
               'Massively hypersonic', 'Light speed', 'Faster than light', 'Massively FTL', 'Beyond time'];
  var SKILL = ['Untrained', 'Novice', 'Trained', 'Skilled', 'Expert',
               'Veteran', 'Elite', 'Master', 'Among the multiverse\u2019s best', 'Peerless'];
  var VERSA = ['A single trick', 'A few abilities', 'Varied toolkit', 'Broad toolkit', 'One rule-bending ability',
               'Several rule-bending abilities', 'Extensive hax (mind, death, sealing)', 'Reality-bending', 'Reality-warping', 'Conceptual'];
  var POWER_CATS = [
    { key: 'strength',    label: 'Strength',    color: '#f97316', scale: TIER,  desc: 'Physical might: lifting, striking force.' },
    { key: 'durability',  label: 'Durability',  color: '#22c55e', scale: TIER,  desc: 'How much punishment the body (and its protections) can take.' },
    { key: 'speed',       label: 'Speed',       color: '#ef4444', scale: SPEED, desc: 'Movement, reaction and combat speed.' },
    { key: 'combat',      label: 'Combat',      color: '#3b82f6', scale: SKILL, desc: 'Fighting skill and technique, armed, unarmed or dueling.' },
    { key: 'intellect',   label: 'Intellect',   color: '#eab308', scale: SKILL, desc: 'Intelligence, strategy and knowledge.' },
    { key: 'power',       label: 'Power',       color: '#d946ef', scale: TIER,  desc: 'Energy output: magic, ki, beams, blasts.' },
    { key: 'versatility', label: 'Versatility', color: '#14b8a6', scale: VERSA, desc: 'Breadth of abilities, and how far they bend the rules (hax).' }
  ];
  function powerLegend() {
    return [['Strength, Durability, Power', TIER], ['Speed', SPEED], ['Combat, Intellect', SKILL], ['Versatility', VERSA]]
      .map(function (g) { return '<div><b>' + g[0] + '</b><ol>' + g[1].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div>'; }).join('') +
      '<div><b>How to read it</b>Every Champion and every universe is rated on the same 1&ndash;10 scale, so a 3 means the same thing for a wizard as for a Saiyan. These are story ratings, separate from gameplay stats.</div>';
  }
  function renderPowerBox(box, vals, tier, form) {
    var note = box.querySelector('.ax-power-note');
    var C = 2 * Math.PI * 32;
    var rings = POWER_CATS.map(function (c) {
      var v = Math.max(0, Math.min(10, +vals[c.key] || 0));
      var rank = v ? c.scale[v - 1] : '—';
      return '<div class="ax-ring" title="' + esc(c.label + ' ' + v + '/10: ' + rank + '. ' + c.desc) + '">' +
        '<svg viewBox="0 0 80 80" aria-hidden="true"><circle class="track" cx="40" cy="40" r="32"/>' +
        '<circle class="val" cx="40" cy="40" r="32" stroke="' + c.color + '" stroke-dasharray="' + (C * v / 10).toFixed(1) + ' ' + C.toFixed(1) + '"/>' +
        '<text class="num" x="40" y="40" text-anchor="middle" dominant-baseline="central">' + v + '</text></svg>' +
        '<div class="lbl">' + c.label + '</div><div class="rank">' + esc(rank) + '</div></div>';
    }).join('');
    var open = box.classList.contains('show-scale');
    box.classList.add('ax-power');
    box.innerHTML =
      '<div class="ax-power-head"><span class="t">Power overview</span>' +
      (form ? '<span class="form">' + esc(form) + '</span>' : '') +
      (tier ? '<span class="tier">' + esc(tier) + '</span>' : '') +
      '<span class="scale">Multiversal scale, 1&ndash;10 &middot; <button type="button">' + (open ? 'hide scale' : 'show scale') + '</button></span></div>' +
      '<div class="ax-power-rings">' + rings + '</div>' +
      '<div class="ax-power-legend">' + powerLegend() + '</div>';
    if (note) box.appendChild(note);
    box.querySelector('.scale button').addEventListener('click', function () {
      box.classList.toggle('show-scale');
      this.textContent = box.classList.contains('show-scale') ? 'hide scale' : 'show scale';
    });
  }
  function initPower() {
    document.querySelectorAll('[data-power]').forEach(function (box) {
      var vals = null, attr = box.getAttribute('data-power');
      if (attr) { try { vals = JSON.parse(attr); } catch (e) { vals = null; } }
      var me = byId[box.getAttribute('data-power-of') || PAGE] || {};
      if (!vals) vals = me.power;
      if (!vals) return;
      renderPowerBox(box, vals, box.getAttribute('data-tier') || me.tier || '');
    });
  }

  /* ------------------------------------------------------------------
     Power rankings table:  <div data-rankings></div>
     Built from every index entry that has a `power` block.
     ------------------------------------------------------------------ */
  function initRankings() {
    var box = document.querySelector('[data-rankings]');
    if (!box) return;
    /* characters with forms get one row per form (Champion forms and their transformations) */
    var rows = [];
    IDX.pages.forEach(function (p) {
      if (p.forms) p.forms.forEach(function (f) {
        if (f.power) rows.push({ id: p.id, title: p.title, universe: p.universe, form: f.name, formKey: f.key,
          tf: f.kind === 'transformation', image: f.image, tier: f.tier, power: f.power });
      });
      else if (p.power) rows.push(p);
    });
    var sortKey = 'total', dir = -1, uni = '', formsMode = 'all';
    function rowName(p) { return p.title + (p.form ? ' ' + p.form : ''); }
    function total(p) { return POWER_CATS.reduce(function (t, c) { return t + (+p.power[c.key] || 0); }, 0); }
    function val(p, k) { return k === 'total' ? total(p) : k === 'name' ? rowName(p) : k === 'universe' ? uniTitle(p.universe) : (+p.power[k] || 0); }
    var unis = rows.map(function (p) { return p.universe; }).filter(function (u, i, a) { return u && a.indexOf(u) === i; });
    function render() {
      var list = rows.filter(function (p) {
        return (!uni || p.universe === uni) && (formsMode === 'all' || !p.tf);
      }).sort(function (a, b) {
        var x = val(a, sortKey), y = val(b, sortKey);
        return (typeof x === 'string' ? x.localeCompare(y) : x - y) * dir || rowName(a).localeCompare(rowName(b));
      });
      var head = '<tr><th data-k="name">Character</th><th data-k="universe">Universe</th>' +
        POWER_CATS.map(function (c) { return '<th data-k="' + c.key + '" title="' + esc(c.desc) + '"><span class="sw" style="background:' + c.color + '"></span>' + c.label + '</th>'; }).join('') +
        '<th data-k="total">Total</th></tr>';
      var body = list.map(function (p) {
        var img = p.image ? '<img src="' + ROOT + p.image + '" alt="">' : '<span class="noimg"></span>';
        var who = p.formKey && exists(byId[p.id])
          ? '<a href="' + href(byId[p.id]) + '?form=' + p.formKey + '">' + esc(p.title) + '</a> <span class="form' + (p.tf ? ' tf' : '') + '">' + esc(p.form) + '</span>'
          : linkHTML(p.id) + (p.form ? ' <span class="form">' + esc(p.form) + '</span>' : '');
        return '<tr><td class="who">' + img + '<div>' + who + (p.tier ? '<div class="tier">' + esc(p.tier) + '</div>' : '') + '</div></td>' +
          '<td>' + esc(uniTitle(p.universe)) + '</td>' +
          POWER_CATS.map(function (c) {
            var v = +p.power[c.key] || 0;
            return '<td class="cell" title="' + esc(c.label + ': ' + (v ? c.scale[v - 1] : '\u2014')) + '"><span class="bar"><i style="width:' + v * 10 + '%;background:' + c.color + '"></i></span><b>' + v + '</b></td>';
          }).join('') + '<td class="tot">' + total(p) + '</td></tr>';
      }).join('');
      box.querySelector('table').innerHTML = '<thead>' + head + '</thead><tbody>' + (body || '<tr><td colspan="10" class="empty">No characters rated yet.</td></tr>') + '</tbody>';
      box.querySelectorAll('th').forEach(function (th) {
        if (th.getAttribute('data-k') === sortKey) th.classList.add('on', dir < 0 ? 'desc' : 'asc');
        th.addEventListener('click', function () {
          var k = th.getAttribute('data-k');
          if (k === sortKey) dir = -dir; else { sortKey = k; dir = (k === 'name' || k === 'universe') ? 1 : -1; }
          render();
        });
      });
      box.querySelector('.count').textContent = list.length + (list.length === 1 ? ' entry' : ' entries');
    }
    box.classList.add('ax-rankings');
    box.innerHTML = '<div class="ax-rankings-bar"><label>Universe <select><option value="">All universes</option>' +
      unis.map(function (u) { return '<option value="' + u + '">' + esc(uniTitle(u)) + '</option>'; }).join('') +
      '</select></label><label>Forms <select class="forms"><option value="all">Every form</option><option value="champions">Champion forms only</option></select></label>' +
      '<span class="count"></span><button type="button" class="legend-btn">show scale</button></div>' +
      '<div class="ax-power-legend">' + powerLegend() + '</div>' +
      '<div class="ax-rankings-wrap"><table></table></div>';
    box.querySelector('select').addEventListener('change', function () { uni = this.value; render(); });
    box.querySelector('select.forms').addEventListener('change', function () { formsMode = this.value; render(); });
    box.querySelector('.legend-btn').addEventListener('click', function () {
      box.classList.toggle('show-scale');
      this.textContent = box.classList.contains('show-scale') ? 'hide scale' : 'show scale';
    });
    render();
  }

  /* ------------------------------------------------------------------
     Spoiler notice for unreleased (Upcoming) articles
     Uses the page's index `release` vs IDX.current (null = pre-release).
     ------------------------------------------------------------------ */
  function verCmp(a, b) {
    a = String(a).replace(/^v/, '').split('.').map(Number); b = String(b).replace(/^v/, '').split('.').map(Number);
    for (var i = 0; i < 3; i++) { var d = (a[i] || 0) - (b[i] || 0); if (d) return d; }
    return 0;
  }
  function initSpoiler() {
    var me = byId[PAGE], tabs = document.querySelector('.ax-tabs');
    if (!me || !me.release || !tabs) return;
    if (IDX.current && verCmp(me.release, IDX.current) <= 0) return;
    var el = document.createElement('div');
    el.className = 'ax-spoiler';
    el.innerHTML = '<span class="ico" aria-hidden="true">&#9888;</span><div><b>Upcoming content.</b> This article covers ' +
      (me.universe ? esc(uniTitle(me.universe)) + ' story' : 'story') + ' arriving in <b>' + esc(me.release) +
      '</b>, which hasn&rsquo;t been released yet. Read on at your own risk.</div>';
    tabs.parentNode.insertBefore(el, tabs);
  }

  /* ------------------------------------------------------------------
     Theme music:  <div data-theme-audio="audio/…mp3" data-track="…" data-source="…"></div>
     Click to play (never autoplays on articles); loops.
     ------------------------------------------------------------------ */
  function buildTheme(box) {
    if (box._audio) { box._audio.pause(); box._audio = null; }
    box.classList.remove('playing', 'missing');
    var audio = new Audio(ROOT + box.getAttribute('data-theme-audio'));
    audio.loop = true; audio.volume = 0.6; audio.preload = 'none';
    box._audio = audio;
    box.classList.add('ax-theme');
    box.innerHTML = '<button type="button" aria-label="Play theme">&#9654;</button><div><div class="k">Theme</div>' +
      '<div class="tr">' + esc(box.getAttribute('data-track') || 'Theme') + '</div>' +
      (box.getAttribute('data-source') ? '<div class="src">from ' + esc(box.getAttribute('data-source')) + '</div>' : '') + '</div>';
    var btn = box.querySelector('button');
    function set(on) { box.classList.toggle('playing', on); btn.innerHTML = on ? '&#10074;&#10074;' : '&#9654;'; btn.setAttribute('aria-label', on ? 'Pause theme' : 'Play theme'); }
    btn.addEventListener('click', function () {
      if (audio.paused) { audio.play().then(function () { set(true); }).catch(function () { box.classList.add('missing'); btn.disabled = true; }); }
      else { audio.pause(); set(false); }
    });
    audio.addEventListener('error', function () { if (box._audio !== audio) return; set(false); box.classList.add('missing'); btn.disabled = true; btn.title = 'Audio file not added yet'; });
  }
  function initTheme() {
    document.querySelectorAll('[data-theme-audio]').forEach(buildTheme);
  }

  /* ------------------------------------------------------------------
     Forms (characters with several Champion forms / transformations)
     Index entry `forms: [...]`. Markup hooks inside the infobox:
       <div data-forms></div>                 tab strip (above the portrait)
       <img data-form-img>  <div data-form-caption>  <div data-form-credit>
       <div data-form-card></div>             Champion / transformation note
       <div data-theme-audio data-form-theme> theme player (per Champion)
       <div data-form-champions></div>        list of every Champion sheet
     and <div data-power data-form-power> for the Power overview.
     ?form=<key> in the URL opens a form directly.
     ------------------------------------------------------------------ */
  function initForms() {
    var me = byId[PAGE];
    if (!me || !me.forms || !me.forms.length) return;
    var forms = me.forms, byKey = {};
    forms.forEach(function (f) { byKey[f.key] = f; });
    function champOf(f) { return f.kind === 'transformation' ? byKey[f.of] : f; }
    function sheetLink(f, text) {
      return f.built ? '<a href="' + ROOT + f.champion + '">' + text + '</a>'
                     : '<span class="ax-soon" title="Champion sheet not built yet">' + text + '</span>';
    }

    document.querySelectorAll('[data-form-champions]').forEach(function (el) {
      el.innerHTML = forms.filter(function (f) { return f.kind === 'champion'; }).map(function (f) {
        var tfs = forms.filter(function (t) { return t.of === f.key; }).map(function (t) { return esc(t.name); });
        return '<div class="ax-champ"><span class="sw" style="background:' + f.color + '"></span><div>' +
          sheetLink(f, esc(f.name)) + ' <span class="sub">' + esc(f.role) + (f.built ? '' : ' &middot; sheet coming') + '</span>' +
          (tfs.length ? '<div class="sub">Transforms: ' + tfs.join(', ') + '</div>' : '') + '</div></div>';
      }).join('');
    });

    var strip = document.querySelector('[data-forms]');
    if (!strip) return;
    var ib = strip.closest('.ax-infobox') || document.body;
    var img = ib.querySelector('[data-form-img]'), cap = ib.querySelector('[data-form-caption]'),
        credit = ib.querySelector('[data-form-credit]'), card = ib.querySelector('[data-form-card]'),
        theme = ib.querySelector('[data-form-theme]'), power = document.querySelector('[data-form-power]');
    strip.classList.add('ax-forms');
    strip.setAttribute('role', 'tablist');
    strip.innerHTML = '<div class="k">Form</div><div class="b">' + forms.map(function (f) {
      var tip = f.kind === 'transformation' ? f.name + ' (transformation of ' + byKey[f.of].name + ')' : f.name + ' (Champion · ' + f.role + ')';
      return '<button type="button" role="tab" class="' + (f.kind === 'transformation' ? 'tf' : '') + '" data-form="' + f.key + '" style="--fc:' + f.color + '" title="' + esc(tip) + '">' + esc(f.tab) + '</button>';
    }).join('') + '</div>';

    function set(key, push) {
      var f = byKey[key] || forms[0], ch = champOf(f);
      strip.querySelectorAll('button').forEach(function (b) {
        var on = b.getAttribute('data-form') === f.key;
        b.classList.toggle('active', on); b.setAttribute('aria-selected', on);
      });
      [ib, power].forEach(function (el) { if (el) { el.classList.add('ax-formed'); el.style.setProperty('--accent', f.color); } });
      if (img) {
        img.src = ROOT + f.image;
        img.alt = me.title + ' (' + f.name + ')';
        img.setAttribute('data-caption', me.title + ' · ' + f.name);
      }
      if (cap) cap.textContent = f.kind === 'transformation' ? f.name + ' · transformation' : f.name + ' · Champion portrait';
      if (credit) { credit.setAttribute('data-credit-for', f.image); credit.innerHTML = creditHTML(f.image); }
      if (card) {
        card.innerHTML = (f.kind === 'transformation'
          ? '<div class="k">Transformation</div><div>Unlocked by the ' + sheetLink(ch, esc(ch.name) + ' Champion') + ' <span class="sub">(' + esc(ch.role) + ')</span></div>'
          : '<div class="k">Champion &middot; ' + esc(f.role) + '</div><div>' + (f.built ? sheetLink(f, 'View the ' + esc(f.key === forms[0].key ? me.title : me.title + ' (' + f.name + ')') + ' Champion page &rarr;') : '<span class="sub">Champion sheet coming soon</span>') + '</div>') +
          (f.era ? '<div class="era"><span class="sub">Defining era:</span> ' + esc(f.era) + '</div>' : '');
      }
      if (theme) {
        var t = f.theme || ch.theme;
        theme.style.display = t ? '' : 'none';
        if (t && theme.getAttribute('data-theme-audio') !== t.audio) {
          theme.setAttribute('data-theme-audio', t.audio);
          theme.setAttribute('data-track', t.track || '');
          theme.setAttribute('data-source', t.source || '');
          buildTheme(theme);
        } else if (!t && theme._audio) { theme._audio.pause(); }
      }
      if (power && f.power) renderPowerBox(power, f.power, f.tier || '', f.name);
      if (push && window.history && history.replaceState) {
        var u = new URL(location.href);
        if (f.key === forms[0].key) u.searchParams.delete('form'); else u.searchParams.set('form', f.key);
        history.replaceState(null, '', u.toString());
      }
    }
    strip.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-form]');
      if (b) set(b.getAttribute('data-form'), true);
    });
    strip.addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      var i = forms.indexOf(byKey[strip.querySelector('button.active').getAttribute('data-form')]);
      i = (i + (ev.key === 'ArrowRight' ? 1 : -1) + forms.length) % forms.length;
      set(forms[i].key, true);
      strip.querySelector('button[data-form="' + forms[i].key + '"]').focus();
    });
    var q = null;
    try { q = new URLSearchParams(location.search).get('form'); } catch (e) { q = null; }
    set(q && byKey[q] ? q : forms[0].key, false);
    /* gallery "show this form" buttons: <a data-show-form="ss"> */
    document.querySelectorAll('[data-show-form]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        set(a.getAttribute('data-show-form'), true);
        var t = document.querySelector('.ax-tab[data-tab="article"]'); if (t) t.click();
        ib.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ------------------------------------------------------------------
     Hover previews (Fandom-style page previews) on built/legacy links
     ------------------------------------------------------------------ */
  function initPreviews() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var card = document.createElement('div');
    card.className = 'ax-preview';
    document.body.appendChild(card);
    var timer = null, current = null;
    function entryFor(a) {
      if (a.closest('.ax-header, .ax-crumbs, .ax-menu, .ax-search-results, .ax-preview') || a.classList.contains('mem-link') || a.classList.contains('ax-red')) return null;
      var id = a.getAttribute('data-link');
      var e = id ? byId[id] : null;
      if (!e) {
        var href = (a.getAttribute('href') || '').split('?')[0];
        IDX.pages.concat(IDX.universes).some(function (p) { if (exists(p) && href && href === ROOT + p.path) { e = p; return true; } return false; });
      }
      return e && exists(e) && e.id !== PAGE && (e.blurb || e.image || e.icon || e.banner) ? e : null;
    }
    function show(a, e) {
      var img = e.image || e.icon || e.banner;
      var kick = [TYPE_LABEL[e.type] || '', e.universe ? uniTitle(e.universe) : '', e.anchor ? uniTitle(e.anchor) : ''].filter(Boolean).join(' \u00b7 ');
      card.innerHTML = (img ? '<div class="pi" style="background-image:url(\'' + ROOT + img + '\')"></div>' : '') +
        '<div class="pb"><div class="pk">' + esc(kick) + '</div><div class="pt">' + esc(e.title) + '</div>' +
        (e.blurb ? '<div class="pd">' + esc(e.blurb) + '</div>' : '') +
        (e.release && !(IDX.current && verCmp(e.release, IDX.current) <= 0) ? '<span class="ax-pill ax-pill--upcoming">Upcoming &middot; ' + esc(e.release) + '</span>' : '') + '</div>';
      card.classList.toggle('has-img', !!img);
      var r = a.getBoundingClientRect(), w = 320;
      var left = Math.min(Math.max(8, r.left + window.scrollX), window.scrollX + document.documentElement.clientWidth - w - 12);
      card.style.left = left + 'px';
      card.style.top = (r.bottom + window.scrollY + 8) + 'px';
      card.classList.add('show');
      var cr = card.getBoundingClientRect();
      if (cr.bottom > window.innerHeight - 8) card.style.top = (r.top + window.scrollY - cr.height - 8) + 'px';
    }
    function hide() { clearTimeout(timer); card.classList.remove('show'); current = null; }
    document.addEventListener('mouseover', function (ev) {
      var a = ev.target.closest && ev.target.closest('a');
      if (!a || a === current) return;
      var e = entryFor(a);
      clearTimeout(timer);
      if (!e) { if (!ev.target.closest('.ax-preview')) hide(); return; }
      current = a;
      timer = setTimeout(function () { show(a, e); }, 280);
    });
    document.addEventListener('mouseout', function (ev) {
      var a = ev.target.closest && ev.target.closest('a');
      if (a && a === current && !(ev.relatedTarget && a.contains(ev.relatedTarget))) hide();
    });
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* ------------------------------------------------------------------
     Image credits (data/image-credits.js, keyed by path from site root)
     Gallery figures get an "Art by" line automatically.
     ------------------------------------------------------------------ */
  var CREDITS = window.IMAGE_CREDITS || {};
  function creditFor(img) {
    var src = img.getAttribute('src') || '';
    if (ROOT && src.indexOf(ROOT) === 0) src = src.slice(ROOT.length);
    return CREDITS[src] || null;
  }
  /* one line of credit markup: "Art by <artist>" or, for official art, "Official art: <source>" */
  function creditLine(c) {
    if (!c) return '';
    var a = '<a href="' + esc(c.url) + '" target="_blank" rel="noopener"' + (c.owner ? ' title="' + esc(c.owner) + '"' : '') + '>';
    return c.source ? 'Official art: ' + a + esc(c.source) + '</a>' : 'Art by ' + a + esc(c.artist) + '</a>';
  }
  function creditHTML(path) {
    var c = CREDITS[path];
    return c ? creditLine(c) : '<span class="none">Artist uncredited</span>';
  }
  function initCredits() {
    /* explicit slots:  <div data-credit-for="images/…jpg"></div> */
    document.querySelectorAll('[data-credit-for]').forEach(function (el) {
      el.innerHTML = creditHTML(el.getAttribute('data-credit-for'));
    });
    document.querySelectorAll('.ax-gallery figure').forEach(function (fig) {
      var img = fig.querySelector('img'), cap = fig.querySelector('figcaption');
      if (!img || !cap) return;
      var c = creditFor(img), line = document.createElement('span');
      line.className = 'credit' + (c ? '' : ' none');
      line.innerHTML = c ? creditLine(c) : 'Artist uncredited';
      cap.appendChild(line);
    });
  }

  /* hide images whose file is missing, keep layout tidy */
  function initImageFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
      img.addEventListener('error', function () { img.closest(img.getAttribute('data-fallback')) && (img.closest(img.getAttribute('data-fallback')).style.display = 'none'); });
    });
  }

  /* ------------------------------------------------------------------ */
  renderHeader();
  initMemories();
  initMemoryArt();
  initHubs();
  initSeq();
  initNavbox();
  resolveLinks();
  initMemLinks();
  initTOC();
  initTabs();
  initSpoiler();
  initPower();
  initRankings();
  initTheme();
  initPreviews();
  initCredits();
  initForms();
  initLightbox();
  initImageFallbacks();
})();
