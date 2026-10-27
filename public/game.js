import * as THREE from 'three';
const $ = s => document.querySelector(s);
const SKY = 0x4DB8FF;
const R = new THREE.WebGLRenderer({ canvas: $('#c'), antialias: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffc49a);
scene.fog = new THREE.Fog(0xffd2a8, 90, 320);
const cam = new THREE.PerspectiveCamera(60, 1, 0.1, 3000);
function resize() { R.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.fov = cam.aspect < 1 ? 78 : 60; cam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight(0xcff4ff, 0x3a6a40, 1.1));
const sun = new THREE.DirectionalLight(0xffc08a, 1.9); sun.position.set(-60, 50, -120); scene.add(sun);
const M = (c, e = 0, o = {}) => new THREE.MeshStandardMaterial({ color: c, emissive: e ? c : 0, emissiveIntensity: e, roughness: .6, ...o });
const glow = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });

// sky dome w/ gradient
const sky = new THREE.Group(); scene.add(sky);
{ const g = new THREE.SphereGeometry(1200, 32, 16), col = [];
  const p = g.attributes.position, top = new THREE.Color(0x2a8cff), hor = new THREE.Color(0xff9a5a), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { c.copy(hor).lerp(top, Math.min(1, Math.max(0, p.getY(i) / 1200) * 2.2)); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  sky.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }))); }
{ const s = new THREE.Mesh(new THREE.CircleGeometry(40, 32), new THREE.MeshBasicMaterial({ color: 0xffb347, fog: false })); s.position.set(-300, 70, -900); s.lookAt(0, 0, 0); scene.add(s); }
// ocean
const oceanG = new THREE.PlaneGeometry(700, 700, 120, 120); oceanG.rotateX(-Math.PI / 2);
const ocean = new THREE.Mesh(oceanG, new THREE.MeshStandardMaterial({ color: 0x12c8e8, roughness: .25, metalness: .1, flatShading: true, transparent: true, opacity: .93 }));
ocean.position.y = -0.4; scene.add(ocean);
const oBase = Float32Array.from(oceanG.attributes.position.array);
// island (Ember Dot) + background HertzFlow-mark islets
function island(x, z, r, h, glowCol, small = true) {
  const g = new THREE.Group();
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.15, 1.2, 48), M(0xffe2a0)); sand.position.y = -.3; g.add(sand);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.45, r * 1.5, .3, 48), new THREE.MeshStandardMaterial({ color: 0x5ff2e8, transparent: true, opacity: .55, roughness: .2 })); sh.position.y = -.35; g.add(sh);
  const grass = new THREE.Mesh(new THREE.CylinderGeometry(r * .3, r * .38, h, 24), M(0x2fb85e)); grass.position.set(0, h / 2, small ? 0 : -r * .78); g.add(grass);
  if (glowCol) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.17, .35, 8, 64), glow(glowCol)); ring.rotation.x = Math.PI / 2; ring.position.y = .1; g.add(ring); }
  g.position.set(x, 0, z); scene.add(g); return g;
}
island(0, 0, 52, 3, SKY, false);
[[-120, -150, 14], [-60, -190, 20], [20, -210, 26], [100, -190, 20], [160, -150, 14]].forEach(([x, z, r]) => island(x, z, r, 6, 0x9ff6ff));
function palm(x, z, s = 1) {
  const g = new THREE.Group();
  const t = new THREE.Mesh(new THREE.CylinderGeometry(.25 * s, .4 * s, 6 * s, 6), M(0x8a5a2b)); t.position.y = 3 * s; t.rotation.z = .12; g.add(t);
  for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.6 * s, 4 * s, 4), M(0x1fbf4a)); l.position.set(Math.cos(i) * 1.6 * s, 6 * s, Math.sin(i) * 1.6 * s); l.rotation.set(Math.sin(i) * 1.6, 0, -Math.cos(i) * 1.6); g.add(l); }
  g.position.set(x, 0, z); scene.add(g);
}
for (let i = 0; i < 9; i++) palm(-14 + i * 3.5, -40 - (i % 3) * 3, 1 + (i % 3) * .25);
for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + .2; palm(Math.cos(a) * 44, Math.sin(a) * 44, 1 + (i % 2) * .3); }
for (let i = 0; i < 30; i++) { const a = Math.random() * 6.28, d = 8 + Math.random() * 30, sh = new THREE.Mesh(new THREE.DodecahedronGeometry(.3 + Math.random() * .5), M([0xff8a5a, 0xffe0b0, 0x4DB8FF][i % 3], .2)); sh.position.set(Math.cos(a) * d, .1, Math.sin(a) * d); scene.add(sh); }
// HertzFlow signal pylons
const pylons = [];
for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + .3, g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.CylinderGeometry(.6, 1, 7, 6), M(0x123a6a)); b.position.y = 3.5; g.add(b);
  const o = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), glow(SKY)); o.position.y = 8.5; g.add(o); pylons.push(o);
  g.position.set(Math.cos(a) * 36, 0, Math.sin(a) * 36); scene.add(g); }
// big floating "h" sigil
{ const h = new THREE.Group(), m = glow(SKY);
  const a = new THREE.Mesh(new THREE.BoxGeometry(2, 14, 2), m); a.position.set(-3, 7, 0);
  const b = new THREE.Mesh(new THREE.TorusGeometry(3, 1, 8, 24, Math.PI), m); b.position.set(0, 6, 0);
  const c = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 2), m); c.position.set(3, 3, 0);
  h.add(a, b, c); h.position.set(20, 30, -215); h.scale.setScalar(2); scene.add(h); }

// ===== particles =====
const dot = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, '#fff'); g.addColorStop(.4, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
const PN = 3000, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 3), pv = [];
const pG = new THREE.BufferGeometry(); pG.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pG.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
const pts = new THREE.Points(pG, new THREE.PointsMaterial({ size: .9, map: dot, alphaTest: .01, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
pts.frustumCulled = false; scene.add(pts);
for (let i = 0; i < PN; i++) { pv.push({ l: 0, vx: 0, vy: 0, vz: 0, g: 0 }); pPos[i * 3 + 1] = -999; }
let pi = 0; const tc = new THREE.Color();
function burst(p, col, n = 30, sp = 10, up = 4, g = 14) {
  for (let k = 0; k < n; k++) { const i = pi = (pi + 1) % PN, v = pv[i];
    pPos[i * 3] = p.x; pPos[i * 3 + 1] = p.y; pPos[i * 3 + 2] = p.z;
    const a = Math.random() * 6.28, s = Math.random() * sp;
    v.vx = Math.cos(a) * s; v.vz = Math.sin(a) * s; v.vy = Math.random() * up + up * .3; v.l = .5 + Math.random() * .6; v.g = g;
    tc.set(Array.isArray(col) ? col[k % col.length] : col); pCol[i * 3] = tc.r; pCol[i * 3 + 1] = tc.g; pCol[i * 3 + 2] = tc.b; }
}
function stepParticles(dt) {
  for (let i = 0; i < PN; i++) { const v = pv[i]; if (v.l <= 0) continue; v.l -= dt;
    if (v.l <= 0) { pPos[i * 3 + 1] = -999; continue; }
    v.vy -= v.g * dt; pPos[i * 3] += v.vx * dt; pPos[i * 3 + 1] += v.vy * dt; pPos[i * 3 + 2] += v.vz * dt;
    pCol[i * 3] *= .985; pCol[i * 3 + 1] *= .985; pCol[i * 3 + 2] *= .985; }
  pG.attributes.position.needsUpdate = pG.attributes.color.needsUpdate = true;
}
// expanding FX meshes (rings, flashes)
const fx = [];
function ring(p, col, max = 10, life = .5, y = .3, tube = .25) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, tube, 8, 48), glow(col)); m.rotation.x = Math.PI / 2; m.position.set(p.x, y, p.z); scene.add(m); fx.push({ m, t: 0, life, max }); }
function flash(p, col, max = 4, life = .25) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), glow(col)); m.position.copy(p); scene.add(m); fx.push({ m, t: 0, life, max }); }
function stepFx(dt) { for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt; const k = f.t / f.life; f.m.scale.setScalar(.2 + k * f.max); f.m.material.opacity = (f.m.geometry.type === 'SphereGeometry' ? .45 : 1) * (1 - k); if (k >= 1) { scene.remove(f.m); f.m.geometry.dispose(); fx.splice(i, 1); } } }

