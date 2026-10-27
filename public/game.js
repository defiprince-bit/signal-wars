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
{ const g = new THREE.SphereGeometry(1200, 32, 16), col = [];
  const p = g.attributes.position, top = new THREE.Color(0x2a8cff), hor = new THREE.Color(0xff9a5a), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { c.copy(hor).lerp(top, Math.min(1, Math.max(0, p.getY(i) / 1200) * 2.2)); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }))); }
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
function ring(p, col, max = 10, life = .5, y = .3) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .25, 8, 48), glow(col)); m.rotation.x = Math.PI / 2; m.position.set(p.x, y, p.z); scene.add(m); fx.push({ m, t: 0, life, max }); }
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
  const mkEar = sx => { const e = new THREE.Mesh(new THREE.ConeGeometry(.24, .38, 6), M(0x1a120c)); e.position.set(sx * .5, 4.5, -.05); e.rotation.z = -sx * .35;
    const w = new THREE.Mesh(new THREE.CircleGeometry(.11, 8), M(0xffffff)); w.position.set(0, -.02, -.2); w.rotation.y = Math.PI; e.add(w); return e; };
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(.34, 12, 8), M(0xfff1dc, 0, { roughness: 1 })); muzzle.position.set(0, 3.62, .58); muzzle.scale.set(1.1, .7, .7);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 6), M(0x2a1410)); nose.position.set(0, 3.74, .82);
  // Wayfarers: two trapezoid lenses + bar, wraps sides so it reads from behind
  const lensM = M(0x050507, 0, { metalness: 1, roughness: .08 }), shades = new THREE.Group();
  for (const sx of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(.48, .26, .08), lensM); l.position.set(sx * .3, 0, 0); l.rotation.y = sx * .18; shades.add(l);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.05, .07, .7), lensM); arm.position.set(sx * .66, .05, -.35); shades.add(arm); }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.2, .07, .09), gold); bar.position.y = .12; shades.add(bar); shades.position.set(0, 3.98, .66);
  // gold cuban chain (instanced links)
  const N = 22, chain = new THREE.InstancedMesh(new THREE.TorusGeometry(.085, .035, 5, 10), gold, N), o = new THREE.Object3D();
  for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2; o.position.set(Math.sin(a) * .62, 3.2 - Math.max(0, Math.cos(a)) * .32, Math.cos(a) * .55); o.rotation.set(0, a, i % 2 ? Math.PI / 2 : 0); o.updateMatrix(); chain.setMatrixAt(i, o.matrix); }
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
  add(new THREE.BoxGeometry(.3, .9, .5), gunM, 0, -1.25, -.12);                      // stock
  add(new THREE.BoxGeometry(.18, .5, .14), gunM, 0, -.2, -.35);                      // grip
  const core = add(new THREE.IcosahedronGeometry(.24, 0), M(0xffd45a, 3), 0, .25, .32);  // crown core
  for (let i = 0; i < 3; i++) add(new THREE.ConeGeometry(.06, .22, 4), M(0xffd45a, 2.5), (i - 1) * .12, .25 + (i === 1 ? .32 : .24), .32);
  const halo = add(new THREE.SphereGeometry(.55, 10, 8), glow(0xffc83d), 0, .25, .32); halo.material.opacity = .35;
  const blade = add(new THREE.CylinderGeometry(.05, .05, 2.6, 6), glow(0xffe08a), 0, 2.2, .06); blade.material.opacity = .5;
  armR.add(rifle);
  const bl = new THREE.PointLight(0xffc83d, 5, 8); bl.position.set(0, -1.3, 1.6); armR.add(bl);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.2, 20), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .3 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .05;
  g.add(legL, legR, body, hem, trim, head, ruff, mkEar(-1), mkEar(1), muzzle, nose, shades, chain, pendant, tail, armL, armR, shadow);
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

