# Catechism Digest — statuses & mechanics quick-reference

Fast lookup for the Critique lane. Read this instead of grepping/reading `catechism.html` (1,500+ lines). Format: `Name (Tier) — effect`.

**Maintenance:** add a line here whenever a new status or mechanic is added to the Catechism.

## Buffs (positive)
- **Indestructible** (Mythic) — cannot die.
- **Impenetrable** (Mythic) — cannot receive damage.
- **Overdrive** (Mythic) — ignores cooldowns (cooldowns still reset on use).
- **Invisible** (Legendary) — untargetable AND unseen by enemies (does NOT break on attacking — the upgraded Stealth).
- **Stealth** (Epic) — untargetable by enemies; expires one stack at a time on attacking.
- **Bloodlust** (Epic) — attacks inflict Bleed 2t; Bleed damage lifesteals 20%.
- **Confidence** (Rare) — +20% ACC, +10% ATK & MAG.
- **Pinpoint** (Rare) — next ability guaranteed crit; expires on use (one stack).
- **Overflow** (Rare) — +30 MAX EN; excess EN kept after expiry.
- **Dark Vessel** (Rare) — next attack inflicts Darkness 2t; expires on use.
- **Energy Barrier** / **Shield Charm** (Rare) — negates next received attack; expires on negating.
- **Light** (Rare) — receives +20% healing (incl. REGEN).
- **Anger** (Uncommon) — +10% ATK & MAG.
- **Might** (Uncommon) — +15% ATK.
- **Technique** (Uncommon) — +15% MAG.
- **Focus** (Uncommon) — +20% ACC.
- **Regeneration** (Uncommon) — restores 4% HP/turn.
- **Mounting Rage** (Common, stackable) — +3% ATK & MAG per stack; each stack keeps its own timer (standard for stackable statuses). The Hulk's Core adds +3% DR per stack (cap 45%) — that DR is on the Core, not the status, so stealing stacks grants only ATK/MAG.
- **Overhealth** (mechanic) — temporary bonus HP above max; time-limited; not healable once depleted.

## Hard/soft CC & control (negative)
- **Brainwash** (Mythic) — all actions randomized (ability/target), within resource limits; can hit allies or enemies.
- **Deathbound** (Mythic) — cannot be resurrected; stays on defeated units; a resurrection attempt is cancelled but still spends its resources.
- **Imperius Curse** (Mythic) — target joins inflictor's team for the duration (full control of its resources/abilities).
- **Horcrux** (Legendary, non-stackable) — NEGATIVE status (inflicted). While active, the INFLICTOR cannot be defeated by any means (incl. Instant Defeat and HP costs) but still takes damage; the carrier is unaffected. Ends when its carrier is defeated. Removed by any cleanse, incl. from the carrier's own allies (Dark Seal absorbs a cleanse first). One per unit, but several carriers can exist at once; carriers can be Champions or summons (Nagini). Voldemort only.
- **Stun** (Legendary) — cannot move or act.
- **Constraint** (Legendary) — cannot move or act.
- **Duel** (Legendary) — can only target others inflicted with Duel.
- **Frozen** (Legendary) — cannot act until hit (that hit is a guaranteed crit; ends the effect).
- **Cruciatus Curse** (Legendary) — 50%/turn unable to act; −8% MAX HP per turn active.
- **Spider's Web** (Epic) — cannot act until an attack is received (ends it).
- **Dark Seal** (Epic, stackable) — does nothing until the holder's negative statuses are cleansed; then one Dark Seal stack is removed instead and the others are kept (cleanse-shield, e.g. protects Horcrux).
- **Coercion** (Epic) — transforms into Brainwash 2t on natural expiry unless cleansed.
- **Paralyze** (Rare) — 50%/turn unable to act.
- **Retribution** (Rare) — the afflicted can only target the inflictor.
- **Impediment Jinx** (Rare) — next ability nullified (still costs resources); expires on use.
- **Taunt** (Common) — redirects enemy attacks within 6 panels to self.
- **Tracker** (Uncommon) — disables Stealth & Invisible.

## Debuffs (stat/damage)
- **Vulnerable** (Epic) — −40% DEF & RES.
- **Terrify** (Epic) — −20% DEF, RES & EVA.
- **Darkness** (Epic) — +10% damage taken (after defenses); −2 range (min 1).
- **Deep Wound** (Epic) — cannot receive healing (incl. REGEN).
- **Blindness** (Rare) — −30% ACC; −4 range (min 1).
- **Deep Bruise** (Rare) — −30% DEF.
- **Sharp Sting** (Rare) — −30% RES.
- **Disorient** (Rare) — −25% ACC.
- **Bruise** (Uncommon) — −15% DEF.
- **Sting** (Uncommon) — −15% RES.

