# Champions Ultimate Edition — Version History & Launch Plan

*Planning document — nothing implemented yet. Drafted 2026-10-23 · updated 2026-10-26.*

The site pretends to be a real live game: a v1.0.0 launch with a limited roster, then fake seasons, patches, and expansions that "release" content over time. Fake metas get preserved through version-tagged tier lists and Best Teams.

---

## 1. Locked decisions

| Topic | Decision |
|---|---|
| Existing changelogs & dev history | **Erased entirely.** Start from a blank slate as though they never existed. |
| Current state | **Pre-release.** No version numbers exist until v1.0.0 ships. |
| Version scheme | **Major = Act** (v1.x = Act I era, v2.0.0 = Act II expansion). **Minor = Season** (new content, one tier list each). **Patch = balance/hotfix** (no tier list). |
| Lore vs. Meta numbering | **Shared.** One game version; a release can carry Patch Notes, Story Notes, or both. |
| Website changes | **Separate log with real dates**, no fake version numbers. |
| Dates on game versions | **Made-up in-fiction calendar** (see §1a). Only the Site Log uses real dates. |
| Developer Comments | **Yes.** Overwatch-style, per Champion/entity, styled to the site. |
| Unreleased content | **Visible but badged** (not hidden). |
| Tier lists | One per major / season release. Not per patch. |
| Harry Potter | **Cut from launch.** Arrives in Act II or later (Cataclysm era), likely headlining v2.0.0. |
| The Backrooms | **Cut from launch.** Late surprise crossover battlefield. |

### Section names (confirmed)
- Hub page / index tab: **Updates**
- Meta section: **Patch Notes**
- Lore section: **Story Notes**
- Website section: **Site Log**

### 1a. In-fiction calendar
- **Launch: v1.0.0 — April 28, 2027.**
- **A new Season releases on the 28th of every month.**
- Working assumption: launch *is* Season 1, so v1.0.0 = Season 1 (Apr 28, 2027), v1.1.0 = Season 2 (May 28, 2027), v1.2.0 = Season 3 (Jun 28, 2027), and so on. If you'd rather launch be "Season 0" with Season 1 on May 28, only the labels shift.
- Patches (v1.x.y) can land on any date between two Season dates.
- An expansion (v2.0.0 = Act II) also lands on a 28th and starts a new Season.

---

## 2. Patch notes architecture

**Decision: single data source, rendered everywhere.**

- `data/releases.js`: a registry mapping every entity (Champion, summon, battlefield, item, artifact, enemy, mode, costume, Codex/Chronicle/Memory entry) to the version it releases in. It drives the badges and roster filters.
- `data/patch-notes.js`: every game version as structured data: version, in-fiction date, title, type (launch / season / patch / hotfix / expansion), summary, and categorized entries. Each entity entry has a Developer Comment, general change bullets, and per-ability change blocks.
- `data/site-log.js`: Site Log entries with real dates.
- One shared renderer script draws:
  - the full Updates page (with filters by section, version, and entity), and
  - each sheet's Changelog section, filtered to that entity (e.g. `data-changelog="champion:batman"`).
- **Why:** each change is written once and appears identically on the Updates page and the sheet. Layout stays uniform, entries can be searched and filtered, and nothing drifts between copies. Works on GitHub Pages and locally (script tags, no fetch).
- **Upcoming Patch:** a draft version in the data file where changes collect until Tyler decides to ship it. It shows on the Updates page with a "PTR / Upcoming" badge.

