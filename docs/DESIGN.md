# Design

## North star (locked Oct 2026): isometric swarm ARPG
Reference: the user's YouTube Short — https://youtube.com/shorts/czlDzzrbdmE (Asmongold reacts to an AI-made isometric action game). That clip *is* the target feel:

- **Camera:** fixed isometric / top-down 3/4, smooth follow, never rotates. No over-the-shoulder.
- **Readability:** muted dark ground; only the player (sky-blue/gold) and the Static (red-magenta) are saturated, so FX pop.
- **Loop:** kite a swarm — fodder packs toward you, you move in any direction while attacking (auto-fire toward cursor / nearest enemy).
- **Feedback:** loud AoE explosions, bouncy white damage numbers (yellow crits), thin red HP bars, screen shake.
- **Shield:** obvious cyan bubble during dodge i-frames and the ROAR buff.
- **Drops:** glowing yellow gems on every kill, magnet to the player, feed Flow energy.
- **Telegraphs:** red pulse + red ground decal before big hits (Brute slam), per art direction.

## Vision
A fast, loud, colorful action game in a futuristic "multiverse" style, branded in HertzFlow sky blue. Short missions that are fun to watch on a live stream.

## Camera
Isometric follow camera (offset ≈ (0, 40, 28), FOV 42 desktop / 55 portrait). The boat "Almost There" intro keeps its cinematic chase cam, then fades to black into the isometric arena.

## Controls (this pass)
WASD / arrows / stick = move (screen-relative) · mouse aims · WAVE auto-fires (hold click / Q to force) · E Gold Chain (AoE) · R Roar (stun + shield buff) · Space dodge (shield i-frames) · M music.

## Performance rules
Crabs are one InstancedMesh (body/claws/eyes); gems instanced; all Static share one noise-flicker shader; HP bars + damage numbers on a single 2D canvas overlay; enemies ≤ ~4k tris.

## Mission flow (overview → boat intro)
1. Pick any Signal Keeper (fan build: whole roster unlocked).
1b. Aerial overview of the HertzFlow Archipelago (islands read as the logo layout) → camera dives into clouds → fade to black.
2. Cinematic: speedboat cutting toward the island — "Almost There".
3. Hard fade to black.
4. Fade in on the beach, weapon in hand, mission objective on screen.
Every mission tells one story beat and ends in a payoff (boss, rescue, island claimed).

## Section levels
Missions are cut into **3 short sections** on the island instead of one endless fight. Each section has its own ground tint/edge color, objective, Warden/enemy line and wave plan. HUD (top-left) shows `n/3 · SECTION NAME`, a 3-segment progress bar and the live objective.
- **Clear:** finish the section's waves (+ any hold objective) → "SECTION CLEARED" banner → fade → next section card. HP refills, score/kills/gems carry over.
- **Fail:** LIQUIDATED → **RETRY SECTION** (restart current section with stats rolled back to section start) or **RUN IT BACK** (full mission from the boat).
- **Section color rules (art direction):** each section owns its edge ring + ground tint. Static enemies always stay red/magenta; the player stays sky-blue/gold; bosses (Red Candle Brute) are dark chrome with a red-candle emissive only, never crab magenta.
  - Ember Dot: §1 Shore = lifted sand ground, warm gold edge · §2 Tower Ridge = teal ground, sky edge, tall Signal Tower with emissive sky-blue core · §3 Crater Gate = deep ember-orange ground, hard red edge.
  - Later islands: Moonleaf Oval = night green; The h = rooftop grey.
