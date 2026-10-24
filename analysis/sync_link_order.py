import re, sys, os, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPLY = "--apply" in sys.argv
champ = open(os.path.join(ROOT, "champions.html"), encoding="utf-8").read()
order = []
for m in re.finditer(r'<a href="champions/([^"]+)\.html" class="champion-card"', champ):
    if m.group(1) not in order: order.append(m.group(1))
idx = {s: i for i, s in enumerate(order)}
CARD = re.compile(r'<a\b[^>]*?href="\.\./champions/([^"]+)\.html"[^>]*>.*?</a>', re.S)
GRID_OPEN = re.compile(r'<div class="(member-grid|effect-grid)">')
TITLE = re.compile(r'class="section-title">([^<]*)')
def grid_end(text, start):
    depth = 0
    for t in re.finditer(r'<div\b|</div>', text[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0: return start + t.end() - len('</div>')
    raise ValueError
report = []; changed_files = 0; problems = []
for path in sorted(glob.glob(os.path.join(ROOT, "links", "*.html"))):
    name = os.path.basename(path)
    text = open(path, encoding="utf-8").read()
    out = []; pos = 0; file_changed = False
    for g in GRID_OPEN.finditer(text):
        if g.start() < pos: continue
        inner_s = g.end(); inner_e = grid_end(text, g.start())
        inner = text[inner_s:inner_e]
        titles = TITLE.findall(text[:g.start()]); sec = titles[-1] if titles else "?"
        cards = list(CARD.finditer(inner))
        # verify separators are whitespace only
        seps = []; p = 0; ok = True
        for c in cards:
            sep = inner[p:c.start()]
            if sep.strip(): ok = False
            seps.append(sep); p = c.end()
        tail = inner[p:]
        if tail.strip(): ok = False
        if '<a' in "".join(c.group(0)[2:] for c in cards): problems.append((name, sec, "nested <a>"))
        if not ok: problems.append((name, sec, "non-whitespace between cards; skipped")); continue
        unknown = [c.group(1) for c in cards if c.group(1) not in idx]
        if unknown: problems.append((name, sec, "not on champions.html: " + ",".join(sorted(set(unknown)))))
        keyed = sorted(range(len(cards)), key=lambda i: (idx.get(cards[i].group(1), 10**6), i))
        if keyed != list(range(len(cards))):
            before = [cards[i].group(1) for i in range(len(cards))]
            after = [cards[i].group(1) for i in keyed]
            report.append((name, sec, before, after))
            new_inner = "".join(seps[j] + cards[k].group(0) for j, k in enumerate(keyed)) + tail
            out.append(text[pos:inner_s]); out.append(new_inner); pos = inner_e; file_changed = True
    if file_changed:
        out.append(text[pos:]); new = "".join(out)
        assert len(new) == len(text)
        changed_files += 1
        if APPLY:
            open(path, "w", encoding="utf-8", newline="").write(new)
for name, sec, b, a in report:
    print(f"{name} | {sec}\n   before: {' > '.join(b)}\n   after:  {' > '.join(a)}")
print("\nFILES CHANGED:", changed_files, "SECTIONS:", len(report))
for p in problems: print("PROBLEM:", p)
