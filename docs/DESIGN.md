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
