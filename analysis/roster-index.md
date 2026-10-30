# Roster Index — analysis source of truth

Compact stat backbone for the **Critique** and **Meta Analysis** lanes. Read THIS instead of re-reading champion HTML sheets (which are ~1,500 lines each, mostly CSS). Covers every *implemented* champion (placeholder roster cards with empty data are omitted).

**Stat line order:** `HP / ATK / MAG / HEAL / DEF / RES / ACC / CRIT%·CR% / SPD / EVA` (EN·STA·REGEN appended where notable). Transforming champions show base; transform deltas noted in parentheses.

**SIZE:** every Champion, Enemy and Summon is **1x1** unless noted (The Hulk and Boom Tube are 2x2), so SIZE is only shown on lines where it isn't 1x1.

**Last updated:** 2026-10-29 (through The Shape critique). **Maintenance:** when a champion is added or re-tuned, update their one line here in the same pass as the sheet edit. One line changed = index stays current; no full-sheet re-reads needed next session.

---

## OFFENSIVE

### Striker
- **Spider-Man** — 9,600 / 340 / 300 / 0 / 130 / 150 / 98% / 175%·20% / 115 / 15% — all-rounder, sturdy
- **The Punisher** — 8,200 / 230 / 370 / 0 / 90 / 160 / 99% / 150%·30% / 105 / 5% — MAG-primary gunner
- **Wolverine** — 5,700 / 410 / 0 / 0 / 60 / 40 / 96% / 150%·20% / 100 / 15% — glass bruiser, REGEN 6%, Wild Fury (+50% ATK cap)
- **Batgirl** — 7,200 / 360 / 140 / 0 / 110 / 70 / 98% / 175%·30% / 110 / 25%
- **Harry Potter** — 7,600 / 120 / 400 / 0 / 80 / 170 / 97% / 175%·20% / 110 / 20%, EN 120·STA 7 — control-into-damage caster-striker; magic-tanky/physical-paper; revives once at 80%
- **Black Widow** — 8,600 / 310 / 290 / 0 / 130 / 80 / 99% / 150%·30% / 114 / 20%, EN 100·STA 7, REGEN 1% — hybrid spy-striker; guaranteed-crit basic + Red Room Rifle; Shock via Batons/Bite (DoT ignores RES = her anti-tank tool); execute EN refund vs <35% HP; optional inert buff-bank (False Memories) cashed out by ULT; no survival valve beyond Widow's Line Stealth; low RES
- **The Shape** — 9,000 / 350 / 100 / 0 / 140 / 20 / 96% / 175%·25% / 100 / 0%, EN 100·STA 2 (STA regen 100%), REGEN 5% — relentless stalker-slasher; highest Striker DEF, roster-lowest RES (tied Anya), 0% EVA; steady 2-panel walk with no burst movement; marks one target from range 12 (Predator's Prey = +30% damage from him, Anxiety) then closes; Choking Grasp 2t Constraint lock that also locks him (ends if he is defeated); double revival (25% after 1t, then 40% after 7t) + Deathbound immunity; Indestructible on Refusal to Die (1t) and Force of Nature ULT (3t). Lives alone ≈ 14.9k HP; counters = magic damage, CC, kiting, cleanse, Healing Reduction. Leader: +20% ATK/DEF to Unexplainable Motivations (self-lead), +10% to Stalker in the Shadows (also Batman, Winter Soldier, Black Widow)

### Blaster
- **Iron Man** — 7,700 / 210 / 390 / 0 / 120 / 120 / 99% / 150%·25% / 110 / 12% — tanky-for-role
- **Vegeta** — 7,800 / 280 / 370 / 0 / 120 / 130 / 97% / 150%·25% / 108 / 15% — tanky-for-role
- **Green Lantern** — 6,800 / 330 / 300 / 0 / 90 / 90 / 96% / 150%·10% / 113 / 25% — frail/evasive, ATK-scaling, airborne
- **The Winter Soldier** — 8,200 / 340 / 240 / 0 / 130 / 90 / 97% / 160%·20% / 107 / 15%, EN 100·STA 7, REGEN 2% — deliberately tanky close-range Blaster (melee/short-range AoE, endure in Core, EN-drain line, anti-air); trades some damage for bulk
> Note: Iron Man & Vegeta both run tankier than the "frail Blaster" ideal; GL is the intended-frail one. The Winter Soldier is the intended-tanky one (top Blaster HP, slightly lower damage output).

### Berserker
- **Deadpool** — 4,600 / 350 / 130 / 200 / 60 / 30 / 96% / 150%·20% / 110 / 35% — REGEN 12%, cooldown-ignore/HP-cost
- **Goku** (base ↔ Kaioken) — 9,200 / 340 / 260 / 0 / 100 / 130 / 97% / 175%·20% / 114 / 8% — first transformer
- **Lord Voldemort** — 5,000 / 190 / 260 / 0 / 100 / 130 / 95% / 150%·20% / 110 / 20%, EN 150·STA 4, REGEN 5% — Horcrux-anchored HP-cost caster; real stats come from Thirst for Power (+70 ATK/MAG, permanent uptime → 260/330); cannot die while any Horcrux exists (3t Imbuement; Nagini summon carries one 10t); 20% REGEN/35% EVA while no enemy holds a Horcrux
> Band: 4.6k–9.2k HP; HP-for-power trade (Deadpool endures/regen, Goku Kaioken HP costs, Voldemort HP costs offset by Horcrux immortality).

## DEFENSIVE

### Defender
- **Superman** — 16,800 / 350 / 230 / 0 / 220 / 140 / 97% / 150%·25% / 105 / 7% — apex wall, low offense
- **Thor** — 14,600 / 360 / 250 / 0 / 170 / 160 / 98% / 150%·25% / 105 / 6% — hybrid control-wall
- **Wonder Woman** — 14,200 / 370 / 210 / 0 / 170 / 160 / 98% / 175%·10% / 111 / 10% — warrior-tank
- **Captain America** — 14,200 / 340 / 100 / 0 / 140 / 140 / 99% / 150%·20% / 106 / 9% — mitigation/team-buff
- **Goku (Super Saiyan)** (↔ Enraged) — 13,500 / 290 / 280 / 0 / 140 / 150 / 98% / 150%·10% / 107 / 15% — Enraged: +60 ATK, +60 MAG, +10% CR, +3 SPD; transforms only below 20% HP
- **The Hulk** — 18,800 / 300 / 200 / 0 / 190 / 160 / 94% / 130%·10% / 96 / 0%, EN 80·STA 5, REGEN 2%, **SIZE 2x2** — rage-ramp juggernaut: starts at 0% DR; each Mounting Rage stack (once per ability received, 5t each, own timers) = +3% DR (cap 45%) and +3% ATK/MAG (uncapped); slowest SPD, only 0% EVA, 2nd-lowest ACC; Retribution-on-every-attack engine (Green Heart), Taunt opener, Indestructible+Taunt+Retribution ULT
- **Curly** — 10,000 / 170 / 150 / 0 / 140 / 120 / 98% / 120%·80% / 106 / 35% — lowest-HP Defender; evasion + scaling DEF/RES; pure protection, near-zero damage
> Band: 13.5k–16.8k HP except Curly (10k, mitigation/evasion model) and The Hulk (18.8k, 2x2; durability ramps with Mounting Rage — weakest vs early burst, ~1.6–1.8× Superman's survival under sustained focus in sims).

## SUPPORTIVE

### Healer
- **The Wasp** — 6,200 / 230 / 310 / **300** / 70 / 100 / 98% / 150%·25% / 119 / 35% — mobile skirmisher-healer
- **Dagger** — 5,800 / 180 / 260 / **340** / 60 / 110 / 99% / 120%·50% / 114 / 20%
- **Anya** — 4,500 / 80 / 230 / **420** / 40 / 20 / 100% / 150%·30% / 117 / 45% — best HEAL + highest EVA, frailest body (40/20); team-invuln ULT

### Booster
- **Robin** — 5,300 / 320 / 180 / 0 / 120 / 30 / 98% / 200%·15% / 110 / 42%
- **Cyborg** — 9,000 / 230 / 280 / 0 / 160 / 110 / 98% / 150%·12% / 107 / 10% — tanky, no ally-heal, inert-buff battery
> Only two Boosters. Wasp & Dagger are HEALERS, not Boosters.

## DISRUPTIVE

### Breaker
- **Cloak** — 6,400 / 190 / 330 / 0 / 90 / 110 / 97% / 150%·10% / 108 / 10%
- **Miles Morales** — 7,300 / 310 / 270 / 0 / 100 / 90 / 97% / 175%·20% / 113 / 20%
- **Batman** — 7,500 / 370 / 280 / 0 / 120 / 80 / 99% / 180%·25% / 108 / 15%
- **Krillin** — 4,800 / 290 / 340 / 0 / 70 / 140 / 99% / 200%·35% / 115 / 40%, EN 120·STA 10, REGEN 4% — glass high-crit evasive (best average crit in roster, ×1.35); Solar Flare Blind/Stun loop (capped 2026-10-25); Senzu Bean dispenser (first bean per user = full HP, later ones ≤8,000 HP)
- **Dracaena Malfoy** — 5,200 / 110 / 370 / 0 / 40 / 180 / 95% / 150%·50% / 112 / 35% — curse-lockdown caster, magic-tanky/physical-paper

### Summoner
- **The Summoner** — 9,000 / 300 / 300 / 300 / 120 / 120 / 100% / 150%·20% / 110 / 10% — balanced toolbox, copies any champion
- **Loki** — 7,600 / 190 / 380 / 0 / 60 / 120 / 97% / 150%·25% / 116 / 10%, EN 120·STA 8, REGEN 3% — illusion-swarm: up to 3 persistent 5k-HP clones (Loki's MAG, disguised as him = true shell game); counterplay = find & kill Loki (clones die with him); Threads build = shared pool up to 19.6k (AoE hits each body); Stolen Power copies any Champion 3t at Loki's HP% (ULT resets on exit — loop closed 2026-10-25)
- **Frieza** (Final ↔ Full Power) — 5,800 / 220 / 330 / 0 / 60 / 60 / 99% / 150%·5% / 114 / 30%, EN 150·STA 4 — Full Power: +3,000 HP, +80 ATK, +30 MAG, +70 DEF, +70 RES, +10% CR, −25% EVA (evasion→bulk restat); transforms below 10% HP

### Plunderer
- **Black Cat** — 8,000 / 360 / 130 / 0 / 110 / 90 / 99% / 175%·15% / 110 / 13% — slippery thief
- **Carnage** — 5,000 / 420 / 80 / 200 / 70 / 70 / 93% / 200%·15% / 114 / 10% — fragile anti-ally berserker-plunderer

---

## Quick role bands (for meta/benchmarking)
- **Defender HP:** 13.5k–16.8k (Curly is the 10k evasion/mitigation outlier; The Hulk is the 18.8k 2x2 ramp outlier). **Lowest SPD:** The Hulk 96. **Lowest EVA:** The Hulk 0%.
- **Healer:** frail bodies (4.5k–6.2k), HEAL 300–420 (Anya top), high EVA.
- **Breaker:** 4.8k–7.5k, mostly caster/control; low DEF common.
- **Summoner:** 5.8k–9k; the summon carries much of the value.
- **Plunderer:** fragile, high ATK/CRIT, anti-ally or steal mechanics.
- **Berserker:** 4.6k–9.2k HP; spends HP/safety for damage; each has a survival valve (endure, transform, Horcrux).
- **Highest ATK:** Carnage 420, Wolverine 410. **Highest MAG:** Harry 400 / Iron Man 390 / Loki 380 / Punisher·Vegeta·Dracaena 370. **Highest CRIT mult:** Carnage/Krillin/Robin 200%. **Highest EVA:** Anya 45%, Robin 42%, Krillin 40%. **Lowest RES:** Anya / The Shape 20. **0% EVA:** The Hulk, The Shape.
