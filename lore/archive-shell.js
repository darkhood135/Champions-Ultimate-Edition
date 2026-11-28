/* =====================================================================
   THE ARCHIVE — persistent shell (seamless page-to-page navigation)

   Inside the Archive (lore.html and everything under lore/), link clicks
   fetch the next page and swap it in place instead of reloading. The
   address bar, Back/Forward and #anchors behave normally. Anything inside
   #ax-shell-keep (backdrop, music player) is never unloaded.

   Loaded automatically by archive.js on wiki pages; Memory pages load it
   directly:  <script src="../archive-shell.js"></script>
   Opened as a plain file (file://) the swapping stays off and every link
   is a normal page load.

   Events, fired on document:
     archive:leave   just before a swap          detail { from, to }
     archive:page    after every page is ready   detail { url, swapped }
                     (also once on the first load, swapped: false)
   Links with data-no-swap always do a normal page load.
   API: window.ArchiveShell = { seamless, root, keep, inScope(url), go(url), load(src) }
   The shell also loads lore/archive-ambience.js (backdrops + music).
   ===================================================================== */
(function () {
  'use strict';
  if (window.ArchiveShell) return;

  var html = document.documentElement;
  var me = document.currentScript;
  var SHELL_URL = new URL(me ? me.getAttribute('src') : 'lore/archive-shell.js', location.href).href;
  var SITE = new URL('../', SHELL_URL);                   /* site root */
  var SEAMLESS = /^https?:$/.test(location.protocol) && !!(window.fetch && window.DOMParser && window.Promise && history.pushState);
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function dispatch(name, detail) {
    var ev;
    try { ev = new CustomEvent(name, { detail: detail }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail); }
    document.dispatchEvent(ev);
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* Archive page = lore.html or lore/**.html under the site root */
  function inScope(u) {
    if (u.origin !== location.origin) return false;
    var base = SITE.pathname, p = u.pathname;
    if (p.indexOf(base) !== 0) return false;
    var r = decodeURIComponent(p.slice(base.length));
    return r === 'lore.html' || /^lore\/.+\.html$/.test(r);
  }
  function pageKey(u) { return u.origin + u.pathname; }

  /* ---------- persistent layer + shell styles ---------- */
  var keep = document.getElementById('ax-shell-keep');
  if (!keep) {
    keep = document.createElement('div');
    keep.id = 'ax-shell-keep';
    keep.setAttribute('data-shell-keep', '');
    document.body.appendChild(keep);
  }
  var css = document.createElement('style');
  css.id = 'ax-shell-style';
  css.setAttribute('data-shell-keep', '');
  css.textContent =
    'html.ax-swap-out body > :not([data-shell-keep]) { opacity: 0 !important; transition: opacity .12s ease !important; }' +
    'html.ax-swap-in body > :not([data-shell-keep]) { transition: opacity .16s ease !important; }' +
    '@media (prefers-reduced-motion: reduce) { html.ax-swap-out body > :not([data-shell-keep]), html.ax-swap-in body > :not([data-shell-keep]) { transition: none !important; } }';
  document.head.appendChild(css);

  var api = window.ArchiveShell = {
    seamless: SEAMLESS,
    root: SITE.href,          /* absolute URL of the site root */
    keep: keep,               /* persistent container */
    inScope: function (url) { return inScope(new URL(url, location.href)); },
    go: function (url) { location.href = new URL(url, location.href).href; }
  };

  /* ---------- scripts already on the page; shared loader ---------- */
  var LOADED = {};
  [].slice.call(document.scripts).forEach(function (s) { if (s.src) LOADED[s.src] = true; });
  LOADED[SHELL_URL] = true;
  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = s.onerror = function () { resolve(); };
      document.body.appendChild(s);
      LOADED[src] = true;
    });
  }
  /* load a script once (path from the site root, or absolute); page swaps skip it afterwards */
  api.load = function (src) {
    src = new URL(src, SITE).href;
    return LOADED[src] ? Promise.resolve() : loadScript(src);
  };
  /* backdrops + music (lore/archive-ambience.js) */
  api.load('lore/archive-ambience.js');

  /* stylesheet identity, fixed while the URL is still the one it loaded with */
  function headItems() {
    return [].slice.call(document.head.querySelectorAll('link[rel~="stylesheet"], style')).filter(function (n) {
      return !n.hasAttribute('data-shell-keep');
    });
  }
  function sigOf(n, base) {
    return n.tagName === 'STYLE' ? 's:' + n.textContent : 'l:' + new URL(n.getAttribute('href'), base).href;
  }
  headItems().forEach(function (n) { n._axSig = sigOf(n, location.href); });

  /* ---------- fresh loads: restore scroll after Back/Forward or reload ---------- */
  var SCROLL = {};
  try { SCROLL = JSON.parse(sessionStorage.getItem('ax-shell-scroll') || '{}') || {}; } catch (e) { SCROLL = {}; }
  function saveScrollStore() {
    try {
      var keys = Object.keys(SCROLL);
      if (keys.length > 60) keys.slice(0, keys.length - 60).forEach(function (k) { delete SCROLL[k]; });
      sessionStorage.setItem('ax-shell-scroll', JSON.stringify(SCROLL));
    } catch (e) {}
  }
  /* instant jumps: archive.css has scroll-behavior: smooth */
  function jump(y) {
    try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, y); }
  }
  function hashTarget(hash) {
    var id = '';
    try { id = decodeURIComponent(hash.slice(1)); } catch (e) { id = hash.slice(1); }
    return (id && document.getElementById(id)) || null;
  }
  function pinTo(el) {
    try { el.scrollIntoView({ block: 'start', behavior: 'instant' }); }
    catch (e) { el.scrollIntoView(true); }
  }
  /* Images above a target load after the jump and push it down; keep it
     pinned while they load (about 2.5 s), until the reader scrolls. */
  var unpin = null;
  function toHash(hash) {
    var el = hashTarget(hash);
    if (!el) return false;
    if (unpin) unpin();
    pinTo(el);
    var done = false, timer;
    function stop() {
      if (done) return; done = true; clearTimeout(timer); unpin = null;
      ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.removeEventListener(t, stop, true); });
      document.removeEventListener('load', again, true);
    }
    function again(ev) {
      if (done || !el.isConnected) return stop();
      if (ev && ev.target && ev.target.tagName !== 'IMG') return;
      pinTo(el);
    }
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, stop, true); });
    document.addEventListener('load', again, true);
    timer = setTimeout(function () { again(); stop(); }, 2500);
    unpin = stop;
    return true;
  }

  if (!SEAMLESS) {
    dispatch('archive:page', { url: location.href, swapped: false });
    return;
  }

  /* ---------- history entries carry a key for their scroll position ---------- */
  function newKey() { return 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function curKey() { return history.state && history.state.axKey; }
  var rawReplace = history.replaceState;
  /* pages call replaceState(null, …) for tabs/forms: keep our key on the entry */
  history.replaceState = function (st, title, url) {
    var k = curKey();
    if (k && (st == null || (typeof st === 'object' && !st.axKey))) st = Object.assign({}, st || {}, { axKey: k });
    return rawReplace.call(history, st, title, url);
  };
  if (!curKey()) rawReplace.call(history, Object.assign({}, history.state || {}, { axKey: newKey() }), '');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; var k = curKey(); if (k) SCROLL[k] = window.scrollY; });
  }, { passive: true });
  window.addEventListener('pagehide', saveScrollStore);

  var navType = '';
  try { navType = (performance.getEntriesByType('navigation')[0] || {}).type || ''; } catch (e) {}
  if (location.hash && navType !== 'back_forward' && navType !== 'reload') toHash(location.hash);
  if ((navType === 'back_forward' || navType === 'reload') && SCROLL[curKey()] != null) {
    var y0 = SCROLL[curKey()];
    jump(y0);
    window.addEventListener('load', function () { if (Math.abs(window.scrollY - y0) > 2) jump(y0); });
  }

  /* ---------- swapping ---------- */
  var CUR = pageKey(location);
  var NAV = 0;

  function copyAttrs(from, to, skip) {
    [].slice.call(to.attributes).forEach(function (a) {
      if (skip.indexOf(a.name) < 0 && !from.hasAttribute(a.name)) to.removeAttribute(a.name);
    });
    [].slice.call(from.attributes).forEach(function (a) {
      if (skip.indexOf(a.name) < 0) to.setAttribute(a.name, a.value);
    });
  }

  /* warm the cache for stylesheets the next page needs */
  function preloadStyles(doc, base) {
    var have = {};
    headItems().forEach(function (n) { have[n._axSig] = true; });
    var jobs = [].slice.call(doc.head.querySelectorAll('link[rel~="stylesheet"]')).map(function (n) {
      var href = new URL(n.getAttribute('href'), base).href;
      if (have['l:' + href]) return null;
      return new Promise(function (resolve) {
        var l = document.createElement('link');
        l.rel = 'preload'; l.as = 'style'; l.href = href;
        l.onload = l.onerror = function () { l.remove(); resolve(); };
        document.head.appendChild(l);
        setTimeout(resolve, 2500);
      });
    }).filter(Boolean);
    return Promise.all(jobs);
  }

  /* make <head> styles match the next page; resolves once new sheets are applied */
  function syncHead(doc, base) {
    var want = [].slice.call(doc.head.querySelectorAll('link[rel~="stylesheet"], style')).map(function (n) {
      return { node: n, sig: sigOf(n, base) };
    });
    var wanted = {}; want.forEach(function (w) { wanted[w.sig] = true; });
    var have = {};
    headItems().forEach(function (n) {
      if (wanted[n._axSig]) have[n._axSig] = true; else n.remove();
    });
    var loads = [];
    want.forEach(function (w) {
      if (have[w.sig]) return;
      var n;
      if (w.node.tagName === 'STYLE') {
        n = document.createElement('style');
        n.textContent = w.node.textContent;
      } else {
        n = document.createElement('link');
        n.rel = 'stylesheet';
        n.href = w.sig.slice(2);
        loads.push(new Promise(function (resolve) { n.onload = n.onerror = resolve; setTimeout(resolve, 1500); }));
      }
      n._axSig = w.sig;
      document.head.insertBefore(n, css);
    });
    return Promise.all(loads);
  }

  function finishScroll(u, opts) {
    if (opts.pop && SCROLL[curKey()] != null) { jump(SCROLL[curKey()]); return; }
    if (u.hash && toHash(u.hash)) return;
    jump(0);
  }

  function swap(doc, u, opts) {
    if (unpin) unpin();
    dispatch('archive:leave', { from: location.href, to: u.href });
    if (window.ArchiveJS) window.ArchiveJS.teardown();
    if (!opts.pop) {
      var k = curKey(); if (k) SCROLL[k] = window.scrollY;
      history.pushState({ axKey: newKey() }, '', u.href);
    }
    CUR = pageKey(location);
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();

    return syncHead(doc, u.href).then(function () {
      document.title = doc.title;
      copyAttrs(doc.documentElement, html, ['class']);
      copyAttrs(doc.body, document.body, []);

      [].slice.call(document.body.childNodes).forEach(function (n) {
        if (!(n.nodeType === 1 && n.hasAttribute('data-shell-keep'))) n.remove();
      });
      var scripts = [];
      [].slice.call(doc.body.childNodes).forEach(function (n) {
        if (n.nodeType === 1 && n.tagName === 'SCRIPT') { scripts.push(n); return; }
        document.body.insertBefore(document.adoptNode(n), keep);
      });

      /* data scripts load once; archive.js runs init() again */
      var chain = Promise.resolve(), ran = false;
      scripts.forEach(function (s) {
        if (!s.getAttribute('src')) return;   /* inline scripts (e.g. Live Server's reload hook) are skipped */
        var src = new URL(s.getAttribute('src'), u.href).href;
        if (src === SHELL_URL) return;
        chain = chain.then(function () {
          if (!LOADED[src]) { if (/\/archive\.js$/.test(src)) ran = true; return loadScript(src); }
          if (/\/archive\.js$/.test(src) && window.ArchiveJS && !ran) { ran = true; window.ArchiveJS.init(); }
        });
      });
      return chain;
    }).then(function () {
      finishScroll(u, opts);
      html.classList.remove('ax-swap-out');
      html.classList.add('ax-swap-in');
      setTimeout(function () { html.classList.remove('ax-swap-in'); }, 220);
      saveScrollStore();
      dispatch('archive:page', { url: location.href, swapped: true });
    });
  }

  function go(url, opts) {
    opts = opts || {};
    var u = new URL(url, location.href);
    if (!inScope(u)) { location.href = u.href; return; }
    if (!opts.pop && pageKey(u) === CUR && u.search === location.search && u.hash) { location.hash = u.hash; return; }
    var token = ++NAV;
    html.classList.remove('ax-swap-in');
    html.classList.add('ax-swap-out');
    var fade = wait(REDUCED ? 0 : 120);
    fetch(u.href, { credentials: 'same-origin' }).then(function (r) {
      var type = r.headers.get('content-type') || 'text/html';
      if (!r.ok || type.indexOf('html') < 0) throw new Error('not an Archive page');
      return r.text().then(function (t) {
        var fin = new URL(r.url || u.href); fin.hash = u.hash;
        return { text: t, url: fin };
      });
    }).then(function (res) {
      if (token !== NAV) return;
      var doc = new DOMParser().parseFromString(res.text, 'text/html');
      return Promise.all([fade, preloadStyles(doc, res.url.href)]).then(function () {
        if (token !== NAV) return;
        return swap(doc, res.url, opts);
      });
    }).catch(function () {
      if (token !== NAV) return;
      if (opts.pop) location.reload(); else location.href = u.href;
    });
  }
  api.go = function (url) { go(url); };

  document.addEventListener('click', function (ev) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || a.hasAttribute('download') || a.hasAttribute('data-no-swap')) return;
    if (a.target && a.target !== '_self') return;
    var raw = a.getAttribute('href');
    if (!raw || raw.charAt(0) === '#') return;            /* same-page anchors: the browser handles them */
    var u = new URL(a.href, location.href);
    if (!inScope(u)) return;                              /* outside the Archive: normal load */
    if (pageKey(u) === CUR && u.search === location.search && u.hash) return;
    ev.preventDefault();
    go(u.href);
  });

  window.addEventListener('popstate', function () {
    if (pageKey(location) === CUR) return;                /* hash change on the same page */
    go(location.href, { pop: true });
  });

  dispatch('archive:page', { url: location.href, swapped: false });
})();
