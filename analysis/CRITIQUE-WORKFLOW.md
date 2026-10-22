# Critique / Meta Workflow — how to run cheap chat-to-chat

Goal: run each Critique or Meta Analysis in a **fresh chat** that reads a few hundred lines, not tens of thousands, and never drags prior-champion chat history. The roster knowledge lives in files + memory, so a cold chat is fully roster-aware.

## What a fresh chat should read (and nothing more)
1. **Project memory** — loads automatically (standing design principles, role assignments, tag taxonomy, meta methodology, Leader/Link economy, summon-persistence rule). Free.
2. **`analysis/roster-index.md`** — the whole roster's stats/roles for comparison. ~one screen.
3. **The new champion's kit only** — read the sheet from offset ~985 (skip the ~950-line CSS/script block). For transforming champions, read both form blocks.
4. **`analysis/catechism-digest.md`** (once built) — status/mechanic one-liners. Until it exists, do a **targeted Grep** on `catechism.html` for the specific status names the kit uses (cheap). Never read the whole Catechism.
5. **Role peers' kit entries** from `analysis/roster-kits.md` (once built) — only the 2-3 champions being compared. Until it exists, the stat line in roster-index covers most benchmarking; read a peer's kit region only if a deep ability comparison is needed.

Do NOT: re-read full sheets for CSS, re-read the Catechism end to end, or continue a long multi-champion thread.

## Kickoff prompt — paste at the start of a Critique chat
> New Critique session for **Champions Ultimate Edition**. Don't load old chat history.
> Read, in order: `analysis/roster-index.md`, then `champions/<name>.html` from offset ~985 (kit only), and grep `catechism.html` for any status the kit names. Use project memory for the design principles, role assignments, tag taxonomy, and Leader/Link economy.
> I've added/changed **<Champion>** (role: <role>). Analyze every aspect of the kit: stats vs. role peers (from the index), damage/durability/economy math, coherence/wording, tag/Catechism gaps, and synergies. Then wait for my changes before writing any changelog. Standing permission to edit the sheet + changelog after I confirm.

## Kickoff prompt — paste at the start of a Meta Analysis chat
> New Meta Analysis session for **Champions Ultimate Edition**. Don't load old chat history.
> Read `analysis/roster-index.md` and use the meta methodology + design principles in project memory. Run the six-pillar comparative ranking across the current roster. Only pull a specific champion's kit entry from `analysis/roster-kits.md` (or grep its sheet's kit region) if a pillar needs ability-level detail. Flag outliers against the role bands.

## Critique checklist (lessons from past passes)
- **Leader Abilities are not tagged** (Harry precedent). A tag sourced only from the Leader is a bug.
- **Card vs sheet sync:** check the `champions.html` card's `data-name`, `data-realname`, `data-links` and `data-tags` against the sheet. New champions have shipped with empty attributes.
- **Undefined terms:** grep the Catechism for every keyword the kit uses ("endurance", domain names, "guaranteed to land", etc.).
- **Copy-paste drift from template sheets:** "Only applies to Base Form" on non-transformers, `.ability-meta` vs `.syn-ability-meta` in synergy cards, doubled punctuation.
- **Uptime math:** for any duration/cooldown pair, compute uptime including every cooldown-reduction source. Check counterplay: can the enemy actually remove it?
- **Cross-kit counters:** search other kits for effects that target the champion's links (e.g. the Patronuses vs "Vast Darkness").
- **Dead text:** effects that reference a trigger nothing in the roster can produce (e.g. "upon being resurrected" with no revive source).

## Maintenance (keeps it dynamic)
- **Every time a champion is added or re-tuned:** update their one line in `roster-index.md` (and their kit entry in `roster-kits.md` once that exists) in the same pass as the sheet edit. One line in = index never drifts.
- **New status/mechanic:** add a one-liner to `catechism-digest.md`.
- The index/digest are *derived from* the sheets — the HTML remains the source of record; these are the fast read layer.
- **There is no generator script** (no `build-digest.py` exists as of 2026-10-21). All four files are hand-maintained: after finalizing a champion, edit their index line + kits entry, and add any new statuses to the Catechism digest.

## Status
Both fast-read layers exist: `catechism-digest.md` and `roster-kits.md` (full coverage of all 32 champions as of 2026-10-21). Keep them current by hand.

## Why this is cheap
A full sheet is ~1,500 lines (~950 CSS). The index is ~one read for the whole roster; a kit-region read is ~250 lines. A cold critique chat ≈ index + one kit + a status grep. A meta pass ≈ index only. No chat history, no boilerplate, no whole-Catechism reads.
