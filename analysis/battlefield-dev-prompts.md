# Battlefield Development Prompts

Reusable prompts for building Champions Ultimate Edition battlefields. Copy a prompt into a new chat, fill in the brief, and send.

You only need to give loose concepts. Any field can be one line, a few words, or left blank. Claude fills the gaps, pitches the design for your approval, and builds the page only after you sign off.

- **Prompt A: Launch Slate.** Use once, first. Shapes all 6 new launch maps together so they don't overlap.
- **Prompt B: Single Battlefield.** Use for each map you build: launch maps, then any future map.
- **Prompt C: Revision.** Short follow-ups once a map exists.

---

## Prompt A: Launch Slate (use once, before building any launch map)

```
We're starting development on the v1.0.0 launch battlefields for Champions Ultimate Edition.

Read first:
- analysis/version-history-launch-plan.md (§5 Battlefields, §6 Items)
- battlefields/brooklyn-rooftops.html (current page structure: the canonical reference)
- battlefields/the-backrooms.html (reference for stage rules, special tiles, enemy spawns, multi-floor)
- items.html and the item sheets in items/
- The Catechism sections on movement, STA, elevation, airborne and obstacles

Goal: a one-page Launch Slate Brief covering all 7 launch maps (Brooklyn Rooftops already exists). Don't build any pages yet.

My seeds for each map (loose on purpose; fill the gaps):

ACE CHEMICALS (DC):
- Concept:
- Must-haves:

METROPOLIS (DC):
- Concept:
- Must-haves:

WORLD MARTIAL ARTS TOURNAMENT (Dragon Ball):
- Concept:
- Must-haves:

KAMI'S LOOKOUT (Dragon Ball):
- Concept:
- Must-haves:

THE DANGER ROOM (Marvel):
- Concept:
- Must-haves:

THE ABYSS (Multiversal, Act I flagship):
- Concept:
- Must-haves:

Anything slate-wide (variety, sizes, a mechanic I want somewhere):

For each map, give me:
1. A one-line identity: what it tests, rewards and punishes.
2. Rough size and shape, floor count and elevation tiers. Vary these across the slate.
3. Signature obstacles and mechanics (a list of names, not full stats yet).
4. Item plan: 1–2 signature items for that map, plus which shared-pool items spawn there. Items center on the maps they're found on.
5. Which roles and tags it favors and which it punishes.
6. Mode rotation.

Then give me:
- A slate overview table so I can compare all 7 maps at a glance.
- A shared item pool: universal items that spawn across most maps.
- Any overlaps or gaps you see, e.g. two maps rewarding the same thing, or a role no map favors.

Keep it skimmable. I'll approve or adjust, then we'll build each map one at a time with the Single Battlefield prompt.
```

---

## Prompt B: Single Battlefield