### Patch note format (Overwatch-style, site-themed)
- Version post header: version number, title (e.g. "Season 2: …"), in-fiction date, release type.
- Sections in order: General → Champions → Summons → Battlefields → Items → Artifacts → Modes → Bug Fixes.
- **Champion card:** portrait + name header. Below it, the **Developer Comments** block (accent left bar, Champion's theme color). Then general bullets (stats, ULTIMATUM cost, etc.).
- Per-ability sub-blocks: ability name, with the ability icon if one exists (otherwise a type-colored chip), then bullets in the form "Cooldown increased from 3 to 4 turns."
- Ability-type sub-labels where useful (e.g. "Cover Rescue · Special 3").
- Minor wording/clarity fixes are written in-fiction as **Bug Fixes** ("Fixed an issue where…").
- Example Developer Comment tone: *"Doctrine was generally well received during the trial weekend but was overperforming relative to other supports. These adjustments target several areas of his kit while preserving his core gameplay flow…"*

### Badges (visible-but-badged)
- **Released:** shipped in a past version. Shows "Added in vX.Y".
- **Upcoming:** built but unreleased. Shows "Coming in vX.Y", or "Unreleased" if no target version yet.
- **Placeholder:** not built.
- The existing "Finished only" toggle on champions.html becomes a 3-state filter: Released / Upcoming / Placeholder. Lore entries get the same badges as a spoiler signal.

---

## 3. v1.0.0 launch scope

| Category | Launch | Notes |
|---|---|---|
| Champions | **42** | Marvel, DC, Dragon Ball + The Summoner; every role ≥4 (meets Meta readiness gate) |
| Battlefields | **7** | 2 built (Brooklyn Rooftops, ACE Chemicals); The Backrooms held back (see §5) |
| Modes | **4** | Main Story **Act I**, Arena (Sparring + Death Battle), Flashpoint, Danger Room |
| Items | ~16–20 | Built around the launch battlefields (see §6) |
| Artifacts | ~24–30 | Built around Champions, NPCs and iconic items (see §7) |
| Enemies | ~6–10 | Tune once Act I is written |
| Summons / transformations / Links | Ship with their Champion | A Link "launches" with its first member |
| Lore | Act I only | Chronicle (Act I), Codex for Act I characters/locations/factions/systems/universes, Memories relevant to Act I. **No Archive content at launch.** |

Post-launch modes: Event Story (Season 2), The Dark Dimension (endgame), Clash ("classic mode returns"), Crisis on Infinite Earths (clan feature).

---

## 4. Launch roster (draft; on hold until the Act I plot draft)

**Bold** = sheet still needs building. Roles for unbuilt Champions are the placeholder roles from champions.html.

| Role | Champions |
|---|---|
| Striker | Spider-Man, Wolverine, Batgirl, **Black Widow**, **Gohan**, **The Flash** |
| Breaker | Spider-Man (Miles Morales), Batman, Krillin, Cloak, **The Joker**, **Doctor Strange** |
| Defender | Captain America, Thor, The Hulk, Superman, Wonder Woman, Goku (Super Saiyan) |
| Blaster | Iron Man, The Winter Soldier, Green Lantern, Vegeta |
| Berserker | Deadpool, Goku, **Harley Quinn**, **Broly** |
| Booster | Cyborg, Robin, **Hawkeye**, **Piccolo** |
| Healer | The Wasp, Dagger, **Martian Manhunter**, **Poison Ivy** |
| Plunderer | Carnage, Black Cat, **Thanos**, **Black Panther** |
| Summoner | The Summoner, Loki, Frieza, **Darkseid** |

- Split: Marvel 20 · DC 13 · Dragon Ball 8 · Multiversal 1. **28 built, 14 to build.**
- Teams covered: the original six Avengers; Justice League; Bat-Family + Joker/Harley/Ivy; Z Fighters + Saiyans; Frieza/Broly as DB threats.
- Flash and Doctor Strange were chosen as multiverse-themed fits for a Cataclysm story.
- **Caveat:** Main Story unlocks Champions, so the launch roster should equal the Act I cast + The Summoner. Revisit once the Act I plot draft exists; story wins over this table.

### Built but held back (6)
- **The Punisher:** early Season drop.
- **Curly, Anya:** Mouthwashing as a surprise guest-franchise Event Story.
- **Harry Potter, Dracaena Malfoy, Lord Voldemort:** headline the v2.0.0 Act II expansion, with the Wizarding World Archive.

---

## 5. Battlefields (7 at launch)

Rule: each map tests something mechanically different, not just a different look.

| Battlefield | Franchise | Mechanical identity |
|---|---|---|
| Brooklyn Rooftops ✓ | Marvel | Verticality, gaps, civilians nearby |
| ACE Chemicals ✓ | DC | Hazard-heavy, one floor: acid vats, timed chemical floods by sector, raised catwalks and a rotating gantry; hazmat gear grants immunity |
| Metropolis | DC | Wide city streets with destructible buildings and lots of cover, so the map changes over the course of a fight |
| World Martial Arts Tournament | Dragon Ball | Small open ring with void edges and no cover; pure duel; ranked map pool |
| Kami's Lookout | Dragon Ball | Sky platform with lots of edges; favors airborne Champions |
| The Danger Room | Marvel | Layout reconfigures every few turns; home of the Danger Room mode |
| **The Abyss** | Multiversal | Act I flagship map: patchwork tiles from merged worlds, with teleporting rifts |

- Split: Marvel 2 · DC 2 · Dragon Ball 2 · Multiversal 1.
- Later: The Dark Dimension (ships with its mode); The Backrooms (surprise crossover, e.g. a Halloween event map).
- The mechanical identities above are suggestions; The Abyss especially should follow whatever Act I makes it.

---

## 6. Items (8 → ~16–20, built around the maps)

**Principle: items center primarily on the battlefields.** Most items are found as spawns on maps, so each item is designed alongside the map(s) it appears on, not as a separate pool.

- **Shared core pool:** a handful of universal items that spawn on most maps (e.g. Medkit, Smoke Grenade).
- **Signature items per battlefield:** 1–2 items that fit that map's setting and mechanical identity. Starting ideas to react to:
  - Brooklyn Rooftops: existing Medkit, Lantern and Firework spawns.
  - ACE Chemicals ✓: Chemical Canister (Throwable, creates Acid Spill) and Hazmat Suit (Trinket, acid immunity, from Hazmat Lockers only); also spawns Medkit, Smoke Grenade and Explosive Gel.
  - Metropolis: LexCorp or S.T.A.R. Labs tech pickups.
  - World Martial Arts Tournament: possibly **no item spawns**, so it stays a pure duel map.
  - Kami's Lookout: the Senzu Bean as a rare spawn.
  - The Danger Room: training-sim pickups (e.g. a hologram decoy).
  - The Abyss: a rift-shard item that ties into the teleporting rifts.
- **Item categories** (each item has one clear job): Restoratives (HP/EN/STA), Throwables (damage and statuses), Deployables (cover, traps, zone denial), Mobility (e.g. a Grappling Hook for one turn of Elevation Bypass), Cleanse/buff (e.g. an Antidote).
- Rarity sets spawn rate.
- Champion-generated items (like Krillin calling in a Senzu Bean) still exist, but they're the exception.
- New battlefields bring their own signature items, so future franchise maps carry franchise items (Green Herb on a Resident Evil map, Chaos Emerald on a Sonic map, etc.).
- Death Battle uses fixed item spawns, so items affect the ranked meta.

## 7. Artifacts (revamp; ~24–30 at launch)

**Principle: artifacts center primarily on three sources:**
1. **Playable Champions:** gear or keepsakes tied to a Champion, usually Link- or Champion-flavored (Spider-Tracer and Lock-Pick Set are the model).
2. **Non-playable characters:** supporting cast who never become Champions (e.g. Alfred, Aunt May, J. Jonah Jameson, Nick Fury, Commissioner Gordon, Lois Lane, Korin). These give the supporting cast a place in the game.
3. **Iconic items:** famous objects from the franchises (e.g. a Mother Box, Kryptonite, the Lasso of Truth, an Infinity Stone, a Dragon Ball). These naturally sit at the top of the rarity ladder.

Structure:
- **Rarity sets the kind of effect, not just its size:** Common = flat stat → Rare = conditional → Legendary/Mythic = build-defining rule change.
- **Equip conditions:** Universal / Role / Link / Tag. Adding a Role condition (1–2 signature artifacts per role) strengthens role identity.
- **Link artifacts support the Leader/Link economy.** Target launch Links: Avengers, Justice League, Bat-Family, Web Warrior, Saiyan.
- **Each mode drops artifacts with its own theme** (Dark Dimension = stat-stacking, Flashpoint = early burst). Each Event Story brings an artifact batch.
- Launch artifacts draw only from launch Champions, launch-franchise NPCs, and launch-franchise items. Later franchises bring their own.
- Must be final before the v1.0.0 tier lists, because the Meta baseline includes artifacts in every loadout.

**Production split:** Tyler isn't keen on building items, artifacts, or battlefields, so Claude drafts them:
1. Tyler gives the vision and must-haves.
2. Claude writes a design framework + candidate list.
3. Tyler approves or cuts.
4. Claude builds pages from existing templates (`battlefield-template.html`, item sheets).

Suggested order: battlefields first, then their items (since items are designed around maps), then artifacts.

## 8. Enemies
Hold until Act I is written. Likely needs: Act I story enemies, Flashpoint wave enemies, at least one boss. The Summoner's "dark counterpart" (referenced in the Multiversal Codex) is a natural Act I final boss.

## 9. Lore at launch
- Chronicle: Act I only. Codex: Act I entries + universe overviews for Marvel, DC, Dragon Ball, Multiversal. Memories: Act I-relevant only.
- Existing Wizarding World material (7 Archive spines, ~85 Memories, 4 Codex entries) is held back and badged Upcoming.
- **Each franchise's Archive arc ships alongside that franchise** (Wizarding World Archive with v2.0.0).

## 10. Other gaps to fill before launch
- **Costumes:** the Meta baseline assumes 2 costume effects per Champion, but sheets currently have ~1. Launch everyone with Default + 1 costume; add more in Season patch notes.
- **Missing pages already linked from index:** `tier-lists.html`, `game-modes.html`, `missions.html`. Game Modes is needed at launch and should show each mode's release version.
- **Tier lists:** version selector; one set per season/major release, frozen once published. Meta findings tagged by version instead of date.
- **Link pages:** Best Teams Per Mode gets version tabs (default = latest). A mode only appears from its release version onward.

---

## 11. Order of work

1. **Wipe:** back up, then remove changelog content from ~52 pages (34 Champions, 9 summons incl. template, 6 items, 2 battlefields, 1 enemy).
2. **Release setup:** `releases.js`, `patch-notes.js`, `site-log.js`, shared renderer, badges, Updates page shell. Only the Site Log is populated during pre-release.
3. **Launch content:**
   - Tyler: Act I plot draft, then Act I.
   - Together: the Act I cast → final launch roster → 14 (or so) new Champions.
   - Claude, from Tyler's direction: 6 new battlefields → their items → artifact revamp.
   - Then: enemies, launch costumes, Game Modes page.
4. **Launch (v1.0.0 — April 28, 2027):** launch post (full list of shipped content, no balance changes), launch tier lists, Best Teams per mode with version tabs.
5. **After launch:** changes accumulate in the Upcoming Patch until shipped as a patch or as the next Season on the 28th.

## 12. Open items
- [ ] **On hold:** Tyler's Act I general plot draft → derive the Act I cast → finalize launch roster and enemies.
- [ ] Confirm the calendar assumption (launch = Season 1 vs. Season 0).
- [ ] Vision brief for battlefields, items and artifacts before Claude drafts candidates.

### Resolved 2026-10-26
- Launch date: April 28, 2027. Seasons release monthly on the 28th.
- Section names confirmed: Updates / Patch Notes / Story Notes / Site Log.
- Battlefields: both Kami's Lookout and Metropolis are in; the Act I map is **The Abyss** (launch slate now 7).
- Items center on the maps they spawn on; artifacts center on playable Champions, NPCs and iconic items.
