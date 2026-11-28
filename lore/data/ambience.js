/* =====================================================================
   THE ARCHIVE — ambience data (backdrops + music)
   Read by lore/archive-ambience.js. Paths are relative to the site root.

   universes – one entry per universe that has ambience. A universe with
               no entry (or no backdrop) shows the plain grey page.
     id        matches ARCHIVE_INDEX.universes ids; 'multiversal' is the
               Archive's own: Worlds Entwined, The Summoner, and pages
               with no universe (home, portals, categories, Memories
               library, Power rankings)
     title     display name (defaults to the ARCHIVE_INDEX title)
     color     accent for the library (defaults to the ARCHIVE_INDEX color)
     emblem    universe logo, transparent PNG (optional; shown as is, no
               circle). Without one the library shows a lettered circle.
               Logos live in images/lore/logos/<universe>.png
     backdrop  1920×1080 WebP; its credit lives in data/image-credits.js
     focus     CSS background-position: keeps the key subject in view
               when the screen crops the image (phones show the middle)
     track     default track id (what plays on its pages with Follow page on)

   Which universe a page uses (from lore/data/archive-index.js):
     character pages   → their home universe (Multiversal if none)
     half: 'entwined'  → Multiversal
     universe: …       → that universe
     anything else     → Multiversal
   Per-page overrides go on the page's index entry (use rarely):
     backdrop: 'wizarding-world'                 another universe's backdrop
     backdrop: 'images/backdrops/x.webp'         a specific image
     backdrop: 'none'                            plain grey
     backdropFocus: '50% 40%'                    focus for that image
     track: 'some-track-id'                      a page's own track

   tracks – the music library. Every track is credited in full, as far as
            its source allows:
     id        unique; also the file name for universe themes
     title     YOUR custom title
     original  the real track name (shown as  Original: "…"). For Dokkan
               Battle themes: the name the source gives it, i.e. the unit
               plus the part, e.g. 'AGL Super Saiyan 3 Goku (Angel) Intro OST'
     by        composer or artist (optional: leave out when none is credited,
               as with Dokkan Battle themes)
     work      the original work it comes from
     year      the work's year (optional)
     file      audio file. Universe, battlefield and arc tracks go in
               audio/universe-themes/<id>.mp3; Champion tracks reuse
               audio/champion-themes/<slug>.mp3
     type      'main' | 'champion' | 'battlefield' | 'arc'
               (library rows: Main Theme / Champions / Battlefields / Arcs)
     universe  universe id ('multiversal' for the Multiversal theme)
     icon      image for the library grid (optional). Champions default to
               their index portrait, arcs to their index icon, main themes
               to the universe backdrop
     champion  (type 'champion') the character's index id: their page gets
               a "Play Champion theme" button
     arc       (type 'arc') the arc's index id
     pages     index ids of other pages this track belongs to ("Here")
   ===================================================================== */
window.ARCHIVE_AMBIENCE = {

  universes: [
    { id: 'multiversal',     title: 'Multiversal', color: '#a78bfa',
      backdrop: 'images/backdrops/multiversal.webp',     focus: '62% 45%' },
    { id: 'wizarding-world',               emblem: 'images/lore/logos/wizarding-world.png',
      backdrop: 'images/backdrops/wizarding-world.webp', focus: '50% 45%', track: 'the-wizarding-world' }
  ],

  tracks: [
    /* ---------- The Wizarding World ---------- */
    { id: 'the-wizarding-world', title: 'The Wizarding World', original: 'Hedwig\u2019s Theme',
      by: 'John Williams', work: 'Harry Potter and the Philosopher\u2019s Stone', year: 2001,
      file: 'audio/universe-themes/the-wizarding-world.mp3', type: 'main', universe: 'wizarding-world' }
  ]
};
