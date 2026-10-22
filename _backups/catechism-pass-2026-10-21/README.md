# Champions Ultimate Edition

**A design-and-content project for a fan-imagined crossover fighting game — a full playable-character roster, its systems documentation, and every ancillary surface (battlefields, artifacts, items, enemies, summons, factions, lore) — built as a static, dependency-free website.**

The game itself doesn't ship. The *project* is the game's complete design documentation, presented the way it would be if the game had launched: playable-character sheets with full kits and balance history, itemized rules of the world, a curated tag taxonomy, stage layouts down to the panel, and a systematic design language that ties every page to every other.

Every character, item, ability, tag, stage, and rule is designed and written by hand. Every page is a static HTML file that renders the same way regardless of environment. The design system is enforced through templates and shared conventions rather than a framework.

---

## At a glance

- **Scale.** ~17 playable Champions across Marvel, DC, Multiversal and Dark Multiverse universes. 15 documented Battlefields. 12 Artifacts across 6 rarities. 11 Enemies and 1 Summon (each with its own sheet template). A dozen+ Link sub-pages. A full canonical rulebook (the *Catechism*).
- **Zero dependencies.** Pure HTML5 + CSS3 + vanilla JavaScript. No build step, no bundler, no framework, no npm install. Open `index.html` and browse.
- **Systematic design.** Every recurring surface has a template. Every entity type has a canonical filter taxonomy. Every Champion has a themed palette derived from a shared token base. Any change to a Link or Tag sweeps across all pages that reference it.
- **Documented mechanics.** The Catechism defines every game-system term (Status Effects, Content Types, Modifiers, Ability slot rules, etc.) once, so every sheet inherits unambiguous meaning without duplicating explanation.

---

## What's in the box

### Top-level surfaces
| Surface | Role |
|---|---|
| **`index.html`** | Home. Card grid linking to every other surface. |
| **`champions.html`** | Playable-character roster. Search + 8-category filter panel (Role, Link, Movement, Mitigation, Affliction, Empowerment, Offense, Utility). |
| **`battlefields.html`** | Stage roster. Square-icon tiles. Filters: Game Mode, Universe, Hazards. |
| **`artifacts.html`** | Equippable extra-passive modifiers. 12 across all 6 rarities. Rarity-colored borders, per-artifact effect blocks. |
| **`enemies.html`** | Hostile NPCs. Same shell as Champions with streamlined, fight-focused filters. |
| **`summons.html`** | Summoner-class allies. Sibling of Enemies, tuned for the ally side of the field. |
| **`items.html`** | Battlefield pickups and consumables. |
| **`links.html`** | Faction, morality, mindset and power-tier tags — each with its own sub-page cataloguing members, Leaders, Supporters and Opposers. |
| **`catechism.html`** | Canonical rules reference. The source of truth for every mechanic term used elsewhere. |
| **`lore.html` / `missions.html` / `tier-lists.html` / `game-modes.html`** | Additional surfaces, some scaffolded, some fully authored. |

### Entity sheets
- `champions/<slug>.html` — one file per Champion. Hero bar, stat/vitals panels, Links panel, Tags panel, Best Partners synergy grid, full combat kit (Basic + 4-of-6 Specials + Core-plus-2-of-4 Passives + 1-of-2 ULTIMATUM), synergy blocks with collapsible reveals, costume gallery, balance changelog.
- `battlefields/<slug>.html` — one file per stage. Hero bar, layout panel with tile counts, stage rules, mode rotation, tag pills, per-tile map grids with color legend, obstacle-behavior cards.
- `enemies/<slug>.html` — same skeleton as a Champion, minus swap-in kit customization. Adds "Spawns · Maps" and "Spawns · Modes / Missions" panels.
- `summons/<slug>.html` — same skeleton as an Enemy, minus the Spawns panels; adds a "Spawned By" portrait linking to the summoning Champion.
- `links/<slug>.html` — one file per faction/tag. Lists Members, Leaders (Champions whose Leader Ability buffs the tag), Supporters (Champions with non-Leader effects that buff), Opposers, and best-team recommendations per mode.