// ===== enemies =====
const TYPES = {
  crab: { hp: 30, sp: 5.5, dmg: 8, col: 0xff3c6e, r: 1.1 },
  wick: { hp: 22, sp: 8.5, dmg: 6, col: 0x3cff9a, r: .9 },
  brute: { hp: 140, sp: 3, dmg: 18, col: 0xa24cff, r: 2.2 },
};
function makeEnemy(type) {
  const T = TYPES[type], g = new THREE.Group(), mat = M(T.col, .45, { flatShading: true });
  if (type === 'crab') { const b = new THREE.Mesh(new THREE.DodecahedronGeometry(1), mat); b.scale.set(1.3, .7, 1); b.position.y = .9; g.add(b);
    for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.2, 5), mat); c.position.set(s * 1.3, 1, .6); c.rotation.x = Math.PI / 2; g.add(c); } }
  if (type === 'wick') { const b = new THREE.Mesh(new THREE.BoxGeometry(.9, 2.6, .9), mat); b.position.y = 1.8; g.add(b);
    const w = new THREE.Mesh(new THREE.BoxGeometry(.15, 1.4, .15), glow(0xffffff)); w.position.y = 3.8; g.add(w); }
  if (type === 'brute') { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 0), mat); b.position.y = 2.6; g.add(b);
    for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.BoxGeometry(.9, 2.4, .9), mat); a.position.set(s * 2.3, 2.2, 0); g.add(a); } }
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.16, 8, 6), glow(0xffffff)); e.position.set(s * .3 * T.r, T.r * 1.3 + (type === 'wick' ? 1.6 : type === 'brute' ? 1.4 : 0), T.r * .85); g.add(e); }
  const hb = new THREE.Mesh(new THREE.PlaneGeometry(2, .22), new THREE.MeshBasicMaterial({ color: 0xff2a5a, depthTest: false })); hb.position.y = T.r * 2.2 + (type === 'wick' ? 2.2 : 1); g.add(hb);
  g.userData = { type, T, hp: T.hp, stun: 0, kb: new THREE.Vector3(), atk: 0, hb, hit: 0, mat };
  return g;
}
const enemies = [];

// ===== state =====
const S = { mode: 'title', t: 0, yaw: Math.PI, camYaw: Math.PI, hp: 100, en: 40, score: 0, kills: 0, wave: 0, iframes: 0, dodge: 0, cd: { wave: 0, chain: 0, roar: 0, dodge: 0 }, shake: 0, swing: 0, spawnQ: [], spawnT: 0 };
const CD = { wave: .32, chain: 3.5, roar: 7, dodge: 1.1 };
const COST = { chain: 15, roar: 30 };
const WAVES = [['crab', 'crab', 'crab', 'wick', 'crab', 'wick'], ['wick', 'wick', 'crab', 'crab', 'wick', 'crab', 'brute', 'wick'], ['brute', 'crab', 'wick', 'wick', 'crab', 'brute', 'wick', 'crab', 'wick', 'crab']];
const keys = {}, joy = { x: 0, y: 0 };
const banner = (t, c = '#fff') => { const b = $('#banner'); b.textContent = t; b.style.color = c; b.style.opacity = 1; clearTimeout(banner.h); banner.h = setTimeout(() => b.style.opacity = 0, 1400); };
const fade = (on) => $('#fade').style.opacity = on ? 1 : 0;
const show = (id, on) => $(id).classList.toggle('hide', !on);

function startCine() {
  $('#title').classList.remove('on'); show('#title', false); show('#cine', true); show('#hud', false); show('#end', false);
  S.mode = 'cine'; S.t = 0; boat.visible = true; boat.position.set(0, 0, 230); boat.rotation.y = Math.PI;
  enemies.forEach(e => scene.remove(e)); enemies.length = 0;
  zayn.position.set(0, 1, 0); zayn.rotation.y = Math.PI; boat.add(zayn); zayn.position.set(0, .9, -1); zayn.rotation.y = 0;
}
function landOnBeach() {
  if (S.mode !== 'cine') return; S.mode = 'fading'; fade(1);
  setTimeout(() => {
    boat.visible = false; boat.remove(zayn); scene.add(zayn); zayn.position.set(0, 0, 18); S.yaw = S.camYaw = Math.PI;
    Object.assign(S, { hp: 100, en: 40, score: 0, kills: 0, wave: 0, iframes: 0, spawnQ: [], cd: { wave: 0, chain: 0, roar: 0, dodge: 0 } });
    show('#cine', false); show('#hud', true);
    setTimeout(() => { fade(0); S.mode = 'play'; banner('MISSION 01 · EMBER DOT', '#4DB8FF'); setTimeout(nextWave, 1600); }, 700);
  }, 1000);
}
function nextWave() {
  if (S.wave >= WAVES.length) return win();
  S.spawnQ = [...WAVES[S.wave]]; S.wave++; $('#obj').textContent = `Wave ${S.wave}/${WAVES.length} — static on the shore`;
  banner(`WAVE ${S.wave}`, '#ff3cac');
}
function spawn(type) { const e = makeEnemy(type), a = Math.random() * 6.28; e.position.set(Math.cos(a) * 26, 0, Math.sin(a) * 26); scene.add(e); enemies.push(e); burst(e.position.clone().setY(1), [0xff3cac, 0xa24cff, 0x4DB8FF], 40, 8, 6); ring(e.position, 0xa24cff, 5, .5); }
function win() { S.mode = 'end'; setTimeout(() => { $('#endT').textContent = 'MISSION COMPLETE'; $('#endT').style.color = '#4DB8FF'; $('#endS').textContent = `Ember Dot secured · ${S.kills} static monsters cleared · score ${S.score}. Next: Moonleaf Oval.`; show('#end', true); }, 900); }
function lose() { S.mode = 'end'; banner('LIQUIDATED', '#ff2a5a'); setTimeout(() => { $('#endT').textContent = 'LIQUIDATED'; $('#endT').style.color = '#ff2a5a'; $('#endS').textContent = `Zayn went down on the beach · score ${S.score}. Run it back?`; show('#end', true); }, 1200); }

