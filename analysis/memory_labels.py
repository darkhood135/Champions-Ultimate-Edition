"""Memory author labels — rerun after changing `favorite:` or `rework:` in lore/data/archive-index.js.

The cards read the flags straight from the index (archive.js). This script mirrors them onto each
written Memory page's Memory File sidebar as a "Labels" row (after Reading Time, or Date Released),
and removes the row when a Memory has no label. Run from the site root:  python3 analysis/memory_labels.py
"""
import re
idx = open('lore/data/archive-index.js', encoding='utf-8').read()
ROW = re.compile(r'\s*<div class="info-row">\s*<div class="lbl">Labels</div>.*?</div>\s*</div>', re.S)
for m in re.finditer(r"\{[^{}]*type: 'memory'[^{}]*\}", idx):
    e = m.group(0)
    path = re.search(r"path: '([^']+)'", e).group(1)
    fav, rew = 'favorite: true' in e, 'rework: true' in e
    try:
        page = open(path, encoding='utf-8').read()
    except FileNotFoundError:
        continue
    if 'Memory File' not in page:
        continue
    page = ROW.sub('', page)
    if fav or rew:
        parts = []
        if fav: parts.append('<span style="color:#f2c94c;">&#9733; Author&rsquo;s favorite</span>')
        if rew: parts.append('<span class="muted">&#9719; Rework planned: this Memory may be revised</span>')
        row = ('<div class="info-row">\n            <div class="lbl">Labels</div>\n'
               '            <div class="val">%s</div>\n          </div>' % '<br>'.join(parts))
        after = re.search(r'<div class="info-row">\s*<div class="lbl">(Reading Time|Date Released)</div>.*?</div>\s*</div>', page, re.S)
        page = page[:after.end()] + '\n          ' + row + page[after.end():]
        print('%-34s %s' % (path.split('/')[-1], ' + '.join(x for x, f in (('favorite', fav), ('rework', rew)) if f)))
    open(path, 'w', encoding='utf-8').write(page)
