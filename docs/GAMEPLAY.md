# What makes Signal Wars worth playing

## Honest status
The current build is a **blocky placeholder prototype**: characters are simple shapes, weapons are hard to read, FX are basic, and there's one short beach mission. It proves the loop (boat intro → fight → powers HUD), not the feel. Below is what has to be true for it to be worth playing.

## Pillars
1. **Readable characters & weapons** — distinct silhouettes, PFP-faithful colors, oversized weapons, rim lighting so they pop on any background.
2. **Juicy combat feedback** — hit-stop, knockback, damage numbers, screen shake, per-power color explosions, audio stingers. Every hit should feel like it landed.
3. **Mission story beats** — each island = one chapter with an objective, a twist mid-mission, and a boss or set-piece ending. Short VO/text lines from the roster.
4. **Boat intro payoffs** — intro shows what's waiting (smoke, monsters on the shore, the Master's silhouette); vary it per mission so it never feels like a loading screen.
5. **Power kit identity** — every character plays differently (Zayn rush/lasso, Bankyo heal/tide, Hero time-freeze). On-screen buttons with cooldown rings.
6. **Progression & unlocks** — earn characters through challenges (Hero hardest), cosmetics, ranks per Epoch/Season. No real money.
7. **Live / stream hooks** — chat votes on events, chat-picked 1v1 challengers, big moment banners, shareable end-of-run cards.
8. **Always-on play URL** — hosted server so anyone can play from a link; later: leaderboards and matchmaking.

## Art pipeline (upcoming character videos)
1. Creator sends a short turnaround/action video per character.
2. Extract key poses/frames → reference sheet (front/side/back, weapon, palette).
3. Build low-poly 3D model (Blender) or 2.5D sprite billboard as interim.
4. Rig + animate: idle, run, attack x3, dodge, signature, hit, KO.
5. Export glTF (`.glb`) into `public/assets/characters/<name>/`; load with Three.js GLTFLoader.
6. Tune readability in-game at stream resolution and on mobile.

## Section levels (live)
Mission 01 now plays as 3 sections (Shore Landing → Tower Ridge → Crater Gate) with a cleared banner + fade between each and Retry Section on fail. Test hook: `__section(i)` in the console jumps to section i (0–2).