const fwd = () => new THREE.Vector3(Math.sin(S.yaw), 0, Math.cos(S.yaw));
function damage(e, d, col, kbv) {
  const u = e.userData; u.hp -= d; u.hit = .12; if (kbv) u.kb.add(kbv);
  burst(e.position.clone().setY(1.5), [col, 0xffffff, 0xffc83d], 18, 9, 5); S.score += Math.round(d);
  floatTxt(e.position, '-' + Math.round(d), col);
  if (u.hp <= 0) kill(e);
}
function kill(e) { const i = enemies.indexOf(e); if (i < 0) return; enemies.splice(i, 1); scene.remove(e);
  const p = e.position.clone().setY(1.5); burst(p, [e.userData.T.col, 0xffffff, SKY, 0xffc83d], 70, 14, 9); flash(p, e.userData.T.col, 4); ring(e.position, e.userData.T.col, 6, .4);
  S.kills++; S.score += 100; S.en = Math.min(100, S.en + 8); S.shake = Math.max(S.shake, .3); }
const waves = [], ropes = [];
const act = {
  wave() { S.swing = .25; const f = fwd(), m = new THREE.Mesh(new THREE.TorusGeometry(4, .7, 8, 32, Math.PI), glow(0x5ff8ff)); const inner = new THREE.Mesh(new THREE.TorusGeometry(3.6, .25, 6, 32, Math.PI), glow(0xffffff)); m.add(inner); inner.scale.z = 1;
    m.position.copy(zayn.position).add(f.clone().multiplyScalar(2)).setY(2); m.rotation.set(Math.PI / 2, 0, -S.yaw + Math.PI); scene.add(m);
    waves.push({ m, v: f.multiplyScalar(30), life: .7, hits: new Set() }); burst(m.position, [SKY, 0xffffff, 0x5ff8ff], 40, 9, 4, 0); flash(m.position, 0x5ff8ff, 3, .2); S.en = Math.min(100, S.en + 2); },
  chain() { const f = fwd(); let best = null, bd = 22;
    for (const e of enemies) { const d = e.position.clone().sub(zayn.position), l = d.length(); if (l > 4 && l < bd && d.normalize().dot(f) > .3) { bd = l; best = e; } }
    const end = best ? best.position.clone().setY(2) : zayn.position.clone().add(f.multiplyScalar(18)).setY(2);
    const st = zayn.position.clone().setY(2.6), n = 24;
    for (let i = 0; i <= n; i++) { const p = st.clone().lerp(end, i / n); burst(p, [0xffc83d, 0xffffff], 3, 1.5, 1, 0); }
    { const len = st.distanceTo(end), rope = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, len, 8), M(0xffd44d, 2, { transparent: true })); rope.position.copy(st).lerp(end, .5); rope.lookAt(end); rope.rotateX(Math.PI / 2); scene.add(rope); ropes.push({ m: rope, t: .45 }); }
    flash(end, 0xffc83d, 6, .4); flash(end, 0xffffff, 3, .2); ring(end, 0xffc83d, 9, .5, 1); ring(end, 0xff8a1e, 6, .4, 2); burst(end, [0xffc83d, 0xff8a1e, 0xffffff], 90, 16, 9);
    if (best) { const pull = zayn.position.clone().sub(best.position).setY(0).normalize().multiplyScalar(24); damage(best, 45, 0xffc83d, pull); best.userData.stun = 1;
      for (const e of enemies) if (e !== best && e.position.distanceTo(end) < 5) damage(e, 20, 0xffc83d); }
    S.shake = .35; banner('GOLD CHAIN!', '#ffc83d'); },
  roar() { const p = zayn.position; ring(p, 0xff3cac, 20, .7, .5); ring(p, 0xffc83d, 15, .5, 1.5); ring(p, SKY, 26, .9, .2); ring(p, 0x3cff9a, 11, .4, 3); ring(p, 0xa24cff, 18, .6, 4); flash(p.clone().setY(2), 0xff3cac, 10, .4); flash(p.clone().setY(2), 0xffffff, 5, .2);
    burst(p.clone().setY(1), [0xff3cac, 0xffc83d, SKY, 0xffffff, 0x3cff9a, 0xa24cff], 320, 28, 12);
    for (const e of [...enemies]) { const d = e.position.clone().sub(p); if (d.length() < 13) { e.userData.stun = 2.5; damage(e, 25, 0xff3cac, d.setY(0).normalize().multiplyScalar(18)); } }
    S.shake = .7; banner('ROAR STUN!', '#ff3cac'); },
  dodge() { S.dodge = .22; S.iframes = .4; },
};
function use(p) { if (S.mode !== 'play' || S.cd[p] > 0) return; if (COST[p] && S.en < COST[p]) { banner('NEED FLOW ENERGY', '#9df'); return; }
  S.en -= COST[p] || 0; S.cd[p] = CD[p]; act[p](); }
