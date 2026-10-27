# Zayn — Three.js mesh budget (light web)

## Target
- Playable third-person; readable from camera-behind
- Prefer single `.glb` ≤ ~15k tris character + ≤ ~3k rifle (or one combined ≤ 18k)
- 1–2 material slots: body (baseColor + emissive for gold accents), rifle (baseColor + emissive)

## Silhouette pillars (must survive low poly)
1. Tiger head + Wayfarers
2. Thick gold chain
3. Oversized gold-glow rifle + crown core
4. Tiger tail (thin strip is enough)

## Textures
- Bake: 1024² body, 512² rifle (or atlas 1024)
- Gold trim = emissive, not heavy metalness sim
- No real-time SSS on fur — flat fur color + slight AO

## FX (not in mesh)
- Gold hit = sprite sheet / additive billboards + short point light
- Rifle idle arcs = shader or 2–3 billboards, not particles sims

## Staging without GLB
Use `zayn-front.jpg` / `zayn-back.jpg` / `zayn-side.jpg` / `zayn-rifle.jpg` as texture references; billboard or box placeholder OK until mesh lands.
