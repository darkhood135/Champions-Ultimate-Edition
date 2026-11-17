"""Memory reading time — rerun after publishing or editing any Memory.

For every Memory page with story text (lore/memories/*.html, the .prose block):
  * counts the words,
  * writes `words: N` into that Memory's entry in lore/data/archive-index.js
    (the cards show ~N min from it; archive.js uses 230 words per minute),
  * adds or refreshes the "Reading Time" row in the page's Memory File sidebar
    ("~7 min · 1,409 words"), right after Date Released.
Safe to run any number of times. Run from the site root:  python3 analysis/memory_reading_time.py
"""
import re, glob, html, math

WPM = 230  # keep in step with READ_WPM in lore/archive.js
INDEX = 'lore/data/archive-index.js'

def count_words(page):
    m = re.search(r'<div class="prose">(.*?)</div>\s*<div class="scene-end">', page, re.S)
    if not m:
        return None
    text = html.unescape(re.sub(r'<[^>]+>', ' ', m.group(1)))
    return len(re.findall(r"[A-Za-z0-9’'\-]+", text))

idx = open(INDEX, encoding='utf-8').read()
for path in sorted(glob.glob('lore/memories/*.html')):
    page = open(path, encoding='utf-8').read()
    words = count_words(page)
    if not words:
        continue
    mins = max(1, math.ceil(words / WPM))
    val = '~%d min &middot; %s words' % (mins, format(words, ','))
    row = ('<div class="info-row">\n            <div class="lbl">Reading Time</div>\n'
           '            <div class="val">%s</div>\n          </div>' % val)
    if 'Reading Time</div>' in page:
        page = re.sub(r'<div class="info-row">\s*<div class="lbl">Reading Time</div>\s*<div class="val">.*?</div>\s*</div>', row, page, count=1, flags=re.S)
    else:
        m = re.search(r'<div class="info-row">\s*<div class="lbl">Date Released</div>.*?</div>\s*</div>', page, re.S)
        if not m:
            print('  no Date Released row, skipped sidebar:', path); 
        else:
            page = page[:m.end()] + '\n          ' + row + page[m.end():]
    open(path, 'w', encoding='utf-8').write(page)

    rel = path.replace('\\', '/')
    em = re.search(r"\{[^{}]*path: '%s'[^{}]*\}" % re.escape(rel), idx)
    if not em:
        print('  not in index:', rel); continue
    entry = em.group(0)
    if re.search(r'words: \d+', entry):
        new = re.sub(r'words: \d+', 'words: %d' % words, entry)
    else:
        new = re.sub(r'(written: (?:true|false),)', r'\1 words: %d,' % words, entry, count=1)
    idx = idx[:em.start()] + new + idx[em.end():]
    print('%-34s %5d words  ~%d min' % (rel.split('/')[-1], words, mins))
open(INDEX, 'w', encoding='utf-8').write(idx)