```
Let's build a new battlefield for Champions Ultimate Edition.

Read first:
- analysis/version-history-launch-plan.md (§5 Battlefields, §6 Items), plus the Launch Slate Brief if we made one
- battlefields/brooklyn-rooftops.html (canonical page structure; use it, not the older battlefield-template.html)
- battlefields/the-backrooms.html (reference for Stage Rules, Special Tiles, Enemies on Map, multi-floor layouts)
- battlefields.html (roster page the new map gets added to)
- items.html and items/ (existing items)
- The Catechism sections on movement, STA, elevation, airborne and obstacles

════════════ BATTLEFIELD BRIEF ════════════
(Loose is fine. One line, a few words, or blank. Fill what I leave out.)

NAME:
FRANCHISE / UNIVERSE:
LOCATION (subtitle line):
RELEASE TARGET: v1.0.0 (launch) / later season / unsure

CONCEPT & VIBE
(What is this place? What does a fight here feel like?)

MECHANICAL IDENTITY
(What should this map test, reward or punish? e.g. "punishes turtling", "rewards fliers", "chaos map")

SIZE & SHAPE
(Small / medium / large; long / wide / square; how many floors?)

LAYOUT IDEAS
(Freeform. e.g. "two towers with a bridge", "ring in the middle, stands around it". An ASCII doodle is welcome but optional.)

ELEVATION
(Flat? A few raised platforms? Several tiers? How do you move between them?)

OBSTACLES & TERRAIN (any you have in mind; names and rough ideas are enough)
- Walls / cover:
- Hazards:
- Interactive elements:
- Elevation features (ladders, ramps, lifts…):
- Special tiles:

STAGE RULES
(Map-wide rules, e.g. "airborne disabled on floor 1", "layout shifts every 3 turns". Or none.)

ITEMS
(Signature item ideas for this map and which existing items spawn here. Items should fit the map.)

ENEMIES
(Any neutral or hostile spawns? Or none.)

MODE ROTATION
(Main Story / Event Story / Arena / Clash / Flashpoint / Danger Room / The Dark Dimension / Crisis on Infinite Earths. Or "you decide".)

FLAVOR
(Quote idea, tone for the description. Or blank.)

MUST-HAVES:
MUST-NOTS:

CREATIVE FREEDOM: high (invent freely) / medium (stay close to my ideas, fill gaps) / low (ask before adding anything)
═══════════════════════════════════════════

How I'd like you to work:

PHASE 1: PITCH (no files yet)
Give me a design pitch:
- Description paragraph + quote, in the same style as the existing battlefield pages.
- ASCII layout mock per floor with a legend: spawns, item spawns, obstacles, voids, elevation.
- Layout stats block: map size, floors, item spawns, obstacles, hazards, interactives, elevation tiers, special tiles, enemy spawns.
- Every obstacle written in house format:
  Category (Destructible Cover / Impassable Wall / Half Obstacle / Hazard / Traversable Elevation / Interactive / Traversable Obstacle / Special Tile), then "Footprint · Blocks · HP", then its rules.
- Stage rules, items on map (with spawn counts), enemies, mode rotation, tags.
- A short balance read: which roles and tags this map favors and punishes, and one or two things you think could be overtuned.
- Flag anything you invented that I didn't ask for, so I can cut it.

Wait for my approval or edits before building.

PHASE 2: BUILD (after I approve)
- Create battlefields/<slug>.html from the brooklyn-rooftops.html structure, themed to the map's palette.
- Add its card to battlefields.html.
- If new items were approved, build their item sheets too and add them to items.html.
- No changelog entries (the site is pre-release; changelogs will come from the release data later).
- Use existing Catechism terms and status names exactly. If a mechanic needs a new term, flag it rather than silently inventing one.
- Match the file's line endings to its siblings, back up any existing file you change, and confirm each written file still ends in </html>.

PHASE 3: CHECK
- Open the page in a browser and look at it. The map grid must render, legend colors must match the panels, and the counts in the stats block must match the map.
- List what you built and anything left for me to decide.
```

### Example of how loose a brief can be

```
NAME: Ace Chemicals
FRANCHISE / UNIVERSE: DC
CONCEPT & VIBE: Joker's chemical plant at night. Dangerous and messy.
MECHANICAL IDENTITY: punishes standing still; good for Breakers.
SIZE & SHAPE: medium, 2 floors
LAYOUT IDEAS: big vat room downstairs, catwalks above
OBSTACLES & TERRAIN
- Hazards: vats that inflict something nasty; maybe one can be knocked over
- Interactive elements: a valve or lever of some kind
ITEMS: something chemical you can throw
MUST-NOTS: no instant-kill vats
CREATIVE FREEDOM: high
```

Everything else is left for Claude to fill in and pitch back.

---

## Prompt C: Revision (follow-ups on an existing map)

```
Revising battlefields/<slug>.html.

Change request (loose is fine):
-

Read the current page first. Pitch the change (what changes, any knock-on effects on layout stats, legend, items or balance) and wait for my OK before editing. Keep the house obstacle format and existing Catechism terms. Don't add changelog entries; the site is pre-release.
```