// ===== Zayn (low-poly + canvas textures; budget in docs/ART_BUDGET.md) =====
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const furTex = canvasTex(512, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ff8a1e'); g.addColorStop(1, '#ffa940'); x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = '#fff3e0'; x.fillRect(0, h * .78, w, h * .22); x.fillStyle = '#120c08';
  for (let i = 0; i < 9; i++) { const cx = (i + .5) * w / 9; x.beginPath(); x.moveTo(cx - 14, h * .12); x.lineTo(cx + 10, h * (.5 + (i % 2) * .12)); x.lineTo(cx + 14, h * .12); x.fill(); } });
const shirtTex = canvasTex(512, 256, (x, w, h) => { x.fillStyle = '#111116'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffc83d'; x.font = 'bold 64px Arial Black, sans-serif'; x.textAlign = 'center';
  for (const px of [0, .5, 1]) x.fillText('ZAYN', w * px, h * .5); x.fillStyle = '#4DB8FF'; x.fillRect(0, h * .9, w, h * .05); });
const sleeveTex = canvasTex(64, 256, (x, w, h) => { x.fillStyle = '#111116'; x.fillRect(0, 0, w, h); x.fillStyle = '#f2efe6'; for (let i = 0; i < 6; i++) x.fillRect(0, 20 + i * 30, w * .3, 14); });
const tailTex = canvasTex(64, 256, (x, w, h) => { x.fillStyle = '#ef8423'; x.fillRect(0, 0, w, h); x.fillStyle = '#120c08'; for (let i = 0; i < 8; i++) x.fillRect(0, i * 32, w, 13); });
function makeZayn() {
  const g = new THREE.Group(), blk = M(0x16161c, 0, { roughness: .85 }), pant = M(0x1c1d22, 0, { roughness: .9 });
  const gold = M(0xffc83d, .9, { metalness: 1, roughness: .25 }), fur = new THREE.MeshStandardMaterial({ map: furTex, roughness: .95 });
  const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 3, 10), m);
  // legs: cargo pants + gold/black kicks
  const mkLeg = sx => { const p = new THREE.Group(); p.position.set(sx, 1.45, 0); const l = cap(.3, .95, pant); l.position.y = -.7; p.add(l);
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(.12, .4, .32), pant); pocket.position.set(sx * 1.05, -.6, 0); p.add(pocket);
    const crown = new THREE.Mesh(new THREE.OctahedronGeometry(.07, 0), gold); crown.position.set(sx * 1.25, -.55, 0); p.add(crown);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(.5, .32, .85), blk); shoe.position.set(0, -1.32, .12); p.add(shoe);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(.52, .1, .88), M(0xf3ead6)); sole.position.set(0, -1.48, .12); p.add(sole);
    const swoosh = new THREE.Mesh(new THREE.BoxGeometry(.53, .1, .5), gold); swoosh.position.set(0, -1.28, .1); p.add(swoosh); return p; };
  const legL = mkLeg(-.36), legR = mkLeg(.36);
  // torso: black crewneck with ZAYN print
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.82, .72, 1.75, 14, 1), [new THREE.MeshStandardMaterial({ map: shirtTex, roughness: .85 }), blk, blk]); body.position.y = 2.35;
  const hem = new THREE.Mesh(new THREE.TorusGeometry(.73, .09, 6, 16), blk); hem.rotation.x = Math.PI / 2; hem.position.y = 1.5;
  const trim = new THREE.Mesh(new THREE.TorusGeometry(.75, .05, 6, 20), M(SKY, 1.4)); trim.rotation.x = Math.PI / 2; trim.position.y = 1.62;
  // tiger head
  const head = new THREE.Mesh(new THREE.SphereGeometry(.72, 20, 14), fur); head.position.y = 3.85; head.scale.set(1, .95, 1);
  const ruff = new THREE.Mesh(new THREE.SphereGeometry(.62, 14, 8), M(0xfff3e0, 0, { roughness: 1 })); ruff.position.set(0, 3.45, .12); ruff.scale.set(1.25, .6, 1.05);
  const mkEar = sx => { const e = new THREE.Mesh(new THREE.ConeGeometry(.32, .5, 6), M(0x1a120c)); e.position.set(sx * .56, 4.55, -.05); e.rotation.z = -sx * .35;
    const w = new THREE.Mesh(new THREE.CircleGeometry(.11, 8), M(0xffffff)); w.position.set(0, -.02, -.2); w.rotation.y = Math.PI; e.add(w); return e; };
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(.34, 12, 8), M(0xfff1dc, 0, { roughness: 1 })); muzzle.position.set(0, 3.62, .58); muzzle.scale.set(1.1, .7, .7);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 6), M(0x2a1410)); nose.position.set(0, 3.74, .82);
  // Wayfarers: two trapezoid lenses + bar, wraps sides so it reads from behind
  const lensM = M(0x050507, 0, { metalness: 1, roughness: .08 }), shades = new THREE.Group();
  for (const sx of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.48, .26, .08), lensM); l.position.set(sx * .3, 0, 0); l.rotation.y = sx * .18; shades.add(l);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.05, .07, .7), lensM); arm.position.set(sx * .66, .05, -.35); shades.add(arm); }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.2, .07, .09), gold); bar.position.y = .12; shades.add(bar); shades.position.set(0, 3.98, .66);
  // gold cuban chain (instanced links)
  const N = 22, chain = new THREE.InstancedMesh(new THREE.TorusGeometry(.11, .05, 5, 10), gold, N), o = new THREE.Object3D();
  for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2; o.position.set(Math.sin(a) * .62, 3.2 - Math.max(0, Math.cos(a)) * .32, Math.cos(a) * .55); o.rotation.set(0, a, i % 2 ? Math.PI / 2 : 0); o.updateMatrix(); chain.setMatrixAt(i, o.matrix); }
  const collar = new THREE.Mesh(new THREE.TorusGeometry(.66, .09, 6, 24), gold); collar.rotation.x = Math.PI / 2; collar.position.y = 3.12;
  const pendant = new THREE.Mesh(new THREE.OctahedronGeometry(.16, 0), gold); pendant.position.set(0, 2.78, .75);
  // tail (stripey, curves down)
  const tail = new THREE.Group(); tail.position.set(0, 1.55, -.6); const tm = new THREE.MeshStandardMaterial({ map: tailTex, roughness: .95 });
  { let par = tail; for (let i = 0; i < 4; i++) { const s = new THREE.Group(); s.position.y = i ? -.45 : 0; s.rotation.x = i ? .3 : .55; const c = cap(.13 - i * .01, .36, tm); c.position.y = -.22; s.add(c); par.add(s); par = s; }
    const tip = new THREE.Mesh(new THREE.SphereGeometry(.15, 8, 6), M(0x120c08)); tip.position.y = -.55; par.add(tip); }
  // arms (striped sleeves)
  const slv = new THREE.MeshStandardMaterial({ map: sleeveTex, roughness: .85 });
  const armL = cap(.22, 1.05, slv); armL.position.set(-.98, 2.35, .25); armL.rotation.set(-.9, 0, .35);
  const armR = new THREE.Group(); armR.position.set(.95, 2.95, 0);
  const arm = cap(.22, 1.05, slv); arm.position.y = -.65; armR.add(arm);
  const paw = new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), fur); paw.position.y = -1.35; armR.add(paw);
  // oversized gold rifle w/ crown core (aims forward from right hand; swings with armR)
  const rifle = new THREE.Group(); rifle.position.set(-.25, -1.3, .9); rifle.rotation.x = Math.PI / 2; rifle.scale.setScalar(1.35);
  const add = (geo, m, x, y, z, rx = 0) => { const k = new THREE.Mesh(geo, m); k.position.set(x, y, z); k.rotation.x = rx; rifle.add(k); return k; };
  const gunM = M(0x0d0d12, 0, { metalness: .8, roughness: .3 });
  add(new THREE.BoxGeometry(.34, 1.8, .42), gunM, 0, 0, 0);                          // receiver
  add(new THREE.CylinderGeometry(.08, .1, 2.6, 8), gunM, 0, 2.2, .06);               // barrel
  add(new THREE.ConeGeometry(.16, .5, 6), gold, 0, 3.7, .06);                        // spear tip
  add(new THREE.BoxGeometry(.4, 1.2, .1), gold, 0, .6, .25);                         // gold side plate
  for (const sx of [-1, 1]) { const f = add(new THREE.ConeGeometry(.12, .9, 4), gold, sx * .28, 1.1, 0); f.rotation.z = sx * -.6; } // fins
  add(new THREE.BoxGeometry(.36, .9, .6), gunM, 0, -1.25, -.12);                      // stock
  add(new THREE.BoxGeometry(.18, .5, .14), gunM, 0, -.2, -.35);                      // grip
  const core = add(new THREE.IcosahedronGeometry(.24, 0), M(0xffd45a, 3), 0, .25, .32);  // crown core
  for (let i = 0; i < 3; i++) add(new THREE.ConeGeometry(.06, .22, 4), M(0xffd45a, 2.5), (i - 1) * .12, .25 + (i === 1 ? .32 : .24), .32);
  const halo = add(new THREE.SphereGeometry(.55, 10, 8), glow(0xffc83d), 0, .25, .32); halo.material.opacity = .35;
  const blade = add(new THREE.CylinderGeometry(.05, .05, 2.6, 6), glow(0xffe08a), 0, 2.2, .06); blade.material.opacity = .5;
  armR.add(rifle);
  const bl = new THREE.PointLight(0xffc83d, 5, 8); bl.position.set(0, -1.3, 1.6); armR.add(bl);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.2, 20), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .3 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .05;
  g.add(legL, legR, body, hem, trim, head, ruff, mkEar(-1), mkEar(1), muzzle, nose, shades, chain, collar, pendant, tail, armL, armR, shadow);
  g.userData = { legL, legR, armR, blade, core, tail }; g.scale.setScalar(1.6); return g;
}
const zayn = makeZayn(); scene.add(zayn);
// speedboat
const boat = new THREE.Group();
{ const hull = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.2, 9), M(0xffffff)); hull.position.y = .3;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(1.7, 3, 4), M(0xffffff)); nose.rotation.x = Math.PI / 2; nose.rotation.y = Math.PI / 4; nose.position.set(0, .3, 6); nose.scale.set(1, 1, .7);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.45, .3, 9.1), M(SKY, .5)); stripe.position.y = .5;
  const glass = new THREE.Mesh(new THREE.BoxGeometry(3, 1, .2), M(0x99e6ff, .3, { transparent: true, opacity: .6 })); glass.position.set(0, 1.4, 2.5); glass.rotation.x = -.4;
  boat.add(hull, nose, stripe, glass); scene.add(boat); boat.visible = false; }