### Templates
- `character-sheet-template.html` — canonical Champion sheet skeleton.
- `battlefield-template.html` — canonical Battlefield sheet skeleton, with a worked example (Brooklyn Rooftops) baked in for reference.

---

## Design system

### Palette
Dark-mode first. A single base palette (`#0d0e11` page, `#14161a` card, `#2c3038` border, `#f0f1f3` primary text, plus a warm-neutral secondary ramp) is shared across every page. On top of that base, each **top-level surface** has one accent color pre-allocated on the home page (Champions red `#ff5b5b`, Battlefields blue `#4aa3ff`, Artifacts indigo `#818cf8`, Links purple `#c084fc`, Enemies deep red `#b91c1c`, Summons light purple `#b794f4`, Catechism teal `#2dd4bf`, and so on). Each **Champion sheet** additionally overrides a small set of ability-card background tokens with a palette drawn from that Champion's iconography — so Captain America's cards are patriot blue and flag red, The Wasp's are gold and Pym teal, Goku's are Kakarot orange and Super Saiyan gold.

### Typography
Inter across everything, weight-driven hierarchy (400 body, 500–600 labels, 700–800 headings). Small caps + letter-spacing on labels and section dividers give the interface its game-UI feel without any icon fonts or images.

### Layout
CSS Grid throughout. The three anchor layouts:
- **Roster page** — sticky header, toolbar (search + filters + count badge), collapsible filter panel with pill-based multi-select, grid of tiles.
- **Entity sheet** — 340px left column (stats, vitals, links, tags, related-entity panel) + `1fr` right column (kit cards). Hero bar on top, changelog on the bottom.
- **Battlefield map** — 220px sticky legend on the left + `1fr` map area on the right with per-panel colored tiles; second-floor grids overlay a dimmed ghost of the first to show spatial relationships between floors.

### Component patterns
- **Ability cards.** Colored blocks with a name, category tag, meta line (Type · Target · Cost · Cooldown · Range), and a bulleted behavior list. Palette-swapped per Champion.
- **Rarity ladder.** Common → Uncommon → Rare → Epic → Legendary → Mythic. One color token per tier, reused across costumes, artifacts and status effects.
- **Collapsible bond cards.** Synergies and Transformations use native `<details>` + `<summary>` for progressive disclosure without JavaScript.
- **Pill filters.** Each roster page implements a client-side filter panel with multi-select pills, active-chip rendering, and AND-across-categories matching. No hidden state — just `data-*` attributes and a small vanilla JS filter loop.

### Cascade discipline
Any structural change ripples through the surfaces it touches. Adding a new Champion means updating: the Champion's sheet, the roster card on `champions.html`, every `links/*.html` page the Champion belongs to, and the Best-Partners section on synergy-linked Champions' sheets. The project treats this as a hard invariant — a Champion isn't "added" until the cascade is finished.

---

## Notable systems

### The Catechism
A single canonical rulebook file (`catechism.html`) defines every term the sheets reference: the six status-effect tiers (Common → Mythic), the eight canonical Content Types (Main Story, Event Story, Arena, Clash, Dark Dimension, Crisis on Infinite Earths, Flashpoint, Danger Room), Modifiers (Costume Effects, Artifacts), Team Building rules, and precise semantics for named mechanics (*Last Stand*, *Indestructible*, *Overhealth*, etc.). Sheets link to Catechism sections directly so terms are never redefined per page.

### Tag taxonomy
Every Champion's Tags panel and every filter pill is drawn from a fixed six-category mechanic taxonomy: **Movement · Mitigation · Affliction · Empowerment · Offense · Utility**. Enemies and Summons inherit the same categories with streamlined pill sets appropriate to their side of the fight. The taxonomy is enforced through disciplined authoring — a new tag isn't added lightly.

### Multi-build kit
Each Champion sheet presents a kit with selection structure baked into the design: **4 of 6 Specials selectable · Core Passive plus 2 of 4 selectable · 1 of 2 ULTIMATUMs selectable**. Cards in the active loadout are colored; reserve cards use a dashed border. This lets a sheet document *every* ability the Champion has while making the "active build" visually obvious.

