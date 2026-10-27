# Art & Performance Budget

Signal Wars is a light, always-on browser game. Realism comes from **silhouette, materials, and FX**, not polygon count.

## Per-character budget (art director spec)
| Part | Tris | Texture |
|---|---|---|
| Body (incl. head, tail, chain) | ≤ ~15k | 1024² baked (albedo/ORM), gold = emissive |
| Weapon | ≤ ~3k | 512² baked |
| Hit FX | sprites / shaders only (additive, no extra geometry lights) | |

Scene targets: ≤ ~150k tris on screen, ≤ 100 draw calls, 1 shadow-free directional + hemi light, pixel ratio capped at 2 (drop to 1 on low-end mobile).

## Zayn (current, procedural v1)
Built in `public/game.js` → `makeZayn()` from the stills in `public/assets/characters/zayn/`.
- ~6–8k tris total (capsules/spheres/boxes, gold chain = 1 InstancedMesh of 22 links → 1 draw call).
- Textures are tiny runtime **CanvasTextures** (fur stripes 512×256, ZAYN shirt 512×256, sleeve/tail stripes 64×256) — zero download.
- Silhouette pillars: tiger head + Wayfarers, gold Cuban chain, oversized gold rifle with emissive crown core (+1 point light), striped tail, sky-blue hem trim.

## Upgrade path
When a `.glb` lands at `public/assets/characters/<name>/<name>.glb` (Draco/Meshopt compressed, KTX2 textures), swap the procedural mesh for it while keeping the same `userData` rig hooks (`legL`, `legR`, `armR`, `tail`, `core`). Distant crowds/enemies can use billboard impostors.

_Unofficial fan project — not affiliated with HertzFlow._