- Mission 01 sections: see [STORY.md](STORY.md#mission-01-section-levels).
- Damage numbers merge nearby hits (≤3.5m, <0.35s) into one growing number; hard cap 8 visible floats, extras fold into the nearest. Crits stay yellow.

## Roster
Hero (Mythic, founder, strongest) · Bankyo (Legendary) · Zayn (Legendary) · Lyra · Hertzling · Chado · Kael · Warden — see [CHARACTERS.md](CHARACTERS.md).

## Maps
- **HertzFlow Archipelago** (logo-shaped): Ember Dot, Moonleaf Oval, The h (Master boss), Tidering Oval, Gold Dot (1v1 arena).
- **Binance Siege** — diamond-logo islands under storm attack (event map).
- **Dust Array** — desert warzone with docks, towers, central array (late game / Hyper Lev).

## Combat pillars
- Tap = Hertz Wave, hold = charged pierce, dodge with i-frames, full meter = signature.
- Each character has 3–4 on-screen power buttons (mobile) mirrored by keys (desktop).
- Hit-stop, sparks, screen shake, big colored waves per character.
- Enemies: Glitch Crab, Wick Runner, Red Candle Brute, Static Spitter → the Master (melee → rifts → Liquidation Mode).
- Hyper Lev (2x–100x) multiplies score and damage taken.

## Visual north star
`docs/ref-short-frame.png` (from the reference Short): iso top-down, muted desaturated ground, high-contrast sharp FX, one loud cyan/sky shield read on the player, tiny swarm vs ~3× elite, compact vertical icon skill strip (desktop) with cooldown sweep + tiny hotkey caption. Player sits lower-third so kite space above stays readable. FX budget: one hit flash + thin rings, short sparks, no ground-washing trails.

## Movement feel
Snappy, not floaty: velocity eases to target in ~0.05s, near-instant stop, snap-to-face (aim or move), hop stride + forward lean, landing squash, punchy 0.18s dodge hop with i-frames + whoosh. Shared by every character (per-char top speed only).

## Audio
Theme ducks to ~30% under combat (title 0.55 → boat 0.32 → combat 0.16) so synth SFX read: hit tick, shot whoosh, boom, gem blip, dodge whoosh, roar, hurt. Mute (M / ♪) silences both.

## Skill strip spec (art director)
4 dark squares (60px desktop, left edge; 52px 2×2 bottom-right on touch, 48px small phones), colored glyph only: WAVE cyan arc · CHAIN gold link · ROAR magenta ring · DODGE green dash. Cooldown = clockwise dark wipe + rim refill; ready = soft emissive pulse; hotkey caption 9px under icon; no word labels in combat.

## Enemy materials
Fodder (crabs, runners): flat magenta Static shader, ≤2 materials (body + flame/eyes). Elite Brute: dark chrome + red candle/eye emissive only. Death: 0.3s static dissolve (shrinking glow + rising motes) → Merit gems drop.

## Loop
Enemy HP scales +35%/section and +15%/wave. Ambient dust motes over a muted stone floor. Best score saved in localStorage (shown on title + end screen).

## Arena status
The circular arena is **deprecated**. It stays only as the placeholder until the HertzFlow logo map lands. Planned next: a logo-shaped map with route **A → B** through the sections, plus a **Binance Siege mode switch** (diamond-logo map). Section tints and rules carry over.

## Enemy contrast (art director, crabs)
Charcoal shell; magenta only as a thin fresnel rim + glitch fringe. Big cyan-white eyes with a soft glow so every crab has a face. Per-crab rim hue ±4% / value ±10% jitter. Wick Runner: charcoal body, the tall hard-red wick is its only accent (packs read as N candles). Crab separation keeps ≥0.4× body-width gaps so legs don't merge. Target: count 6 crabs in ~1s at phone size.

## Reserved silhouette slots
**Stripes** and **Good Afternoon** have reserved slots but no meshes. Wait for the art director's shapes; don't invent them.

## Logo maps (current) — circular arena removed
- Mode switch on title: **HERTZFLOW**, **BINANCE SIEGE**, HARDEST · SOON (desert alternate, held).
- Each map is SDF land in the logo shape; sections form a narrow A→B path. Boat lands at A, player fights to B. Next path segment opens only after a section clears (beacon marks the trigger).
- HertzFlow L→R: left dot shore (tutorial) → left pill corridor (Wave 1) → H crossbar hub (Brute; verticals = flank alleys) → right pill choke (darker canopy) → right dot extract gate (hold the ring). Turquoise reef halo.
- Binance: same green islands, storm grade (dark teal water, lightning, fires); diamond channels A→B, outer L's → DIAMOND CORE finale (hold 12s).
- Spawns come out of the canopy edge (sides/front/behind), never from open ocean. Enemies clamped to land; stuck ones re-emerge.
- Ground/path kept muted; arena lighting dimmed (storm darker).

## Intro timing (locked)
Overview+clouds = 10.0s: 0–3s high hold on the selected logo map + Shore→Extract breadcrumb; 3–7.5s slow orbit with drifting/breathing clouds; 7.5–10s dive, cover thickens → fade → boat. Skip anytime; timeline runs on clamped frame time, so slow loads hold rather than cut.
Boat: longer hull, raked windshield, outboard cowling, soft bob/roll, denser wake + hull/bow foam. Water: deeper teal, slower swell, subtle speculars.

## Class cards (Bone King layout)
Gold/charcoal plate, mini silhouette, role chip, 1-liner, 3 kit icons (wave/chain/roar), hard gold select border. Starters: Lyra · Scout, Hertzling · Spirit, Chado · Blade. Locked cards show "—" until tease lines land.

## Combat feel (art lock)
- Acquire 18u: auto-fire only on a foe inside acquire range; never into canopy fog. Auto-target has hysteresis (no flip-flop).
- Spawn telegraph: 0.4s thin magenta rim at the canopy-edge spawn point, then the foe enters (no body flash).
- Cursor: soft cyan ground reticle; sticky ~22° cone snaps to a readable foe; outside the cone the cursor always wins.
- Facing dead-zone kills yaw jitter; dodge hop 2.1u.
- Foe read: tiny HP bar only within range; locked foe shows its name (Driftwood Crab / Wick Runner / Red Candle Brute). Float numbers + white hit-flash unchanged.
- Boat ride: seated mid-hull (knees bent, hand on gunwale), soft seat bob; camera pulled back/high to show the full hull; stands only after the beach fade.