### Synergy system
Between-Champion bonds are documented on both partners' sheets. A synergy block is a collapsible `<details>` card that reveals the abilities the bond grants — typed as *Upgraded Special*, *Upgraded ULTIMATUM*, *New Passive*, or *New Special* — each with an "Overrides *[base ability]* — the base ability must be in the active loadout to use this form" annotation so the interaction between base kits and synergy grants is unambiguous.

### Transformation system
The most recent addition. A Champion (currently Goku) can have exactly one **transformation** — a full parallel kit that transforms (not merely upgrades) the base. Basic, Specials, Reserves, Core Passive, Passives, ULTIMATUMs and their reserves all get transformed versions. Stat modifiers appear inline (`MAX HP: 14,000 (+2,000)`) in the transformation's palette. Both forms live in collapsible blocks in the same sheet. Leader Ability and Synergies are shared and don't transform.

### Balance changelog
Every Champion, Battlefield and Artifact sheet ends with a changelog section. Each entry lists changes with `Buff / Nerf / Rework / Release` tags and includes a written *Rationale* paragraph explaining *why* the change was made. Balance history is treated as first-class content, not metadata.

---

## Technical notes

### Stack
- **HTML5** — semantic elements, `<details>` / `<summary>` for progressive disclosure, `<data-*>` attributes for filtering.
- **CSS3** — Grid + Flexbox layouts, `aspect-ratio`, `backdrop-filter`, custom properties for shared tokens, per-file scoped styles inside a single `<style>` block (each page is self-contained).
- **Vanilla JS** — one small filter loop per roster page. Search input listener, pill toggles, active-chip rendering, count badge. Zero dependencies.

### Why no framework
The project is deliberately buildless. Each HTML file opens directly in any browser without a dev server, without an install step, without a lockfile. This makes it trivial to host anywhere, easy to review file-by-file, and immune to dependency rot — the appropriate architecture for a fan documentation site that's meant to persist.

### File organization
```
Champions Ultimate Edition/
├── index.html                # Home card grid
├── champions.html            # Roster
├── battlefields.html         # Stage roster
├── artifacts.html            # Artifact list
├── enemies.html              # Hostile NPC roster
├── summons.html              # Allied-summon roster
├── items.html                # Item roster
├── links.html                # Faction/tag roster
├── catechism.html            # Canonical rulebook
├── lore.html, missions.html, tier-lists.html, game-modes.html
├── character-sheet-template.html
├── battlefield-template.html
├── champions/                # One file per Champion
├── battlefields/             # One file per stage
├── enemies/                  # One file per enemy
├── summons/                  # One file per summon
├── items/                    # One file per item
├── links/                    # One file per faction/tag
└── images/                   # Character art, stage art, item icons
```

### Accessibility & responsiveness
- All pages collapse gracefully from 1320px down through tablet to a 600px mobile breakpoint.
- Filter panels are keyboard-navigable; the collapsible bond and form blocks use native `<details>`, which respect screen readers by default.
- Contrast is deliberately high — light text on the dark card surfaces sits comfortably above WCAG AA on every accent color used as an interactive element.

---

## What this project demonstrates

- **Systematic design.** A large, growing surface area held together by a small, enforceable set of conventions.
- **Content-first architecture.** Every page is a documentation of a system, not a widget on top of one. The design serves the content.
- **Taxonomy discipline.** Filters, tags, links and roles are canonical, defined once, and reused. Adding new ones is deliberate.
- **Cross-surface consistency.** A change to a Link or Tag cascades through every page that references it. The invariant is respected, not hoped for.
- **Craft in the details.** Per-Champion palettes, in-character quotes written in a chosen editorial voice, and balance changelogs with rationale — the project treats fan-work as if it were shipping product documentation.

---

## Running it

Everything is static. Clone or download, then open `index.html` in any modern browser. No install, no build, no server required.

---

## Credits & notice

Character names, likenesses and universe references belong to their respective rights-holders (Marvel Entertainment, DC Entertainment, Toei Animation, etc.). This is an unaffiliated design and documentation exercise — a game that doesn't ship, whose value is the design work itself.