## Damage-over-time
- **Bleed** (Uncommon) — 40% ATK/turn, +10%/turn up to +100% (inflictor's stat).
- **Shock** (Uncommon) — 50% MAG/turn; 10%/turn to become Paralyze 1t.
- **Burn** (Uncommon) — 80% MAG/turn; ends if hit by Frozen (+80% MAG burst).
- **Frost** (Uncommon) — 80% MAG/turn; ends if hit by Burn/Incinerate (+50% MAG burst).
- **Poison** (Uncommon) — 40% MAG + 40% ATK/turn.
- **Web** (Uncommon) — converts to Spider's Web at 50+ stacks.
- **Webification** (Rare) — attacks inflict 5 Web/4t.
> Note: "Incinerate" is referenced (Frost/Burn interactions, Curly's core) but has no own row in the main status table — treat as a stronger Burn variant; confirm if it needs its own entry.

## Core mechanics (one-liners)
- **Active / Inert** — a status is active (working, timer ticks) or inert (frozen, does nothing, timer paused until made active). Cyborg is the reference.
- **Precise** — vs a *blocking* target: breaks the block, auto-crit, ignores the block's 1.5× multiplier. Vs a non-blocking target: resolves as a normal hit (no guaranteed crit).
- **Piercing** — passes through obstacles and enemies in a line (can hit multiple targets).
- **Block** — inactive until next turn; DEF/RES ×1.5 vs incoming; first-action-only; ends the turn. Precise attacks break it.
- **Standby** — reactionary state ("stands by for the remainder of the turn") holding a triggered effect (intercept / ally-save / counter); exit condition set by the granting ability.
- **Endurance** (formerly "Last Stand"; Catechism `#endurance`) — survive an otherwise-fatal blow at 1 HP (or stated value); per-source activation condition + usage limit; NOT roster-wide (only units whose kit grants it). "Ignores endurance" = bypasses it. ≠ Indestructible/Horcrux (cannot die for a duration / while active) ≠ Revival (returns after defeat).
- **Death Prevention** (tag) — unit cannot die/be defeated for a duration or while a condition holds (Indestructible; Horcrux for its inflictor). Beats Instant Defeat outright. ≠ Endurance (one survived fatal blow at 1 HP), ≠ Revival, ≠ Impenetrable (cannot be damaged → Damage Reduction, though it also blocks Instant Defeat). Holders: Anya, Captain America, Deadpool, Lord Voldemort, Wolverine.
- **Instant Defeat** (Catechism `#instant-defeat`) — "Defeats the target" = defeated regardless of HP. FAILS vs Impenetrable (can't be damaged → can't be defeated), Indestructible, or a Horcrux-protected inflictor. Endurance still triggers unless the ability says "Ignores endurance". Revival still works unless Deathbound. On-defeat triggers fire normally. Ref: Voldemort's Avada Kedavra (its "Horcrux carrier survives at 1 HP and loses the status" clause is kit-specific).
- **Stat boosts are additive** unless stated otherwise (e.g. +15% REGEN on 5% REGEN = 20%). Catechism: Stat Calculations.
- **Guaranteed to land** (Catechism `#guaranteed-to-land`) — cannot miss or be evaded (ignores ACC/EVA and evasion effects); NOT stopped by attack negation (Energy Barrier, Shield Charm, block negation). Only an effect that explicitly works against guaranteed hits still works (Frieza's Hurt for the First Time, 20% below 50% HP; The Hulk's Immeasurable Resistance nullifies the first ULTIMATUM received even if guaranteed). ≠ guaranteed crit (Pinpoint, Precise vs block). Ref: Avada Kedavra.
- **Transformation** — full parallel kit; abilities use the verb "Transforms"; base must be slotted; Leader & Synergies are shared and do NOT transform; passives DO transform (except synergy-granted ones); exactly one transformation per champion; trigger may be ability-activated or an automatic passive condition (e.g. Goku SS below 20% HP, Frieza below 10%).
- **Mounting** (Hover Pod ref) — summoner rides/dismounts at will; no melee while mounted; movement spends the mount's STA first; rider is airborne and can't be grounded; mount may redirect a % of damage aimed at the rider; mount can't be healed/buffed; has its own HP/STA/duration.
- **Domain** — an N×N area centered on a unit or panel applying ongoing effects to units inside for a duration. Every domain must state FIXED or MOVES WITH SOURCE: Voldemort's Dark Influence moves; Thor's Raging Thunderstorm fixed (centered where Thor stands when it forms, 1 turn after cast); Curly's WARNING fixed (centered on Curly at cast). Continuous modifiers apply while inside; recurring effects tick end of turn; domains stack by default (Cloak/Dagger merge). Invisible/Stealth do NOT protect.
- **Persistent** — a kit-declared amplifier; a persistent effect only leaves via duration elapse or removal BY ITS SOURCE; enemy cleanse/nullify/steal can't touch it.
- **Cooldown-ignore** (Deadpool) — spend 6% HP per remaining CD turn to use an on-CD ability; Overdrive bypasses the cost; cooldowns still reset on use.
- **Elevation Bypass** — ignores elevation for movement (full variant also for targeting: melee can reach other tiers / airborne).
- **Taunt + Retribution** — Retribution takes precedence at any range (overrides Taunt's 6-panel rule) for the afflicted enemy; Taunt still applies to all other enemies.
- **Summon persistence on summoner death** — per-summon, defined by its own passives; NOT roster-wide (Loki Clone, Champion Mimic & both Patronuses end when their summoner is defeated; Nagini & Frieza Force Soldier persist until defeated). Always read the summon's passive.
- **Items** — up to 8 unique items, max 3 of each; consumables are used via the "Item" basic action.
- **Debuff Stacking & Stat Floor** — all debuffs stack, incl. identical effects from different sources (two Patronus −30% ATK/MAG auras = −60%); a stat can't be debuffed below 5% of its normal value; the floor doesn't apply to outright prohibitions (Patronus vs "Vast Darkness" damage, Stun). Named-status re-application still follows the Stackable? flag.
- **Ability Nullifying** (Impediment Jinx) — cancels the target's NEXT ability: specials, ULTIMATUM, unique Basic, Block, Wait and Item (item consumed, no effect); Move/Use/End Turn don't count; one stack per nullify; cost + cooldown still paid; nullified Block/Wait still ends the turn; burning a stack with a free Basic is intended counterplay. ≠ Interrupt (reactive cancel by the interrupter).
- **Disabling** — the status stays present but does nothing while disabled (keeps ticking; works again if disabling ends); beats Persistent (Tracker disables a persistent Invisible).
- **SIZE / Multi-Panel Units** (Catechism `#stats`, `#multi-panel-units`; added 2026-10-22) — SIZE = footprint, length x width, shown under EVA on every sheet. Everything is 1x1 except Boom Tube (2x2). Not a normal stat: never upgrades, unaffected by buffs/debuffs, changes only if an ability explicitly says so (and that ability must state how the new footprint is placed). Multi-panel rules: blocks all its panels (unless its kit says otherwise, e.g. Boom Tube teleports whoever enters); range measured to/from the closest footprint panel; hit by AoE/line/domain if any panel is covered but only ONCE per ability; its own "within N panels" area is measured from the footprint edge, excluding the footprint; moves as one piece at 1 STA/panel, every panel must be valid and on the same elevation tier unless airborne; Panel Occupancy HP rule checked against each unit under it (any ≥ HP → stops short, else each displaced to nearest valid panel outside the footprint); pushes stop if any panel is blocked; on an edge if any panel is. Orientation of non-square footprints is deliberately undefined until one exists. **Line abilities from a multi-panel caster** start next to the footprint edge; a 2x2 unit's 2-wide line covers the 2 panels in front each step (cardinal) and, diagonally, uses the 3-wide staircase from its corner panel (= the footprint sliding diagonally); all 8 directions valid. The Hulk is the first 2x2 Champion.
- **Invisible/Stealth vs. untargeted** — they only block being *targeted*; panel-targeted, line and area abilities (incl. domains, thrown items) still hit the unit if they cover its panel.
- **Cooldown Increase** — "all cooldowns +N" hits every cooldown ability, incl. ready ones (put on cooldown for N turns); Basic abilities have no cooldown and are unaffected. Ref: Harry's Expelliarmus.
- **REGEN = healing received** — healing modifiers ("receives X% less healing", Deep Wound, Light) apply to REGEN.
- **Displacement Immunity** (tag, Mitigation; coined 2026-10-23) — cannot be moved (pushed, pulled, launched, thrown) by enemy effects. Holder: The Hulk (Empowered by Anger; portals/teleportation still work).
- **"Attack received" vs. "once per ability"** — "when receiving an attack" triggers per hit (multi-hits trigger it multiple times) unless the effect adds "(once per ability)".
- **Healing Reduction** (tag, Affliction; coined 2026-10-22) — an ENEMY is made to receive less or no healing ("receives X% less healing", "Deep Wound"). Self-inflicted drawbacks (Voldemort's "Receives 30% less healing", Deadpool's "Cannot receive healing") are NOT tagged. Holder: The Winter Soldier (Hidden Blade). Synergy-only sources untagged: Curly (Monitoring Gaze w/ Spider-Man), The Punisher (Final Deliverance w/ Wolverine).
- **Revival** — "Resurrects self with X% HP after N turns": returns after N *complete* turns since death, on the panel where it fell (or nearest free standable panel); enemies can't prevent it unless an ability explicitly says so; on-defeat triggers fire on the original defeat only; summons that ended with the summoner don't return. Refs: Wolverine (Weapon X), Harry (The Boy Who Lived).
- **Resource Visibility** — enemy EN/STA/ULT hidden by default; "Resource Reveal" effects show them for the stated duration, sometimes only part of them (Harry's Lumos, Batgirl's Reading Every Move, Curly's Pilot Vision = ULT only, 1 turn).

## New-mechanic tags awaiting canonical taxonomy/filter entries (Curation queue)
Mind Control, Item Spawn, Interrupt, Cover, Precise, Piercing (surface as Term Definitions).