// ===== isometric arena: muted dark floor so FX pop =====
const ARENA = 40;
const keep = new Set([ocean, pts, sky, zayn, boat]); const decor = scene.children.filter(o => !o.isLight && !keep.has(o));
const floorTex = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#6a6b70'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${Math.random() * .05})`; x.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 18, 3 + Math.random() * 18); }
  x.strokeStyle = 'rgba(77,184,255,.08)'; x.lineWidth = 2; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } });
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(6, 6);
const arena = new THREE.Group();
let floorM, edgeM, tower;
{ const f = new THREE.Mesh(new THREE.CircleGeometry(ARENA + 6, 64), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 1 })); f.rotation.x = -Math.PI / 2; f.position.y = .32; arena.add(f); floorM = f.material;
  const edge = new THREE.Mesh(new THREE.TorusGeometry(ARENA + 1, .25, 6, 96), glow(SKY)); edge.rotation.x = Math.PI / 2; edge.position.y = .4; edge.material.opacity = .5; arena.add(edge); edgeM = edge.material;
  tower = new THREE.Group(); const tr = new THREE.Mesh(new THREE.TorusGeometry(5, .15, 6, 48), glow(SKY)); tr.rotation.x = Math.PI / 2; tr.position.y = .45;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.45, .8, 12, 6), new THREE.MeshStandardMaterial({ color: 0x1b2230, emissive: SKY, emissiveIntensity: .25 })); pole.position.y = 6;
  const tcore = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), M(SKY, 3.5)); tcore.position.y = 12.8; const tglow = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 8), glow(SKY)); tglow.material.opacity = .25; tglow.position.y = 12.8; tower.add(tr, pole, tcore, tglow); tower.userData.core = tcore; tower.position.set(0, 0, -9); tower.visible = false; arena.add(tower); }
arena.visible = false; scene.add(arena);

