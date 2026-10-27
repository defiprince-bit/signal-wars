# Signal Wars — Enemies

> Unofficial HertzFlow fan game. Enemies are **the Static**: corrupted market noise that crawls out of liquidations. Browser-light rule: every enemy is a readable silhouette (≤ ~4k tris, one 512 bake, emissive red/magenta "static" so they pop against HertzFlow sky-blue). Telegraphs are shader/sprite flashes, never heavy particles.

**Color law:** players = sky-blue / gold. Static = red candle + magenta glitch. If it glows red, it hurts you.

| # | Enemy | Island | Tier |
|---|-------|--------|------|
| 1 | Static Crab | Ember Dot | ★ |
| 2 | Wick Runner | Ember Dot | ★ |
| 3 | Red Candle Brute | Ember Dot (mini-boss) | ★★★ |
| 4 | Glitch Moth swarm | Moonleaf Oval | ★★ |
| 5 | Margin Caller (sniper) | The h | ★★ |
| 6 | Tide Leech | Tidering Oval | ★★ |
| 7 | Gold Mimic | Gold Dot | ★★★ |
| 8 | Liquidator Drone | Binance Siege / Dust Array | ★★★ |
| B | **The Master** | Dust Array (finale) | ★★★★★ |

---

## 1. Static Crab — fodder
- **Look:** knee-high crab of cracked black chrome, one red candle-wick antenna, TV-static shell texture.
- **Behavior:** scuttles sideways in packs of 3–6, pinches at melee.
- **Telegraph:** antenna flashes red 0.5s before the pinch.
- **Why it's fun:** Wave-clear piñata; teaches dodge timing.

## 2. Wick Runner — rusher
- **Look:** thin humanoid made of a tall red candle chart line, flame-wick head, long arms.
- **Behavior:** sprints straight at the player, slashes, retreats. Fast, low HP.
- **Telegraph:** crouches + wick flares bright before the dash; dash path draws a red line on the ground.
- **Counter:** sidestep the line, punish the recovery.

## 3. Red Candle Brute — mini-boss
- **Look:** 3m slab-shouldered giant, body a stack of red candle bars, fists like hammers. Health bar on screen.
- **Behavior:** slow walk, ground slam (AoE ring), charge across the beach.
- **Telegraph:** slam = raises both fists, red ring decal fills; charge = stomps twice, shoulder glows.
- **At 30% HP:** "Liquidation Mode" — faster, bars crack and leak static.

## 4. Glitch Moth — swarm
- **Look:** palm-sized moths with pixel-broken wings, magenta trail. Billboard sprites (cheap!).
- **Behavior:** swarm of 8–12 in Moonleaf's forest, blur your screen edges if they touch you.
- **Telegraph:** swarm buzz gets louder + condenses into a ball before diving.
- **Counter:** AoE powers (Zayn ROAR, Hertzling SMG spray).

## 5. Margin Caller — sniper
- **Look:** tall hooded figure with a phone-shaped head screen, long rifle. Stands on rooftops of **The h**.
- **Behavior:** keeps distance, fires charged shots, teleports when reached.
- **Telegraph:** red laser sight + screen reads "CALL" 1s before firing.
- **Counter:** break line of sight, close in fast.

## 6. Tide Leech — ambusher
- **Look:** eel of static water, glowing red gills. Only fin visible above water.
- **Behavior:** hides in Tidering's ring lagoon, lunges at players near the shore, drains Flow (meter) instead of HP.
- **Telegraph:** ripple circle + bubbles where it will surface.

## 7. Gold Mimic — trickster
- **Look:** perfectly copies Gold Dot loot chests / gold coins… until legs pop out. Gold shell, red eye seam.
- **Behavior:** bites, then runs away with your combo. Drops big Merits if caught.
- **Telegraph:** "fake" chests sparkle slightly red at the hinge. Sharp-eyed streamers will call it out.

## 8. Liquidator Drone — elite
- **Look:** floating diamond (Binance Siege motif inverted) with red scanner eye and two blades.
- **Behavior:** hovers, scans a cone, then fires a beam sweep. Shields nearby enemies.
- **Telegraph:** scan cone turns from yellow → red; beam starts 0.8s after red.
- **Counter:** kill it first or the wave gets shielded.

---

## BOSS — The Master
The source of the Static. A towering figure of fractured leverage numbers (2x… 10x… 100x) orbiting a cracked black core. Lives in the central array of **Dust Array**.

**Phase 1 — "Open Position" (100–70%)**
Stands on the array, summons Crabs + Runners, throws candle spears.
Telegraph: spear glows in hand 1s, red ground marker.

**Phase 2 — "Leverage Up" (70–35%)**
Floating numbers lock in: 10x. Arena floor tiles flash red then drop to static (cheap: tile shader swap). Fires sweeping beams like the Drone.
Telegraph: tile flashes twice before dropping; beam path drawn as thin line.

**Phase 3 — "Liquidation" (35–0%)**
100x. Core exposed and pulses. Master slams the array, sends shockwave rings you must jump/dodge, and calls one wave of Liquidator Drones.
Win: hit the core during the post-slam stagger (2s window, core glows sky-blue = "hit me").
Finish: full-screen sky-blue Hertz Wave flash, static evaporates, the islands light back up.

---

## Budget & tech notes
- Max ~25 enemies on screen; instanced meshes for Crabs/Moths.
- One shared "static" shader (noise + red emissive) for all enemies = one material, fast.
- Telegraphs: decals + emissive pulses + audio cue. Readable on a phone stream.
- Death: dissolve into static sprite burst (≤ 0.4s), drop Merit shard.
