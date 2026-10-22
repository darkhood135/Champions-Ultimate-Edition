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
- **Light** (Rare) — receives +20% healing.
- **Anger** (Uncommon) — +10% ATK & MAG.
- **Might** (Uncommon) — +15% ATK.
- **Technique** (Uncommon) — +15% MAG.
- **Focus** (Uncommon) — +20% ACC.
- **Regeneration** (Uncommon) — restores 4% HP/turn.
- **Overhealth** (mechanic) — temporary bonus HP above max; time-limited; not healable once depleted.

## Hard/soft CC & control (negative)
- **Brainwash** (Mythic) — all actions randomized (ability/target), within resource limits; can hit allies or enemies.
- **Deathbound** (Mythic) — cannot be resurrected; stays on defeated units; a resurrection attempt is cancelled but still spends its resources.
- **Imperius Curse** (Mythic) — target joins inflictor's team for the duration (full control of its resources/abilities).
- **Horcrux** (Legendary, non-stackable) — while active, the INFLICTOR cannot die by any means (the carrier is unaffected). Voldemort only; carriers can be enemies, allies or summons (Nagini). Classification/cleanse/carrier-death rules pending Catechism pass.
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
- **Deep Wound** (Epic) — cannot receive healing.
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
- **Endurance** (formerly "Last Stand") — endure an otherwise-fatal blow, surviving at 1 HP (or stated value); per-source usage limit; NOT a roster-wide auto. "Ignores endurance" = bypasses these effects. Tag renamed Last Stand → Endurance on champions.html + all sheets 2026-10-21; catechism.html prose still pending its own pass.
- **Death Prevention** (tag, 2026-10-21) — unit cannot die/be defeated for a duration or while a condition holds (Indestructible; Horcrux for its inflictor). ≠ Endurance (one survived fatal blow at 1 HP), ≠ Revival, ≠ Impenetrable (cannot be damaged → Damage Reduction). Holders: Anya, Captain America, Deadpool, Lord Voldemort, Wolverine.
- **Instant Defeat** — "Defeats the target" (Avada Kedavra). Tyler rulings: anything that cannot be damaged (Impenetrable) cannot be defeated; endurance is bypassed only when stated; revival still works unless Deathbound. Full term pending Catechism pass.
- **Stat boosts are additive** unless stated otherwise (e.g. +15% REGEN on 5% REGEN = 20%).
- **Guaranteed to land** — cannot miss or be evaded (Avada Kedavra). Interaction with Energy Barrier/Shield Charm pending Catechism pass.
- **Transformation** — full parallel kit; abilities use the verb "Transforms"; base must be slotted; Leader & Synergies are shared and do NOT transform; passives DO transform (except synergy-granted ones); exactly one transformation per champion; trigger may be ability-activated or an automatic passive condition (e.g. Goku SS below 20% HP, Frieza below 10%).
- **Mounting** (Hover Pod ref) — summoner rides/dismounts at will; no melee while mounted; movement spends the mount's STA first; rider is airborne and can't be grounded; mount may redirect a % of damage aimed at the rider; mount can't be healed/buffed; has its own HP/STA/duration.
- **Domain** — an area (e.g. 5×5, 10×10) centered on a unit/panel that applies ongoing effects to units inside it for a duration (Thor's Wrath of Thunder, Curly's Blazing Omen). [Formal Catechism definition pending in Curation queue.]
- **Persistent** — a kit-declared amplifier; a persistent effect only leaves via duration elapse or removal BY ITS SOURCE; enemy cleanse/nullify/steal can't touch it.
- **Cooldown-ignore** (Deadpool) — spend 6% HP per remaining CD turn to use an on-CD ability; Overdrive bypasses the cost; cooldowns still reset on use.
- **Elevation Bypass** — ignores elevation for movement (full variant also for targeting: melee can reach other tiers / airborne).
- **Taunt + Retribution** — Retribution takes precedence at any range (overrides Taunt's 6-panel rule) for the afflicted enemy; Taunt still applies to all other enemies.
- **Summon persistence on summoner death** — per-summon, defined by its own passives; NOT roster-wide (Loki Clone & Patronus die with summoner; Champion Mimic persists).
- **Items** — up to 8 unique items, max 3 of each; consumables are used via the "Item" basic action.
- **Debuff Stacking & Stat Floor** — all debuffs stack, incl. identical effects from different sources (two Patronus −30% ATK/MAG auras = −60%); a stat can't be debuffed below 5% of its normal value; the floor doesn't apply to outright prohibitions (Patronus vs "Vast Darkness" damage, Stun). Named-status re-application still follows the Stackable? flag.
- **Ability Nullifying** (Impediment Jinx) — cancels the target's NEXT ability: specials, ULTIMATUM, unique Basic, Block, Wait and Item (item consumed, no effect); Move/Use/End Turn don't count; one stack per nullify; cost + cooldown still paid; nullified Block/Wait still ends the turn; burning a stack with a free Basic is intended counterplay. ≠ Interrupt (reactive cancel by the interrupter).
- **Disabling** — the status stays present but does nothing while disabled (keeps ticking; works again if disabling ends); beats Persistent (Tracker disables a persistent Invisible).
- **Invisible/Stealth vs. untargeted** — they only block being *targeted*; panel-targeted, line and area abilities (incl. domains, thrown items) still hit the unit if they cover its panel.
- **Cooldown Increase** — "all cooldowns +N" hits every cooldown ability, incl. ready ones (put on cooldown for N turns); Basic abilities have no cooldown and are unaffected. Ref: Harry's Expelliarmus.
- **Revival** — "Resurrects self with X% HP after N turns": returns after N *complete* turns since death, on the panel where it fell (or nearest free standable panel); enemies can't prevent it unless an ability explicitly says so; on-defeat triggers fire on the original defeat only; summons that ended with the summoner don't return. Refs: Wolverine (Weapon X), Harry (The Boy Who Lived).
- **Resource Visibility** — enemy EN/STA/ULT hidden by default; "Resource Reveal" effects show them for the stated duration, sometimes only part of them (Harry's Lumos, Batgirl's Reading Every Move, Curly's Pilot Vision = ULT only, 1 turn).

## New-mechanic tags awaiting canonical taxonomy/filter entries (Curation queue)
Mind Control, Item Spawn, Interrupt, Cover, Precise, Piercing (surface as Term Definitions), Domain (define).