// ===== shared Static shader (red-magenta, noise flicker) =====
const U = { uTime: { value: 0 } };
function staticMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff1450, emissiveIntensity: .7, roughness: .5, flatShading: true });
  m.onBeforeCompile = s => { s.uniforms.uTime = U.uTime;
    s.fragmentShader = 'uniform float uTime;\n' + s.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      float n = fract(sin(dot(floor(vViewPosition.xy * 3.0) + floor(uTime * 12.0), vec2(12.9898, 78.233))) * 43758.5453);
      totalEmissiveRadiance *= 0.55 + n * 0.9;`); };
  return m;
}
const STATIC = staticMaterial(); const STATIC_SOLID = staticMaterial(); STATIC_SOLID.color.set(0xd8204e); // same Static shader; solid tint for non-instanced
const STATIC_COL = new THREE.Color(0xd8204e), HIT_COL = new THREE.Color(0xffffff).multiplyScalar(3);

// ===== enemies (crabs instanced; runners/brutes share STATIC) =====
const TYPES = {
  crab: { hp: 18, sp: 6, dmg: 3, r: .9, xp: 1 },
  wick: { hp: 14, sp: 9.5, dmg: 3, r: .7, xp: 1 },
  brute: { hp: 260, sp: 3.2, dmg: 22, r: 2.2, xp: 8 },
};
const MAXC = 320;
const crabBody = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0).scale(1.3, .7, 1), STATIC, MAXC);
const crabClaw = new THREE.InstancedMesh(new THREE.ConeGeometry(.35, 1.2, 4).rotateX(Math.PI / 2), STATIC, MAXC * 2);
for (const im of [crabBody, crabClaw]) { im.count = 0; im.frustumCulled = false; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(im); }
const crabEyes = new THREE.InstancedMesh(new THREE.SphereGeometry(.16, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), MAXC * 2); crabEyes.count = 0; crabEyes.frustumCulled = false; scene.add(crabEyes);
const BRUTE_CHROME = new THREE.MeshStandardMaterial({ color: 0x2a2d34, metalness: .95, roughness: .28, emissive: 0x08090c });
function makeMesh(type) {
  const g = new THREE.Group();
  if (type === 'wick') { const b = new THREE.Mesh(new THREE.BoxGeometry(.8, 2.2, .8), STATIC_SOLID); b.position.y = 1.5; g.add(b);
    const w = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.1, .14), glow(0xff5a8a)); w.position.y = 3.2; g.add(w); }
  if (type === 'brute') { const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.4, 2.2), BRUTE_CHROME); b.position.y = 2.6; g.add(b);
    const wick = new THREE.Mesh(new THREE.BoxGeometry(.5, 2.4, .5), M(0xff1a10, 3)); wick.position.y = 6; g.add(wick); const cf = new THREE.Mesh(new THREE.ConeGeometry(.35, .9, 6), glow(0xff3a10)); cf.position.y = 7.6; g.add(cf);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(2.66, .25, 2.26), M(0xff1a10, 2.5)); seam.position.y = 3.4; g.add(seam);
    for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.BoxGeometry(1, 2.6, 1), BRUTE_CHROME); a.position.set(s * 1.9, 2.4, 0); g.add(a); } }
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.15, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff })); e.position.set(s * .25, type === 'brute' ? 4 : 2.1, type === 'brute' ? 1.15 : .42); g.add(e); }
  scene.add(g); return g;
}
const enemies = [];
// telegraph decals (pooled)
const decals = [];
function decal(p, r, life) { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0xff1450, transparent: true, opacity: .3, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(p.x, .36, p.z); m.scale.setScalar(r); scene.add(m);
  const rim = new THREE.Mesh(new THREE.RingGeometry(.92, 1, 40), glow(0xff2a5a)); m.add(rim); decals.push({ m, t: 0, life }); return m; }

// ===== gems (glowing yellow XP) =====
const MAXG = 500, gemIM = new THREE.InstancedMesh(new THREE.OctahedronGeometry(.53, 0), new THREE.MeshBasicMaterial({ color: 0xffe14a }), MAXG);
gemIM.count = 0; gemIM.frustumCulled = false; scene.add(gemIM);
const gemGlow = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 3.6, map: dot, color: SKY, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
const gemGlowPos = new Float32Array(MAXG * 3); gemGlow.geometry.setAttribute('position', new THREE.BufferAttribute(gemGlowPos, 3)); gemGlow.frustumCulled = false; scene.add(gemGlow);
const gems = [];

// ===== shield bubble =====
const shield = new THREE.Mesh(new THREE.SphereGeometry(3.2, 24, 16), new THREE.MeshBasicMaterial({ color: 0x3ef2ff, transparent: true, opacity: .22, blending: THREE.AdditiveBlending, depthWrite: false }));
const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(3.2, .3, 6, 48), glow(0xffc83d)); shieldRim.rotation.x = Math.PI / 2; shieldRim.material.opacity = 1; shieldRim.position.y = -1.6; shield.add(shieldRim);
shield.visible = false; scene.add(shield);

// ===== 2D overlay: thin red HP bars + bouncy white damage numbers =====
const ov = document.createElement('canvas'); Object.assign(ov.style, { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 6 }); document.body.insertBefore(ov, document.getElementById('fade'));
const ox = ov.getContext('2d'); let DPR = 1;
const nums = [];
const proj = new THREE.Vector3();
function toScreen(p, y) { proj.set(p.x, y, p.z).project(cam); return [(proj.x + 1) / 2 * innerWidth, (1 - proj.y) / 2 * innerHeight]; }
function floatTxt(p, t, big = false, col = '#fff') { const v = +t;
  if (!isNaN(v) && col !== '#ff4a5a') { let best = null, bd = 1e9; // merge nearby fresh hits; hard cap 8 visible
    for (const n of nums) if (n.v != null) { const d = Math.hypot(n.x - p.x, n.z - p.z); if ((d < 3.5 && n.t < .35 || nums.length >= 8) && d < bd) { bd = d; best = n; } }
    if (best) { best.v += v; best.txt = String(best.v); best.big = best.big || big || best.v >= 60; if (big) best.col = col; best.t = Math.min(best.t, .05); return; } }
  nums.push({ v: isNaN(v) || col === '#ff4a5a' ? null : v, x: p.x, z: p.z, y: 3, t: 0, txt: t, vx: (Math.random() - .5) * 60, vy: -220 - Math.random() * 80, big, col }); if (nums.length > 160) nums.shift(); }
function drawOverlay(dt) {
  const w = innerWidth, h = innerHeight; if (ov.width !== w * DPR) { DPR = Math.min(devicePixelRatio, 2); ov.width = w * DPR; ov.height = h * DPR; }
  ox.setTransform(DPR, 0, 0, DPR, 0, 0); ox.clearRect(0, 0, w, h); if (S.mode !== 'play' && S.mode !== 'end') return;
  for (const e of enemies) { if (e.hp >= e.T.hp) continue; const [sx, sy] = toScreen(e.pos, e.type === 'brute' ? 7 : 3.2), bw = e.type === 'brute' ? 70 : 30;
    ox.fillStyle = 'rgba(0,0,0,.7)'; ox.fillRect(sx - bw / 2 - 1, sy - 1, bw + 2, 5); ox.fillStyle = '#ff2a3a'; ox.fillRect(sx - bw / 2, sy, bw * Math.max(0, e.hp / e.T.hp), 3); }
  ox.textAlign = 'center'; ox.lineJoin = 'round';
  for (let i = nums.length - 1; i >= 0; i--) { const n = nums[i]; n.t += dt; if (n.t > .9) { nums.splice(i, 1); continue; }
    n.vy += 900 * dt; const [sx, sy] = toScreen(n, n.y); n.ox = (n.ox || 0) + n.vx * dt; n.oy = Math.min((n.oy || 0) + n.vy * dt, 10);
    const pop = n.t < .08 ? 1 + (.08 - n.t) * 10 : 1, a = n.t > .6 ? (.9 - n.t) / .3 : 1;
    ox.globalAlpha = a; ox.font = `900 ${(n.big ? 45 : 30) * pop}px system-ui`; ox.lineWidth = 7; ox.strokeStyle = '#05060a'; ox.strokeText(n.txt, sx + n.ox, sy + n.oy); ox.fillStyle = n.col; ox.fillText(n.txt, sx + n.ox, sy + n.oy); }
  ox.globalAlpha = 1;
}

// ===== state =====
const S = { mode: 'title', t: 0, yaw: 0, hp: 100, en: 40, score: 0, kills: 0, xp: 0, wave: 0, iframes: 0, dodge: 0, buff: 0, cd: { wave: 0, chain: 0, roar: 0, dodge: 0 }, shake: 0, swing: 0, spawnQ: [], spawnT: 0, waveNext: 0 };
const CD = { wave: .28, chain: 3, roar: 6, dodge: 1 };
const COST = { chain: 15, roar: 30 };
const rep = (t, n) => Array(n).fill(t);
const mix = w => w.sort(() => Math.random() - .5);
// Mission 01 is cut into 3 sectioned levels on the Ember Dot island; each has its own tint, objective and wave plan
const SECTIONS = [
  { name: 'SHORE LANDING', obj: 'Clear the beach', floor: 0xc9ad84, edge: 0xffd08a, line: 'Warden: "Those are crabs. Ugly. Easy. Hit them."',
    waves: () => [mix(rep('crab', 24)), mix([...rep('crab', 30), ...rep('wick', 10)])] },
  { name: 'TOWER RIDGE', obj: 'Restore Signal Tower 1', floor: 0x3e7680, edge: 0x4DB8FF, hold: 15, line: 'Warden: "Stand in the ring. Keep the Tower breathing."',
    waves: () => [mix([...rep('crab', 36), ...rep('wick', 14)]), mix([...rep('crab', 44), ...rep('wick', 22)])] },
  { name: 'CRATER GATE', obj: 'Defeat the Red Candle Brute', floor: 0x9a3a1a, edge: 0xff1a1a, line: 'Brute: "…LIQUIDATE…"',
    waves: () => [mix([...rep('crab', 30), ...rep('wick', 20)]), ['brute', ...mix([...rep('crab', 40), ...rep('wick', 16)])]] },
];
let WAVES = [];
const keys = {}, joy = { x: 0, y: 0 };
const banner = (t, c = '#fff') => { const b = $('#banner'); b.textContent = t; b.style.color = c; b.style.opacity = 1; clearTimeout(banner.h); banner.h = setTimeout(() => b.style.opacity = 0, 1400); };
const fade = (on) => $('#fade').style.opacity = on ? 1 : 0;
const show = (id, on) => $(id).classList.toggle('hide', !on);
const BG_DAY = new THREE.Color(0xffc49a), BG_DARK = new THREE.Color(0x0a0c12);
function setArena(on) { arena.visible = on; decor.forEach(o => o.visible = !on); ocean.visible = !on; scene.background = on ? BG_DARK : BG_DAY; scene.fog.color.set(on ? 0x0a0c12 : 0xffd2a8); scene.fog.near = on ? 60 : 90; scene.fog.far = on ? 140 : 320; sky.visible = !on; }

function clearField() { enemies.forEach(e => e.mesh && scene.remove(e.mesh)); enemies.length = 0; gems.length = 0; nums.length = 0; decals.forEach(d => scene.remove(d.m)); decals.length = 0; }
function startCine() {
  $('#title').classList.remove('on'); show('#title', false); show('#cine', true); show('#hud', false); show('#end', false);
  S.mode = 'cine'; S.t = 0; boat.visible = true; boat.position.set(0, 0, 230); boat.rotation.y = Math.PI; setArena(false); clearField(); shield.visible = false;
  boat.add(zayn); zayn.position.set(0, .9, -1); zayn.rotation.y = 0;
}
function landOnBeach() {
  if (S.mode !== 'cine') return; S.mode = 'fading'; fade(1);
  setTimeout(() => {
    boat.visible = false; boat.remove(zayn); scene.add(zayn); zayn.position.set(0, .3, 0); S.yaw = Math.PI; setArena(true);
    Object.assign(S, { hp: 100, en: 40, score: 0, kills: 0, xp: 0, wave: 0, iframes: 0, buff: 0, spawnQ: [], waveNext: 0, cd: { wave: 0, chain: 0, roar: 0, dodge: 0 } });
    cam.position.set(0, 30, 22); show('#cine', false); show('#hud', true);
    startSection(0, true);
  }, 1000);
}
function secHud() { const c = SECTIONS[S.sec]; $('#secName').textContent = `${S.sec + 1}/${SECTIONS.length} · ${c.name}`;
  $('#secDots').innerHTML = SECTIONS.map((_, i) => `<i class="${i < S.sec ? 'done' : i === S.sec ? 'cur' : ''}"></i>`).join('');
  $('#obj').textContent = c.hold ? `${c.obj} — hold the ring ${Math.min(c.hold, S.hold).toFixed(0)}/${c.hold}s · wave ${S.wave}/${WAVES.length}` : `${c.obj} — wave ${S.wave}/${WAVES.length}`; }
function startSection(i, fromBoat = false) { // entering a section: (fade already black) reset field, tint ground, fade in, banner card
  const c = SECTIONS[i]; clearField(); waves.length = 0; S.sec = i; S.wave = 0; S.hold = 0; S.spawnQ = []; S.waveNext = 0; S.secDone = false; WAVES = c.waves();
  S.hp = 100; S.iframes = 1.5; S.buff = 0; S.cd = { wave: 0, chain: 0, roar: 0, dodge: 0 }; if (fromBoat) Object.assign(S, { en: 40, score: 0, kills: 0, xp: 0 }); else S.en = Math.max(S.en, 40);
  floorM.color.set(c.floor); edgeM.color.set(c.edge); tower.visible = !!c.hold; zayn.position.set(0, .3, c.hold ? 3 : 0); S.secStart = { score: S.score, kills: S.kills, xp: S.xp }; secHud();
  setTimeout(() => { fade(0); S.mode = 'play'; banner(fromBoat ? 'MISSION 01 · EMBER DOT' : `SECTION ${i + 1} · ${c.name}`, '#4DB8FF');
    setTimeout(() => { if (S.sec === i && S.mode === 'play') { banner(c.name, '#ffc83d'); $('#line').textContent = c.line; $('#line').style.opacity = 1; setTimeout(() => $('#line').style.opacity = 0, 3200); } }, 1500);
    setTimeout(() => { if (S.sec === i && S.mode === 'play' && !S.wave) nextWave(); }, 2600); }, 600); }
function sectionClear() { if (S.secDone) return; S.secDone = true;
  if (S.sec >= SECTIONS.length - 1) return win();
  S.mode = 'clear'; banner(`${SECTIONS[S.sec].name} CLEARED`, '#4DB8FF'); ring(zayn.position, SKY, 30, .8, .3, .06);
  setTimeout(() => { fade(1); S.mode = 'clear'; setTimeout(() => startSection(S.sec + 1), 900); }, 1800); }
window.__section = i => { fade(1); S.mode = 'clear'; setTimeout(() => startSection(i), 50); };
function nextWave() {
  if (S.wave >= WAVES.length) return;
  S.spawnQ = [...WAVES[S.wave]]; S.wave++; secHud();
  banner(`WAVE ${S.wave} · ${S.spawnQ.length} STATIC`, '#ff3cac');
}
function spawn(type, ang) { const T = TYPES[type], a = ang ?? Math.random() * 6.28, r = ARENA + 2;
  const e = { type, T, pos: new THREE.Vector3(zayn.position.x + Math.cos(a) * 30, 0, zayn.position.z + Math.sin(a) * 30), hp: T.hp, stun: 0, kb: new THREE.Vector3(), atk: 0, hit: 0, tel: 0, yaw: 0, mesh: type === 'crab' ? null : makeMesh(type) };
  const l = Math.hypot(e.pos.x, e.pos.z); if (l > r) e.pos.multiplyScalar(r / l);
  if (type === 'brute') { e.mesh.scale.setScalar(1.15); banner('RED CANDLE BRUTE', '#ff2a5a'); }
  enemies.push(e); burst(e.pos.clone().setY(1), [0xff1450, 0xa24cff], 10, 5, 4);
}
function win() { S.mode = 'end'; setTimeout(() => { show('#retry', false); tower.visible = false; $('#endT').textContent = 'MISSION COMPLETE'; $('#endT').style.color = '#4DB8FF'; $('#endS').textContent = `Ember Dot secured · ${S.kills} Static cleared · ${S.xp} gems · score ${S.score}. Next: Moonleaf Oval.`; show('#end', true); }, 900); }
function lose() { S.mode = 'end'; banner('LIQUIDATED', '#ff2a5a'); setTimeout(() => { $('#endT').textContent = 'LIQUIDATED'; $('#endT').style.color = '#ff2a5a'; $('#endS').textContent = `Zayn went down in ${SECTIONS[S.sec].name} · ${S.kills} kills · score ${S.score}. Retry the section or run the mission back.`; show('#retry', true); show('#end', true); }, 1200); }

const aimDir = () => new THREE.Vector3(Math.sin(S.yaw), 0, Math.cos(S.yaw));
function boom(p, col, r, dmg, kb = 10) { // AoE explosion: flash + rings + sparks + damage
  const q = p.clone().setY(1); flash(q, col, r * .8, .28); flash(q, 0xffffff, r * .35, .15); ring(p, col, r * 1.1, .4, .5); burst(q, [col, 0xffffff, 0xffc83d], 26 + r * 4, r * 2.2, 6);
  for (const e of [...enemies]) { const d = e.pos.clone().sub(p).setY(0), l = d.length(); if (l < r + e.T.r) damage(e, dmg * (l < r * .4 ? 1.5 : 1), d.normalize().multiplyScalar(kb)); }
}
function damage(e, d, kbv) {
  if (e.hp <= 0) return; d = Math.round(d * (S.buff > 0 ? 1.5 : 1) * (.85 + Math.random() * .3)); const crit = Math.random() < .12; if (crit) d *= 2;
  e.hp -= d; e.hit = .1; if (kbv) e.kb.add(kbv); S.score += d;
  floatTxt(e.pos, String(d), crit, crit ? '#ffe14a' : '#fff');
  if (e.hp <= 0) kill(e);
}
function kill(e) { const i = enemies.indexOf(e); if (i < 0) return; enemies.splice(i, 1); if (e.mesh) scene.remove(e.mesh);
  const p = e.pos.clone().setY(1.2), big = e.type === 'brute';
  burst(p, [0xff1450, 0xff5a8a, 0xffffff, 0xffc83d], big ? 160 : (S.quiet ? 6 : 28), big ? 20 : 11, big ? 12 : 7); flash(p, 0xff3c6e, big ? 9 : 2.6, .22); if (big) { ring(e.pos, 0xff2a5a, 16, .6); S.shake = .6; }
  for (let k = 0; k < e.T.xp; k++) if (gems.length < MAXG) gems.push({ p: e.pos.clone().add(new THREE.Vector3((Math.random() - .5) * (big ? 4 : .6), .9, (Math.random() - .5) * (big ? 4 : .6))), v: 0, t: Math.random() * 6 });
  S.kills++; S.score += big ? 1000 : 50; S.en = Math.min(100, S.en + (big ? 20 : 1.5)); S.shake = Math.max(S.shake, .12); }
const waves = [], ropes = [];
const act = {
  wave() { S.swing = .2; const f = aimDir(), m = new THREE.Mesh(new THREE.TorusGeometry(2.4, .45, 6, 24, Math.PI), glow(0x5ff8ff)); m.add(new THREE.Mesh(new THREE.TorusGeometry(2.1, .18, 4, 24, Math.PI), glow(0xffffff)));
    m.position.copy(zayn.position).add(f.clone().multiplyScalar(2)).setY(1.4); m.rotation.set(Math.PI / 2, 0, -S.yaw + Math.PI); scene.add(m);
    waves.push({ m, v: f.multiplyScalar(36), life: .55, hits: new Set() }); flash(m.position, 0x5ff8ff, 2, .15); },
  chain() { const f = aimDir(); let best = null, bd = 24;
    for (const e of enemies) { const d = e.pos.clone().sub(zayn.position).setY(0), l = d.length(); if (l < bd && d.normalize().dot(f) > .2) { bd = l; best = e; } }
    const end = best ? best.pos.clone() : zayn.position.clone().add(f.multiplyScalar(16)); end.y = 0;
    const st = zayn.position.clone().setY(2.4), len = st.distanceTo(end.clone().setY(1.5));
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, len, 6), M(0xffd44d, 2, { transparent: true })); rope.position.copy(st).lerp(end.clone().setY(1.5), .5); rope.lookAt(end.clone().setY(1.5)); rope.rotateX(Math.PI / 2); scene.add(rope); ropes.push({ m: rope, t: .4 });
    boom(end, 0xffc83d, 7, 40, 14); ring(end, 0xff8a1e, 10, .5, 1.2);
    S.shake = .4; banner('GOLD CHAIN!', '#ffc83d'); },
  roar() { const p = zayn.position.clone(); ring(p, 0xffc83d, 16, .45, .3, .05); ring(p, SKY, 12, .3, .3, .04); flash(p.clone().setY(2), 0xffffff, 3, .12);
    burst(p.clone().setY(1), [0xffc83d, SKY], 50, 22, 4); S.quiet = true;
    for (const e of [...enemies]) { const d = e.pos.clone().sub(p).setY(0); if (d.length() < 15) { e.stun = 2; damage(e, 30, d.normalize().multiplyScalar(22)); } } S.quiet = false;
    S.buff = 5; S.shake = .8; banner('ROAR · SHIELD UP!', '#3ef2ff'); },
  dodge() { S.dodge = .2; S.iframes = .5; ring(zayn.position, 0x3ef2ff, 4, .3); },
};
function use(p) { if (S.mode !== 'play' || S.cd[p] > 0) return; if (COST[p] && S.en < COST[p]) { banner('NEED FLOW ENERGY', '#9df'); return; }
  S.en -= COST[p] || 0; S.cd[p] = CD[p]; act[p](); }

// ===== input: WASD/stick move, mouse aims, auto-fire at nearest when no mouse =====
addEventListener('keydown', e => { keys[e.code] = true; const m = { KeyQ: 'wave', KeyE: 'chain', KeyR: 'roar', Space: 'dodge' }[e.code]; if (m) { use(m); e.preventDefault(); } if (S.mode === 'cine' && (e.code === 'Enter' || e.code === 'Escape')) landOnBeach(); });
addEventListener('keyup', e => keys[e.code] = false);
document.querySelectorAll('.p').forEach(b => b.addEventListener('pointerdown', e => { e.stopPropagation(); use(b.dataset.p); }));
const mouse = { x: 0, y: 0, on: false, down: false, ray: new THREE.Raycaster(), plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit: new THREE.Vector3() };
$('#c').addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0) mouse.down = true; });
addEventListener('pointerup', () => mouse.down = false);
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mouse.on = true; mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight) * 2 + 1; } });
{ const st = $('#stick'), kn = $('#knob'); let id = null;
  const mv = e => { const r = st.getBoundingClientRect(); let x = e.clientX - r.left - 65, y = e.clientY - r.top - 65; const l = Math.hypot(x, y); if (l > 50) { x *= 50 / l; y *= 50 / l; } joy.x = x / 50; joy.y = y / 50; kn.style.transform = `translate(${x}px,${y}px)`; };
  st.addEventListener('pointerdown', e => { id = e.pointerId; st.setPointerCapture(id); mv(e); e.stopPropagation(); });
  st.addEventListener('pointermove', e => e.pointerId === id && mv(e));
  st.addEventListener('pointerup', () => { id = null; joy.x = joy.y = 0; kn.style.transform = ''; }); }
$('.card.pick').onclick = () => { fade(1); setTimeout(() => { startCine(); fade(0); }, 600); };
$('#skip').onclick = landOnBeach;
$('#retry').onclick = () => { show('#end', false); fade(1); S.mode = 'clear'; const s0 = S.secStart; setTimeout(() => { Object.assign(S, s0); startSection(S.sec); }, 600); };
$('#again').onclick = () => { show('#end', false); fade(1); setTimeout(() => { startCine(); fade(0); }, 600); };
$('#menu').onclick = () => { show('#end', false); show('#hud', false); show('#title', true); S.mode = 'title'; setArena(false); clearField(); };

// ===== loop =====
let last = performance.now();
const v3 = new THREE.Vector3(), o3 = new THREE.Object3D(), ISO = new THREE.Vector3(0, 40, 28);
function nearest(maxD) { let b = null, bd = maxD; for (const e of enemies) { const d = Math.hypot(e.pos.x - zayn.position.x, e.pos.z - zayn.position.z); if (d < bd) { bd = d; b = e; } } return b; }
function tick(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt; U.uTime.value = S.t;
  if (!arena.visible) { const a = oceanG.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) a[i + 1] = Math.sin(oBase[i] * .08 + S.t * 1.4) * .35 + Math.cos(oBase[i + 2] * .07 + S.t) * .35;
    oceanG.attributes.position.needsUpdate = true; }
  pylons.forEach((p, i) => { p.rotation.y += dt * 2; p.position.y = 8.5 + Math.sin(S.t * 2 + i) * .4; });

  if (S.mode === 'title') { const r = 70; cam.fov = 60; cam.updateProjectionMatrix(); cam.position.set(Math.cos(S.t * .1) * r, 22, Math.sin(S.t * .1) * r); cam.lookAt(0, 3, 0); }
  else if (S.mode === 'cine' || S.mode === 'fading') {
    const k = Math.min(1, S.t / 13); boat.position.z = 230 - k * 190; boat.position.y = Math.sin(S.t * 6) * .25; boat.rotation.z = Math.sin(S.t * 2) * .06; boat.rotation.x = -.06;
    burst(new THREE.Vector3(boat.position.x + (Math.random() - .5) * 3, .3, boat.position.z + 5), [0xffffff, 0xbff6ff], 6, 3, 2.5, 8);
    $('#cineSub').textContent = `Ember Dot · ${Math.max(0, (boat.position.z - 34) / 500).toFixed(2)} km`;
    const sw = Math.sin(S.t * .35) * 6;
    cam.position.set(boat.position.x + sw, 6 + Math.sin(S.t) * .4, boat.position.z + 14); cam.lookAt(boat.position.x, 3, boat.position.z - 20);
    if (S.t > 13.5) landOnBeach();
  } else {
    if (S.mode === 'play') {
      // omnidirectional, screen-relative movement (camera never rotates)
      const ix = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + joy.x, iz = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0) + joy.y;
      const mv = new THREE.Vector3(ix, 0, iz), ml = Math.min(1, mv.length()); if (ml > .1) mv.normalize();
      // aim: mouse on ground, else nearest enemy, else move dir
      let tgt = null;
      if (mouse.on) { mouse.ray.setFromCamera({ x: mouse.x, y: mouse.y }, cam); if (mouse.ray.ray.intersectPlane(mouse.plane, mouse.hit)) tgt = mouse.hit; }
      else { const n = nearest(26); if (n) tgt = n.pos; }
      if (tgt) S.yaw = Math.atan2(tgt.x - zayn.position.x, tgt.z - zayn.position.z); else if (ml > .1) S.yaw = Math.atan2(mv.x, mv.z);
      let sp = 12 * ml; if (S.dodge > 0) { sp = 44; S.dodge -= dt; if (ml < .1) mv.copy(aimDir()); burst(zayn.position.clone().setY(1.5), [0x3ef2ff, 0xffffff], 5, 2, 1, 0); }
      zayn.position.add(mv.multiplyScalar(sp * dt)); zayn.position.y = .3; const pl = Math.hypot(zayn.position.x, zayn.position.z); if (pl > ARENA) { zayn.position.x *= ARENA / pl; zayn.position.z *= ARENA / pl; }
      let dy = S.yaw - zayn.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); zayn.rotation.y += dy * Math.min(1, dt * 18);
      const ud = zayn.userData, w = ml > .1 ? Math.sin(S.t * 14) * .6 : 0; ud.legL.rotation.x = w; ud.legR.rotation.x = -w; ud.tail.rotation.z = Math.sin(S.t * 3) * .25; ud.core.rotation.y += dt * 3; tower.userData.core.rotation.y += dt * 1.5;
      S.swing = Math.max(0, S.swing - dt); ud.armR.rotation.x = S.swing > 0 ? -2.2 + (.2 - S.swing) * 16 : -.2 + w * .3;
      for (const k in S.cd) S.cd[k] = Math.max(0, S.cd[k] - dt); S.iframes -= dt; S.buff -= dt; S.en = Math.min(100, S.en + dt * 3);
      // auto-fire WAVE (kite + shoot); mouse hold / Q also fires
      if (mouse.down || (!mouse.on && nearest(24)) || (mouse.on && nearest(26))) use('wave');
      if (S.spawnQ.length) { S.spawnT -= dt; if (S.spawnT <= 0) { const a = Math.random() * 6.28, n = Math.min(S.spawnQ.length, 4 + S.wave * 2); for (let k = 0; k < n; k++) spawn(S.spawnQ.shift(), a + (Math.random() - .5) * .9); S.spawnT = 1.4 - S.wave * .2; } }
      else if (S.wave && S.wave >= WAVES.length) { const c = SECTIONS[S.sec];
        if (c.hold && S.hold < c.hold) { if (enemies.length < 10) S.spawnQ.push(...rep('crab', 8)); } // keep pressure until the tower is restored
        else if (!enemies.length) { S.waveNext += dt; if (S.waveNext > 1) sectionClear(); } }
      else if (!enemies.length && S.wave) { S.waveNext += dt; if (S.waveNext > 1.5) { S.waveNext = 0; nextWave(); } }
      { const c = SECTIONS[S.sec]; if (c.hold && S.hold < c.hold) { if (Math.hypot(zayn.position.x - tower.position.x, zayn.position.z - tower.position.z) < 5) { S.hold += dt; if (S.hold >= c.hold) { banner('TOWER 1 RESTORED', '#4DB8FF'); ring(tower.position, SKY, 40, 1, .4, .08); } } if ((S.t * 4 | 0) !== (S.lt | 0)) { S.lt = S.t * 4; secHud(); } } }
    }
    // enemies: swarm toward player with simple separation
    const zp = zayn.position;
    for (let i = 0; i < enemies.length; i++) { const e = enemies[i]; v3.set(zp.x - e.pos.x, 0, zp.z - e.pos.z); const d = v3.length();
      if (e.stun > 0) e.stun -= dt;
      else if (S.mode === 'play') {
        e.yaw = Math.atan2(v3.x, v3.z);
        if (e.type === 'brute') { // telegraphed slam: red pulse + ground decal
          if (e.tel > 0) { e.tel -= dt; if (e.tel <= 0) { boom(e.decal.position, 0xff1450, 0, 0); ring(e.decal.position, 0xff2a5a, 7, .35); S.shake = .5;
              if (Math.hypot(zp.x - e.decal.position.x, zp.z - e.decal.position.z) < 5.5) hurt(e.T.dmg); scene.remove(e.decal); e.atk = 1.6; } }
          else { e.atk -= dt; if (d < 8 && e.atk <= 0) { e.tel = .9; e.decal = decal(zp, 5.5, .9); } else if (d > 3) e.pos.addScaledVector(v3.normalize(), e.T.sp * dt); }
        } else { if (d > e.T.r + 1.1) e.pos.addScaledVector(v3.normalize(), e.T.sp * dt);
          e.atk -= dt; if (d < e.T.r + 1.6 && e.atk <= 0) { e.atk = 1.1; hurt(e.T.dmg); } } }
      // separation (cheap: check few neighbours)
      for (let k = 1; k <= 3; k++) { const o = enemies[(i + k * 7) % enemies.length]; if (o === e) continue; const dx = e.pos.x - o.pos.x, dz = e.pos.z - o.pos.z, dd = dx * dx + dz * dz, rr = (e.T.r + o.T.r) * 1.1; if (dd < rr * rr && dd > 1e-4) { const s = (rr - Math.sqrt(dd)) * .5 / Math.sqrt(dd); e.pos.x += dx * s; e.pos.z += dz * s; } }
      e.pos.addScaledVector(e.kb, dt); e.kb.multiplyScalar(Math.pow(.02, dt)); e.hit -= dt;
      if (e.mesh) { const pulse = e.tel > 0 ? 1 + Math.sin(S.t * 40) * .08 : 1; e.mesh.position.set(e.pos.x, e.type === 'wick' ? Math.abs(Math.sin(S.t * 12 + i)) * .5 : 0, e.pos.z); e.mesh.rotation.y = e.yaw + (e.stun > 0 ? S.t * 8 : 0); e.mesh.scale.setScalar((e.type === 'brute' ? 1.15 : 1) * (e.hit > 0 ? 1.25 : pulse)); } }
    // write crab instances
    let c = 0;
    for (const e of enemies) { if (e.type !== 'crab') continue; const s = e.hit > 0 ? 1.3 : 1, bob = Math.abs(Math.sin(S.t * 14 + c)) * .15;
      o3.position.set(e.pos.x, .8 + bob, e.pos.z); o3.rotation.set(0, e.yaw + (e.stun > 0 ? S.t * 8 : 0), 0); o3.scale.setScalar(s); o3.updateMatrix(); crabBody.setMatrixAt(c, o3.matrix); crabBody.setColorAt(c, e.hit > 0 ? HIT_COL : STATIC_COL);
      for (const sx of [-1, 1]) { o3.position.set(e.pos.x + Math.cos(e.yaw) * sx * 1.2, .9, e.pos.z - Math.sin(e.yaw) * sx * 1.2); o3.position.addScaledVector(v3.set(Math.sin(e.yaw), 0, Math.cos(e.yaw)), .6 + Math.sin(S.t * 10 + c) * .2); o3.updateMatrix();
        const j = c * 2 + (sx > 0 ? 1 : 0); crabClaw.setMatrixAt(j, o3.matrix); crabClaw.setColorAt(j, STATIC_COL);
        o3.position.set(e.pos.x + Math.cos(e.yaw) * sx * .3 + Math.sin(e.yaw) * .85, 1.25 + bob, e.pos.z - Math.sin(e.yaw) * sx * .3 + Math.cos(e.yaw) * .85); o3.scale.setScalar(1); o3.updateMatrix(); crabEyes.setMatrixAt(j, o3.matrix); }
      c++; }
    crabBody.count = c; crabClaw.count = crabEyes.count = c * 2;
    for (const im of [crabBody, crabClaw, crabEyes]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; }
    // wave projectiles: pierce + mini explosion on hit
    for (let i = waves.length - 1; i >= 0; i--) { const w = waves[i]; w.life -= dt; w.m.position.addScaledVector(w.v, dt); w.m.material.opacity = Math.min(1, w.life * 3);
      burst(w.m.position, [SKY, 0x9ff6ff], 3, 2, 1, 0);
      for (const e of enemies) if (!w.hits.has(e) && Math.hypot(e.pos.x - w.m.position.x, e.pos.z - w.m.position.z) < e.T.r + 2.2) { w.hits.add(e); const p = e.pos.clone(); damage(e, 11, w.v.clone().normalize().multiplyScalar(8)); burst(p.setY(1.2), [0x5ff8ff, 0xffffff], 10, 7, 4); flash(p, 0x5ff8ff, 1.6, .12); if (w.hits.size >= 5) w.life = 0; }
      if (w.life <= 0) { boom(w.m.position.clone().setY(0), 0x3ad8ff, 3, 6, 6); scene.remove(w.m); waves.splice(i, 1); } }
    for (let i = ropes.length - 1; i >= 0; i--) { const r = ropes[i]; r.t -= dt; r.m.material.opacity = r.t * 2.5; if (r.t <= 0) { scene.remove(r.m); ropes.splice(i, 1); } }
    for (let i = decals.length - 1; i >= 0; i--) { const d = decals[i]; d.t += dt; d.m.material.opacity = .15 + .3 * Math.abs(Math.sin(d.t * 18)); if (d.t > d.life) decals.splice(i, 1); }
    // gems: bob, magnet, collect
    let g = 0;
    for (let i = gems.length - 1; i >= 0; i--) { const gm = gems[i]; gm.t += dt; const dx = zp.x - gm.p.x, dz = zp.z - gm.p.z, d = Math.hypot(dx, dz);
      if (d < 7 || gm.v) { gm.v = Math.min(40, (gm.v || 8) + dt * 60); gm.p.x += dx / d * gm.v * dt; gm.p.z += dz / d * gm.v * dt; }
      if (d < 1.4 && S.mode === 'play') { gems.splice(i, 1); S.xp++; S.score += 10; S.en = Math.min(100, S.en + 1.2); continue; } }
    for (const gm of gems) { o3.position.set(gm.p.x, .9 + Math.sin(gm.t * 4) * .2, gm.p.z); o3.rotation.set(0, gm.t * 3, 0); o3.scale.setScalar(1); o3.updateMatrix(); gemIM.setMatrixAt(g, o3.matrix); gemGlowPos[g * 3] = o3.position.x; gemGlowPos[g * 3 + 1] = o3.position.y; gemGlowPos[g * 3 + 2] = o3.position.z; g++; }
    gemIM.count = g; gemIM.instanceMatrix.needsUpdate = true; gemGlow.geometry.setDrawRange(0, g); gemGlow.material.opacity = .65 + Math.sin(S.t * 6) * .3; gemGlow.geometry.attributes.position.needsUpdate = true;
    // shield bubble (dodge i-frames / ROAR buff)
    const sh = S.iframes > 0 || S.buff > 0; shield.visible = sh && S.mode === 'play'; if (sh) { shield.position.set(zp.x, 2.4, zp.z); shield.scale.setScalar(1 + Math.sin(S.t * 10) * .04); shield.material.opacity = S.iframes > 0 ? .35 : .2; shieldRim.rotation.z += dt * 2; }
    // fixed isometric follow camera
    const narrow = cam.aspect < 1; if (cam.fov !== (narrow ? 55 : 42)) { cam.fov = narrow ? 55 : 42; cam.updateProjectionMatrix(); }
    v3.copy(zp).add(ISO); cam.position.lerp(v3, Math.min(1, dt * 6)); S.shake = Math.max(0, S.shake - dt);
    if (S.shake) cam.position.add(new THREE.Vector3((Math.random() - .5), 0, (Math.random() - .5)).multiplyScalar(S.shake * 1.6));
    cam.lookAt(cam.position.x - ISO.x, zp.y, cam.position.z - ISO.z);
    $('#hpF').style.width = S.hp + '%'; $('#enF').style.width = S.en + '%'; $('#score').textContent = `${S.score}  ·  ◆ ${S.xp}  ·  ☠ ${S.kills}`;
    document.querySelectorAll('.p').forEach(b => { const p = b.dataset.p; b.querySelector('em').style.transform = `scaleY(${S.cd[p] / CD[p]})`; b.style.opacity = COST[p] && S.en < COST[p] ? .5 : 1; });
  }
  stepParticles(dt); stepFx(dt); drawOverlay(dt);
  R.render(scene, cam); requestAnimationFrame(tick);
}
function hurt(d) { if (S.iframes > 0 || S.mode !== 'play') return; S.hp -= S.buff > 0 ? d * .4 : d; S.shake = Math.max(S.shake, .25); burst(zayn.position.clone().setY(2), [0xff2a5a, 0xffffff], 18, 7, 5); floatTxt(zayn.position, '-' + d, false, '#ff4a5a'); if (S.hp <= 0) { S.hp = 0; lose(); } }
requestAnimationFrame(tick);
window.__spawn = spawn; window.__S = S; window.__use = use; window.__enemies = enemies;

// ===== theme music (HTMLAudioElement, starts on first gesture) =====
const music = new Audio('assets/audio/theme.mp3'); music.loop = true; music.preload = 'auto';
let muted = localStorage.getItem('sw_muted') === '1', musicVol = .55;
const muteBtn = document.getElementById('mute');
function applyMusic() { music.volume = muted ? 0 : musicVol; music.muted = muted; muteBtn.textContent = muted ? '🔇' : '♪'; muteBtn.classList.toggle('off', muted); if (!muted) music.play().catch(() => {}); }
function setDuck(on) { musicVol = on ? .3 : .55; if (!muted) music.volume = musicVol; }
muteBtn.addEventListener('pointerdown', e => e.stopPropagation());
muteBtn.onclick = e => { e.stopPropagation(); muted = !muted; localStorage.setItem('sw_muted', muted ? '1' : '0'); applyMusic(); };
addEventListener('keydown', e => { if (e.code === 'KeyM') muteBtn.click(); });
const unlock = () => { if (!muted) music.play().catch(() => {}); };
['pointerdown', 'keydown', 'touchstart'].forEach(t => addEventListener(t, unlock, { once: true, capture: true }));
applyMusic();
setInterval(() => setDuck(S.mode === 'cine'), 250);
