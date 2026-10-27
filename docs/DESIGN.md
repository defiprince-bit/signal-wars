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

## Mission flow (boat intro)
1. Pick a character you own.
2. Cinematic: speedboat cutting toward the island — "Almost There".
3. Hard fade to black.
4. Fade in on the beach, weapon in hand, mission objective on screen.
Every mission tells one story beat and ends in a payoff (boss, rescue, island claimed).

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