// floating text via DOM
function floatTxt(p, t, col) { const v = p.clone().setY(4).project(cam), d = document.createElement('div');
  d.textContent = t; Object.assign(d.style, { position: 'fixed', left: (v.x + 1) / 2 * innerWidth + 'px', top: (1 - v.y) / 2 * innerHeight + 'px', color: '#' + new THREE.Color(col).getHexString(), font: '900 22px system-ui', textShadow: '0 0 8px #000', zIndex: 15, pointerEvents: 'none', transition: 'all .7s', transform: 'translate(-50%,0)' });
  document.body.appendChild(d); requestAnimationFrame(() => { d.style.top = parseFloat(d.style.top) - 60 + 'px'; d.style.opacity = 0; }); setTimeout(() => d.remove(), 750); }

// ===== input =====
addEventListener('keydown', e => { keys[e.code] = true; const m = { KeyQ: 'wave', KeyE: 'chain', KeyR: 'roar', Space: 'dodge' }[e.code]; if (m) { use(m); e.preventDefault(); } if (S.mode === 'cine' && (e.code === 'Enter' || e.code === 'Escape')) landOnBeach(); });
addEventListener('keyup', e => keys[e.code] = false);
document.querySelectorAll('.p').forEach(b => b.addEventListener('pointerdown', e => { e.stopPropagation(); use(b.dataset.p); }));
let drag = null;
$('#c').addEventListener('pointerdown', e => { if (S.mode === 'play') { if (e.pointerType === 'mouse' && e.button === 0) use('wave'); drag = { x: e.clientX, id: e.pointerId }; } });
addEventListener('pointermove', e => { if (drag && drag.id === e.pointerId) { S.camYaw -= (e.clientX - drag.x) * .006; S.yaw = S.camYaw; drag.x = e.clientX; } });
addEventListener('pointerup', e => { if (drag && drag.id === e.pointerId) drag = null; });
{ const st = $('#stick'), kn = $('#knob'); let id = null;
  const mv = e => { const r = st.getBoundingClientRect(); let x = e.clientX - r.left - 65, y = e.clientY - r.top - 65; const l = Math.hypot(x, y); if (l > 50) { x *= 50 / l; y *= 50 / l; } joy.x = x / 50; joy.y = y / 50; kn.style.transform = `translate(${x}px,${y}px)`; };
  st.addEventListener('pointerdown', e => { id = e.pointerId; st.setPointerCapture(id); mv(e); e.stopPropagation(); });
  st.addEventListener('pointermove', e => e.pointerId === id && mv(e));
  st.addEventListener('pointerup', () => { id = null; joy.x = joy.y = 0; kn.style.transform = ''; }); }
$('.card.pick').onclick = () => { fade(1); setTimeout(() => { startCine(); fade(0); }, 600); };
$('#skip').onclick = landOnBeach;
$('#again').onclick = () => { show('#end', false); fade(1); setTimeout(() => { startCine(); fade(0); }, 600); };
$('#menu').onclick = () => { show('#end', false); show('#hud', false); show('#title', true); S.mode = 'title'; };

// ===== loop =====
let last = performance.now();
const v3 = new THREE.Vector3();
function tick(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
  { const s = new THREE.Mesh(new THREE.CircleGeometry(40, 32), new THREE.MeshBasicMaterial({ color: 0xffb347, fog: false })); s.position.set(-300, 70, -900); s.lookAt(0, 0, 0); scene.add(s); }
// ocean waves
  const a = oceanG.attributes.position.array;
  for (let i = 0; i < a.length; i += 3) a[i + 1] = Math.sin(oBase[i] * .08 + S.t * 1.4) * .35 + Math.cos(oBase[i + 2] * .07 + S.t) * .35;
  oceanG.attributes.position.needsUpdate = true;
  pylons.forEach((p, i) => { p.rotation.y += dt * 2; p.position.y = 8.5 + Math.sin(S.t * 2 + i) * .4; });

  if (S.mode === 'title') { const r = 70; cam.position.set(Math.cos(S.t * .1) * r, 22, Math.sin(S.t * .1) * r); cam.lookAt(0, 3, 0); }
  else if (S.mode === 'cine' || S.mode === 'fading') {
    const k = Math.min(1, S.t / 13); boat.position.z = 230 - k * 190; boat.position.y = Math.sin(S.t * 6) * .25; boat.rotation.z = Math.sin(S.t * 2) * .06; boat.rotation.x = -.06;
    burst(new THREE.Vector3(boat.position.x + (Math.random() - .5) * 3, .3, boat.position.z + 5), [0xffffff, 0xbff6ff], 6, 3, 2.5, 8);
    $('#cineSub').textContent = `Ember Dot · ${Math.max(0, (boat.position.z - 34) / 500).toFixed(2)} km`;
    const sw = Math.sin(S.t * .35) * 6;
    cam.position.set(boat.position.x + sw, 6 + Math.sin(S.t) * .4, boat.position.z + 14); cam.lookAt(boat.position.x, 3, boat.position.z - 20);
    if (S.t > 13.5) landOnBeach();
  } else {
    if (S.mode === 'play') {
      if (keys.ArrowLeft) S.camYaw += dt * 2.2; if (keys.ArrowRight) S.camYaw -= dt * 2.2;
      let ix = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joy.x, iy = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0) - joy.y;
      const fw = new THREE.Vector3(Math.sin(S.camYaw), 0, Math.cos(S.camYaw)), rt = new THREE.Vector3(-fw.z, 0, fw.x);
      const mv = fw.multiplyScalar(iy).add(rt.multiplyScalar(-ix)); const ml = mv.length();
      if (ml > .1) { mv.normalize(); S.yaw = Math.atan2(mv.x, mv.z); }
      let sp = 11 * Math.min(1, ml); if (S.dodge > 0) { sp = 42; S.dodge -= dt; burst(zayn.position.clone().setY(2), [0xffc83d, 0xff8a1e, SKY], 6, 2, 1, 0); if (ml < .1) mv.copy(fwd()); }
      zayn.position.add(mv.multiplyScalar(sp * dt)); const pl = Math.hypot(zayn.position.x, zayn.position.z); if (pl > 28) zayn.position.multiplyScalar(28 / pl);
      let dy = S.yaw - zayn.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); zayn.rotation.y += dy * Math.min(1, dt * 14);
      const ud = zayn.userData, w = ml > .1 ? Math.sin(S.t * 14) * .6 : 0; ud.legL.rotation.x = w; ud.legR.rotation.x = -w; ud.tail.rotation.z = Math.sin(S.t * 3) * .25; ud.core.rotation.y += dt * 3;
      S.swing = Math.max(0, S.swing - dt); ud.armR.rotation.x = S.swing > 0 ? -2.2 + (.25 - S.swing) * 14 : -.2 + w * .3;
      for (const k in S.cd) S.cd[k] = Math.max(0, S.cd[k] - dt); S.iframes -= dt; S.en = Math.min(100, S.en + dt * 3);
      if (S.spawnQ.length) { S.spawnT -= dt; if (S.spawnT <= 0) { spawn(S.spawnQ.shift()); S.spawnT = 1.1; } }
      else if (!enemies.length && S.wave) { S.wave < WAVES.length ? (S.wave_next = (S.wave_next || 0) + dt) : 0; if (S.wave >= WAVES.length) win(); else if (S.wave_next > 1.5) { S.wave_next = 0; nextWave(); } }
    }
    // enemies
    for (const e of [...enemies]) { const u = e.userData; v3.copy(zayn.position).sub(e.position).setY(0); const d = v3.length();
      if (u.stun > 0) { u.stun -= dt; e.rotation.y += dt * 8; }
      else if (S.mode === 'play') { e.lookAt(zayn.position.x, 0, zayn.position.z); if (d > u.T.r + 1.6) e.position.add(v3.normalize().multiplyScalar(u.T.sp * dt));
        u.atk -= dt; if (d < u.T.r + 2.2 && u.atk <= 0) { u.atk = 1; if (S.iframes <= 0) { S.hp -= u.T.dmg; S.shake = .3; burst(zayn.position.clone().setY(2), [0xff2a5a, 0xffffff], 25, 8, 5); if (S.hp <= 0) { S.hp = 0; lose(); } } } }
      e.position.add(u.kb.clone().multiplyScalar(dt)); u.kb.multiplyScalar(Math.pow(.02, dt));
      e.position.y = u.type === 'wick' ? Math.abs(Math.sin(S.t * 10)) * .5 : 0;
      u.hit -= dt; u.mat.emissiveIntensity = u.hit > 0 ? 2.5 : .45;
      u.hb.scale.x = Math.max(.01, u.hp / u.T.hp); u.hb.quaternion.copy(cam.quaternion).premultiply(e.quaternion.clone().invert()); }
    // wave projectiles
    for (let i = waves.length - 1; i >= 0; i--) { const w = waves[i]; w.life -= dt; w.m.position.add(v3.copy(w.v).multiplyScalar(dt)); w.m.scale.multiplyScalar(1 + dt * 1.5); w.m.material.opacity = Math.min(1, w.life * 2);
      burst(w.m.position, [SKY, 0x9ff6ff, 0xffffff], 8, 3, 1.5, 0);
      for (const e of [...enemies]) if (!w.hits.has(e) && e.position.distanceTo(w.m.position.clone().setY(0)) < e.userData.T.r + 4 * w.m.scale.x) { w.hits.add(e); damage(e, 16, SKY, w.v.clone().normalize().multiplyScalar(10)); }
      if (w.life <= 0) { scene.remove(w.m); waves.splice(i, 1); } }
    for (let i = ropes.length - 1; i >= 0; i--) { const r = ropes[i]; r.t -= dt; r.m.material.opacity = r.t * 2; if (r.t <= 0) { scene.remove(r.m); ropes.splice(i, 1); } }
    // third-person camera
    let cy = S.camYaw - S.yaw; cy = Math.atan2(Math.sin(cy), Math.cos(cy)); if (!drag && !keys.ArrowLeft && !keys.ArrowRight && S.mode === 'play' && (keys.KeyW || joy.y < -.3)) S.camYaw -= cy * Math.min(1, dt * 1.5);
    const back = new THREE.Vector3(-Math.sin(S.camYaw), 0, -Math.cos(S.camYaw));
    const tgt = zayn.position.clone().add(back.multiplyScalar(cam.aspect < 1 ? 17 : 12)).add(new THREE.Vector3(Math.cos(S.camYaw) * 2.2, 8, -Math.sin(S.camYaw) * 2.2));
    cam.position.lerp(tgt, Math.min(1, dt * 8)); S.shake = Math.max(0, S.shake - dt);
    if (S.shake) cam.position.add(new THREE.Vector3((Math.random() - .5), (Math.random() - .5), 0).multiplyScalar(S.shake * 1.5));
    cam.lookAt(zayn.position.x + Math.sin(S.camYaw) * 7, 4, zayn.position.z + Math.cos(S.camYaw) * 6);
    $('#hpF').style.width = S.hp + '%'; $('#enF').style.width = S.en + '%'; $('#score').textContent = S.score;
    document.querySelectorAll('.p').forEach(b => { const p = b.dataset.p; b.querySelector('em').style.transform = `scaleY(${S.cd[p] / CD[p]})`; b.style.opacity = COST[p] && S.en < COST[p] ? .5 : 1; });
  }
  stepParticles(dt); stepFx(dt);
  R.render(scene, cam); requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
window.__spawn = spawn; window.__S = S; window.__use = use;

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
