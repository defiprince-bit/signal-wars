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
const ocean = new THREE.Mesh(oceanG, new THREE.MeshStandardMaterial({ color: 0x0f8fb8, roughness: .12, metalness: .35, flatShading: true, transparent: true, opacity: .95, emissive: 0x03263a }));
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
// sharp energy sprites drawn once to canvas, shared by every projectile (no blocky geometry)
const fxTex = (draw) => { const c = document.createElement('canvas'); c.width = 256; c.height = 256; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const CRESCENT = fxTex(x => { for (const [w, a] of [[34, .18], [18, .45], [7, 1]]) { x.strokeStyle = `rgba(255,255,255,${a})`; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.ellipse(128, 150, 110, 88, 0, Math.PI * 1.08, Math.PI * 1.92); x.stroke(); }
  const g = x.createRadialGradient(128, 150, 40, 128, 150, 110); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.85, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(128, 150, 110, 88, 0, Math.PI, 0); x.fill(); });
const STREAK = fxTex(x => { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.beginPath(); x.moveTo(128, 0); x.lineTo(150, 40); x.lineTo(136, 256); x.lineTo(120, 256); x.lineTo(106, 40); x.closePath(); x.fill(); });
const ORB = fxTex(x => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.85)'); g.addColorStop(.5, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); });
const fxMats = {}; const fxMat = (tex, col) => { const k = tex.uuid + col; return fxMats[k] || (fxMats[k] = new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); };
const PLANE = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2); // flat on ground, texture +v faces -z
function sprite(tex, col, sx, sz, op = 1) { const m = new THREE.Mesh(PLANE, fxMat(tex, col).clone()); m.material.opacity = op; m.scale.set(sx, 1, sz); return m; }
function ring(p, col, max = 10, life = .5, y = .3, tube = .25) { const m = new THREE.Mesh(new THREE.TorusGeometry(1, tube, 8, 48), glow(col)); m.rotation.x = Math.PI / 2; m.position.set(p.x, y, p.z); scene.add(m); fx.push({ m, t: 0, life, max }); }
function flash(p, col, max = 4, life = .25) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), glow(col)); m.position.copy(p); scene.add(m); fx.push({ m, t: 0, life, max }); }
function stepFx(dt) { for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt; const k = f.t / f.life; f.m.scale.setScalar(.2 + k * f.max); f.m.material.opacity = (f.m.geometry.type === 'SphereGeometry' ? .45 : 1) * (1 - k); if (k >= 1) { scene.remove(f.m); f.m.geometry.dispose(); fx.splice(i, 1); } } }

// ===== Zayn (low-poly + canvas textures; budget in docs/ART_BUDGET.md) =====
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
const furTex = canvasTex(512, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#c8621a'); g.addColorStop(1, '#de8a34'); x.fillStyle = g; x.fillRect(0, 0, w, h);
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
  const earM = M(0x1a120c); const mkEar = sx => { const e = new THREE.Mesh(new THREE.ConeGeometry(.32, .5, 6), earM); e.position.set(sx * .56, 4.55, -.05); e.rotation.z = -sx * .35;
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
  const shirtM = body.material[0], dark = [[fur, 0x2a2224], [shirtM, 0x17161b], [slv, 0x17161b], [tm, 0x2a2224], [ruff.material, 0x34302e], [muzzle.material, 0x34302e]];
  dark.forEach(([m]) => { m.userData.map = m.map; m.userData.col = m.color.getHex(); });
  const combat = on => { dark.forEach(([m, c]) => { m.map = on ? null : m.userData.map; m.color.setHex(on ? c : m.userData.col); m.needsUpdate = true; });
    earM.color.setHex(on ? 0xffc83d : 0x1a120c); earM.emissive.setHex(on ? 0xffc83d : 0); earM.emissiveIntensity = on ? .6 : 0; }; // combat read: dark mass + gold ears/collar/tip
  g.userData = { legL, legR, armR, blade, core, tail, combat }; g.scale.setScalar(1.6); return g;
}
// ===== roster: every Signal Keeper is playable (fan build). `zayn` is the player rig; the model inside swaps. =====
const CHARS = {
  zayn: { name: 'ZAYN', title: 'King of the Outer Dots · Legendary', blurb: 'Every link on his gold chain is a duel he refused to lose.', col: '#ffc83d',
    hp: 100, speed: 15, wave: { col: 0x5ff8ff, dmg: 11, cd: .28, spd: 36, life: .55, size: 1, pierce: 5, shape: 'arc' },
    chain: { name: 'GOLD CHAIN', col: 0xffc83d, mode: 'lasso' }, roar: { name: 'ROAR · SHIELD UP', col: 0xffc83d, mode: 'shield' } },
  hero: { name: 'HERO', title: 'Founder · Mythic', blurb: 'He pulled the islands out of the static. The star in his eye never went out.', col: '#ff8a1e',
    hp: 120, speed: 14, wave: { col: 0xff8a1e, dmg: 15, cd: .34, spd: 32, life: .6, size: 1.35, pierce: 7, shape: 'arc' },
    chain: { name: 'CANDLE BREAKER', col: 0xff8a1e, mode: 'slam' }, roar: { name: 'STAR-EYE VERDICT', col: 0xff8a1e, mode: 'freeze' } },
  bankyo: { name: 'BANKYO', title: 'Tidekeeper · Legendary', blurb: 'Every trade that survived became light in his ocean.', col: '#2ee6d0',
    hp: 110, speed: 14, wave: { col: 0x2ee6d0, dmg: 12, cd: .36, spd: 24, life: .9, size: 1, pierce: 9, shape: 'orb' },
    chain: { name: 'FLOW ORB', col: 0x2ee6d0, mode: 'orb' }, roar: { name: 'TSUNAMI · HEAL', col: 0x2ee6d0, mode: 'heal' } },
  lyra: { name: 'LYRA', title: 'Moonleaf Scout · Epic', blurb: 'Reads volatility like wind. Everyone gets scared; not everyone gets ready.', col: '#7dff9a',
    hp: 85, speed: 17.5, wave: { col: 0x7dff9a, dmg: 8, cd: .17, spd: 52, life: .45, size: .7, pierce: 2, shape: 'bolt' },
    chain: { name: 'LEAFSTEP VOLLEY', col: 0x7dff9a, mode: 'fan' }, roar: { name: 'MOON RAIN', col: 0xc8ffd8, mode: 'volley' } },
  hertzling: { name: 'HERTZLING', title: 'Spirit of the Flow · Epic', blurb: 'Purple light and tiny skulls for every liquidation the ocean swallowed.', col: '#b46bff',
    hp: 90, speed: 15.5, wave: { col: 0xb46bff, dmg: 10, cd: .3, spd: 30, life: .7, size: 1.1, pierce: 6, shape: 'ring' },
    chain: { name: 'ECHO RIFT', col: 0xb46bff, mode: 'pull' }, roar: { name: 'RESONANCE PULSE', col: 0xb46bff, mode: 'pulse' } },
  chado: { name: 'CHADO', title: 'Shadow Blade of the Sunset Dot · Epic', blurb: 'Twin katanas, face never shown. You see the result.', col: '#ff6a2a',
    hp: 90, speed: 17, wave: { col: 0xff6a2a, dmg: 13, cd: .2, spd: 44, life: .28, size: 1.2, pierce: 8, shape: 'slash' },
    chain: { name: 'SUNSET TWIN SLASH', col: 0xff6a2a, mode: 'dash' }, roar: { name: 'SHADOW STEP', col: 0xff6a2a, mode: 'blink' } },
  kael: { name: 'KAEL', title: 'Blue Moon Berserker · Rare', blurb: 'Max leverage, always gets back up. Liquidated? Cool. Run it back.', col: '#5a8cff',
    hp: 105, speed: 15.5, wave: { col: 0x5a8cff, dmg: 14, cd: .3, spd: 34, life: .45, size: 1.2, pierce: 5, shape: 'arc' },
    chain: { name: 'MOON CLEAVE', col: 0x8fb4ff, mode: 'cleave' }, roar: { name: 'MOONFLARE FRENZY', col: 0x5a8cff, mode: 'frenzy' } },
  warden: { name: 'WARDEN', title: 'Wingbreaker Vanguard · Rare', blurb: 'Green wing-mark armor. Nobody gets left on the chart.', col: '#3fe06a',
    hp: 140, speed: 13.5, wave: { col: 0x3fe06a, dmg: 12, cd: .32, spd: 34, life: .55, size: 1.1, pierce: 5, shape: 'arc' },
    chain: { name: 'GREEN WING BARRAGE', col: 0x3fe06a, mode: 'barrage' }, roar: { name: 'BULWARK', col: 0x3fe06a, mode: 'shield' } },
};
function makeChar(id) { // low-poly humanoid (~2–3k tris) with signature silhouette pieces per CHARACTERS.md
  const D = { hero: { body: 0xece6da, trim: 0xff8a1e, skin: 0xd9a77a, leg: 0x2a2a30 }, bankyo: { body: 0x0f5e66, trim: 0x2ee6d0, skin: 0x8a5a3c, leg: 0x0c2f36 },
    lyra: { body: 0x1f6b3a, trim: 0x7dff9a, skin: 0xf0d2b6, leg: 0x2a3a2a }, hertzling: { body: 0x3a1670, trim: 0xb46bff, skin: 0xd8c8ff, leg: 0x21103f },
    chado: { body: 0x111116, trim: 0xff6a2a, skin: 0x222228, leg: 0x0d0d10 }, kael: { body: 0x1a2a66, trim: 0x5a8cff, skin: 0xe6b894, leg: 0x161a2a },
    warden: { body: 0x1f7a3a, trim: 0x3fe06a, skin: 0xcfa07c, leg: 0x22301f } }[id];
  const g = new THREE.Group(), body = M(D.body, 0, { roughness: .7 }), trim = M(D.trim, 1.2), skin = M(D.skin, 0, { roughness: .9 }), leg = M(D.leg, 0, { roughness: .9 }), dark = M(0x101014, 0, { metalness: .7, roughness: .35 });
  const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 3, 8), m), put = (o, x, y, z, par = g) => { o.position.set(x, y, z); par.add(o); return o; };
  const mkLeg = sx => { const p = new THREE.Group(); p.position.set(sx, 1.45, 0); put(cap(.3, .95, leg), 0, -.7, 0, p); put(new THREE.Mesh(new THREE.BoxGeometry(.5, .32, .85), dark), 0, -1.35, .12, p); return p; };
  const legL = mkLeg(-.36), legR = mkLeg(.36); g.add(legL, legR);
  put(new THREE.Mesh(new THREE.CylinderGeometry(.82, .7, 1.75, 12), body), 0, 2.35, 0);
  const belt = put(new THREE.Mesh(new THREE.TorusGeometry(.76, .08, 5, 18), trim), 0, 1.62, 0); belt.rotation.x = Math.PI / 2;
  const head = put(new THREE.Mesh(new THREE.SphereGeometry(.66, 16, 12), skin), 0, 3.8, 0);
  // shoulder pads read from above
  for (const sx of [-1, 1]) put(new THREE.Mesh(new THREE.SphereGeometry(.38, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), trim), sx * .85, 3.05, 0).scale.set(1.2, .7, 1.1);
  const armL = cap(.2, 1, body); armL.position.set(-.98, 2.35, .25); armL.rotation.set(-.9, 0, .35); g.add(armL);
  const armR = new THREE.Group(); armR.position.set(.95, 2.95, 0); put(cap(.2, 1, body), 0, -.65, 0, armR); put(new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 6), skin), 0, -1.35, 0, armR); g.add(armR);
  const wpn = new THREE.Group(); wpn.position.set(0, -1.35, .3); wpn.rotation.x = Math.PI / 2; armR.add(wpn); let core = new THREE.Object3D(), tail = new THREE.Object3D(); g.add(tail);
  const blade = (len, w, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, len, .08), m); b.position.y = len / 2 + .3; wpn.add(b); return b; };
  if (id === 'hero') { // cracked-candle helmet + star eye + orange cape + greatsword
    put(new THREE.Mesh(new THREE.CylinderGeometry(.72, .7, .9, 8), M(0x2a2a30, 0, { metalness: .8, roughness: .3 })), 0, 3.95, 0);
    put(new THREE.Mesh(new THREE.ConeGeometry(.18, .8, 4), trim), 0, 4.75, 0); put(new THREE.Mesh(new THREE.OctahedronGeometry(.2, 0), M(0xffb04a, 4)), .25, 3.95, .66);
    const cape = put(new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, .08), M(0xff6a10, .3)), 0, 2.4, -.8); cape.rotation.x = .25; tail = cape;
    blade(2.8, .34, M(0xfff1d6, 1.4)); core = put(new THREE.Mesh(new THREE.OctahedronGeometry(.22, 0), M(0xff8a1e, 3)), 0, .3, 0, wpn); }
  if (id === 'bankyo') { // wide tide hood + floating flow orb
    const hood = put(new THREE.Mesh(new THREE.ConeGeometry(1.05, .9, 10), body), 0, 4.35, 0);
    put(new THREE.Mesh(new THREE.TorusGeometry(.9, .07, 5, 20), trim), 0, 4.0, 0).rotation.x = Math.PI / 2;
    core = put(new THREE.Mesh(new THREE.IcosahedronGeometry(.42, 1), M(0x2ee6d0, 3)), 0, .5, 0, wpn); const h = put(new THREE.Mesh(new THREE.SphereGeometry(.7, 10, 8), glow(0x2ee6d0)), 0, .5, 0, wpn); h.material.opacity = .3;
    const robe = put(new THREE.Mesh(new THREE.CylinderGeometry(.75, 1.05, 1.1, 12), body), 0, 1.2, 0); tail = robe; }
  if (id === 'lyra') { // long elf ears, silver hair, bow
    for (const sx of [-1, 1]) { const e = put(new THREE.Mesh(new THREE.ConeGeometry(.12, .9, 4), skin), sx * .75, 3.95, -.05); e.rotation.z = -sx * 1.2; }
    put(new THREE.Mesh(new THREE.SphereGeometry(.7, 12, 8, 0, Math.PI * 2, 0, Math.PI / 1.8), M(0xe8eef5)), 0, 3.88, -.06);
    const tailH = put(new THREE.Mesh(new THREE.ConeGeometry(.22, 1.2, 6), M(0xe8eef5)), 0, 3.4, -.7); tailH.rotation.x = -2.6; tail = tailH;
    const bow = new THREE.Mesh(new THREE.TorusGeometry(1.1, .06, 4, 16, Math.PI), M(0xc8ffd8, 1)); bow.rotation.z = Math.PI / 2; bow.position.y = .6; wpn.add(bow); core = bow; }
  if (id === 'hertzling') { // hovering spirit: no shoes, skull orbit, horns
    for (const sx of [-1, 1]) put(new THREE.Mesh(new THREE.ConeGeometry(.12, .6, 5), trim), sx * .4, 4.45, 0).rotation.z = -sx * .4;
    const orbit = new THREE.Group(); orbit.position.y = 2.6; for (let i = 0; i < 4; i++) { const k = new THREE.Mesh(new THREE.IcosahedronGeometry(.17, 0), M(0xf2eaff, 1.5)); k.position.set(Math.cos(i * 1.57) * 1.3, 0, Math.sin(i * 1.57) * 1.3); orbit.add(k); } g.add(orbit); tail = orbit;
    const aura = put(new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 10), glow(0xb46bff)), 0, 2.6, 0); aura.material.opacity = .12;
    core = put(new THREE.Mesh(new THREE.OctahedronGeometry(.32, 0), M(0xb46bff, 3)), 0, .4, 0, wpn); }
  if (id === 'chado') { // masked ninja, sunset scarf, twin katanas
    put(new THREE.Mesh(new THREE.BoxGeometry(.9, .14, .3), M(0xff6a2a, 2)), 0, 3.85, .58);
    const scarf = put(new THREE.Mesh(new THREE.BoxGeometry(.25, 1.6, .06), M(0xff6a2a, .6)), .2, 3.0, -.7); scarf.rotation.x = .5; tail = scarf;
    blade(2.4, .1, M(0xfff0e0, 1)); const b2 = new THREE.Mesh(new THREE.BoxGeometry(.1, 2.2, .06), M(0xfff0e0, 1)); b2.position.set(-.5, 2.6, -.75); b2.rotation.z = .7; g.add(b2);
    core = put(new THREE.Mesh(new THREE.BoxGeometry(.3, .1, .3), trim), 0, .3, 0, wpn); }
  if (id === 'kael') { // spiky white hair, moon-shard eye, battle axe
    for (let i = 0; i < 6; i++) { const sp = put(new THREE.Mesh(new THREE.ConeGeometry(.16, .7, 4), M(0xf2f4ff)), Math.cos(i) * .4, 4.35, Math.sin(i) * .4 - .1); sp.rotation.set(Math.sin(i) * .6, 0, -Math.cos(i) * .6); }
    put(new THREE.Mesh(new THREE.OctahedronGeometry(.14, 0), M(0x7fe8ff, 4)), -.24, 3.9, .62);
    blade(2.2, .12, dark); const axe = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, .1, 3, 1, false, 0, Math.PI), M(0x8fb4ff, 1.5)); axe.rotation.z = Math.PI / 2; axe.position.set(.3, 2.2, 0); wpn.add(axe); core = axe; }
  if (id === 'warden') { // wing plates + tower shield + visor
    put(new THREE.Mesh(new THREE.BoxGeometry(.9, .12, .2), M(0x3fe06a, 3)), 0, 3.9, .6);
    for (const sx of [-1, 1]) { const w = put(new THREE.Mesh(new THREE.BoxGeometry(1.6, .9, .08), M(0x2fae4a, .4, { metalness: .6 })), sx * 1.0, 3.2, -.75); w.rotation.set(.2, sx * .5, sx * .45); }
    const sh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, .15), M(0x2fae4a, .2, { metalness: .7, roughness: .3 })); sh.position.set(-.3, 1.9, .6); g.add(sh); tail = sh;
    blade(1.8, .16, M(0xe8ffe8, 1)); core = put(new THREE.Mesh(new THREE.OctahedronGeometry(.2, 0), M(0x3fe06a, 3)), 0, .3, 0, wpn); }
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.2, 20), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: .3 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .05; g.add(shadow);
  const pr = new THREE.Mesh(new THREE.TorusGeometry(1.25, .07, 4, 32), glow(SKY)); pr.rotation.x = Math.PI / 2; pr.position.y = .08; g.add(pr); // player ring: never confused with Static
  g.userData = { legL, legR, armR, core, tail }; g.scale.setScalar(1.6); return g;
}
const zayn = new THREE.Group(); scene.add(zayn); const MODELS = {}; let CH = CHARS.zayn, CHID = 'zayn';
function setChar(id) { CHID = id; CH = CHARS[id]; for (const c of [...zayn.children]) zayn.remove(c);
  const m = MODELS[id] || (MODELS[id] = id === 'zayn' ? makeZayn() : makeChar(id)); zayn.add(m); zayn.userData = m.userData;
  if (id === 'zayn' && !m.userData.pr) { const pr = new THREE.Mesh(new THREE.TorusGeometry(1.25, .07, 4, 32), glow(SKY)); pr.rotation.x = Math.PI / 2; pr.position.y = .08; m.add(pr); m.userData.pr = pr; }
  CD.wave = CH.wave.cd; document.querySelectorAll('.nm').forEach(n => n.textContent = CH.name); }
// speedboat
const boat = new THREE.Group();
{ const plan = new THREE.Shape(); plan.moveTo(-1.8, -4.5); plan.lineTo(1.8, -4.5); plan.lineTo(1.9, 1.5); plan.quadraticCurveTo(1.6, 5, 0, 7.2); plan.quadraticCurveTo(-1.6, 5, -1.9, 1.5); plan.closePath();
  const hullG = new THREE.ExtrudeGeometry(plan, { depth: 1.3, bevelEnabled: true, bevelThickness: .35, bevelSize: .3, bevelSegments: 2, curveSegments: 10 }); hullG.rotateX(-Math.PI / 2); hullG.translate(0, -.5, 0);
  const hull = new THREE.Mesh(hullG, M(0xf4f6f8, 0, { roughness: .35, metalness: .2 }));
  const keel = new THREE.Mesh(hullG, M(0x0c1a2a, 0, { roughness: .4 })); keel.scale.set(.96, .45, .97); keel.position.y = -.55;
  const stripe = new THREE.Mesh(hullG, M(SKY, .8)); stripe.scale.set(1.02, .12, 1.01); stripe.position.y = .25;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(3, .12, 6), M(0x2a2f38, 0, { roughness: .8 })); deck.position.set(0, .86, -1);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.1, .12), M(0x9fe8ff, .25, { transparent: true, opacity: .55, metalness: .6, roughness: .05 })); glass.position.set(0, 1.4, 2.2); glass.rotation.x = -.55;
  const motor = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.6, .9), M(0x14161c, 0, { metalness: .6, roughness: .3 })); motor.position.set(0, .9, -4.9);
  const cowl = new THREE.Mesh(new THREE.BoxGeometry(.95, .25, .95), M(SKY, 1)); cowl.position.set(0, 1.75, -4.9);
  boat.add(keel, hull, stripe, deck, glass, motor, cowl);
  // wake: two foam ribbons + a center churn (shared additive sprite, no particles flood)
  const foam = (x, rot) => { const w = sprite(STREAK, 0xcfeff5, 1.3, 30, .35); w.material.blending = THREE.NormalBlending; w.position.set(x, -.3, -19); w.rotation.y = Math.PI + rot; boat.add(w); return w; };
  boat.userData.wake = [foam(-2.5, -.12), foam(2.5, .12), (() => { const c = sprite(ORB, 0xffffff, 5, 12, .8); c.position.set(0, -.2, -8); boat.add(c); return c; })()];
  scene.add(boat); boat.visible = false; }
// clouds for the overview descent (flat soft sprites, one shared texture)
const cover = []; const clouds = new THREE.Group(); scene.add(clouds); clouds.visible = false;
for (let i = 0; i < 26; i++) { const c = sprite(ORB, 0xffffff, 90 + Math.random() * 90, 60 + Math.random() * 60, .8); c.material.blending = THREE.NormalBlending; c.position.set((Math.random() - .5) * 360, 150 + Math.random() * 60, -80 + (Math.random() - .5) * 280); clouds.add(c); }
for (let i = 0; i < 9; i++) { const c = sprite(ORB, 0xf4f8ff, 260, 200, .95); c.material.blending = THREE.NormalBlending; c.position.set((i % 3 - 1) * 110, 172 + i * 4, 60 + ((i / 3) | 0) * 60 - 60); clouds.add(c); cover.push(c); } // cover layer the camera dives into
const deepSea = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x0b5f80 })); deepSea.position.y = -1.2; clouds.add(deepSea);

// ===== isometric arena: muted dark floor so FX pop =====
const ARENA = 40;
const keep = new Set([ocean, pts, sky, zayn, boat, clouds]); const decor = scene.children.filter(o => !o.isLight && !keep.has(o));
const floorTex = canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#4a4b4f'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${Math.random() * .05})`; x.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 18, 3 + Math.random() * 18); }
  x.strokeStyle = 'rgba(77,184,255,.08)'; x.lineWidth = 2; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } });
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(6, 6);
const arena = new THREE.Group();
// ambient dust motes drifting over the arena floor (one Points draw)
const DUSTN = 260, dustPos = new Float32Array(DUSTN * 3); for (let i = 0; i < DUSTN; i++) { dustPos[i * 3] = (Math.random() - .5) * 110; dustPos[i * 3 + 1] = .5 + Math.random() * 6; dustPos[i * 3 + 2] = (Math.random() - .5) * 110; }
const dustG = new THREE.BufferGeometry(); dustG.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustG, new THREE.PointsMaterial({ size: .35, color: 0xd8d2c0, transparent: true, opacity: .35, depthWrite: false })); dust.frustumCulled = false;
let floorM, edgeM, tower;
{ const f = new THREE.Mesh(new THREE.CircleGeometry(ARENA + 6, 64), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 1 })); f.rotation.x = -Math.PI / 2; f.position.y = .32; arena.add(f); floorM = f.material;
  const edge = new THREE.Mesh(new THREE.TorusGeometry(ARENA + 1, .25, 6, 96), glow(SKY)); edge.rotation.x = Math.PI / 2; edge.position.y = .4; edge.material.opacity = .5; arena.add(edge); edgeM = edge.material;
  tower = new THREE.Group(); const tr = new THREE.Mesh(new THREE.TorusGeometry(5, .15, 6, 48), glow(SKY)); tr.rotation.x = Math.PI / 2; tr.position.y = .45;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.45, .8, 12, 6), new THREE.MeshStandardMaterial({ color: 0x1b2230, emissive: SKY, emissiveIntensity: .25 })); pole.position.y = 6;
  const tcore = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), M(SKY, 3.5)); tcore.position.y = 12.8; const tglow = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 8), glow(SKY)); tglow.material.opacity = .25; tglow.position.y = 12.8; tower.add(tr, pole, tcore, tglow); tower.userData.core = tcore; tower.position.set(0, 0, -9); tower.visible = false; arena.add(tower); }
arena.add(dust); arena.visible = false; scene.add(arena);
// ===== logo maps (circular arena deprecated). Land + walkable A→B path are SDF shapes; Static pours out of the canopy, never the open sea =====
const segD = (x, z, a, b) => { const ax = b[0] - a[0], az = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * ax + (z - a[1]) * az) / (ax * ax + az * az || 1))); return Math.hypot(x - a[0] - ax * t, z - a[1] - az * t); };
const CAP = (ax, az, bx, bz, r, o = {}) => ({ t: 'cap', a: [ax, az], b: [bx, bz], r, ...o }), BOX = (cx, cz, h, rot, rr = 4, o = {}) => ({ t: 'box', c: [cx, cz], h, rot, rr, ...o });
function shapeD(sh, x, z, g = 0) { if (sh.t === 'cap') return segD(x, z, sh.a, sh.b) - sh.r - g;
  const c = Math.cos(sh.rot), sn = Math.sin(sh.rot), dx = x - sh.c[0], dz = z - sh.c[1], lx = Math.abs(dx * c + dz * sn) - sh.h + sh.rr, lz = Math.abs(-dx * sn + dz * c) - sh.h + sh.rr;
  return Math.hypot(Math.max(lx, 0), Math.max(lz, 0)) + Math.min(Math.max(lx, lz), 0) - sh.rr - g; }
function outline(sh, g = 0) { const pts = [];
  if (sh.t === 'cap') { const dx = sh.b[0] - sh.a[0], dz = sh.b[1] - sh.a[1], an = Math.atan2(dz, dx), R = sh.r + g;
    for (let i = 0; i <= 16; i++) { const t = an + Math.PI / 2 + i / 16 * Math.PI; pts.push(new THREE.Vector2(sh.a[0] + Math.cos(t) * R, -(sh.a[1] + Math.sin(t) * R))); }
    for (let i = 0; i <= 16; i++) { const t = an - Math.PI / 2 + i / 16 * Math.PI; pts.push(new THREE.Vector2(sh.b[0] + Math.cos(t) * R, -(sh.b[1] + Math.sin(t) * R))); } }
  else { const h = sh.h - sh.rr, R = sh.rr + g, c = Math.cos(sh.rot), sn = Math.sin(sh.rot);
    [[1, 1, 0], [-1, 1, 1], [-1, -1, 2], [1, -1, 3]].forEach(([qx, qz, k]) => { for (let i = 0; i <= 6; i++) { const t = k * Math.PI / 2 + i / 6 * Math.PI / 2, lx = qx * h + Math.cos(t) * R, lz = qz * h + Math.sin(t) * R; pts.push(new THREE.Vector2(sh.c[0] + lx * c - lz * sn, -(sh.c[1] + lx * sn + lz * c))); } }); }
  return new THREE.ShapeGeometry(new THREE.Shape(pts)).rotateX(-Math.PI / 2); }
const rp = (t, n) => Array(n).fill(t), mx = w => w.sort(() => Math.random() - .5);
const MAPS = {
  hertzflow: { name: 'HERTZFLOW', sub: 'The H mark · left → right', water: 0x0c3a56, reef: 0x26b5ad, sand: 0xd9c89c, ground: 0x2a4224, path: 0x4a4436, fog: 0x0a1c28, canopy: [0x2f7a34, 0x3c8c38, 0x24602b, 0x4a9a3e],
    land: [CAP(-169, 0, -169, 0, 21, { sparse: 1 }), CAP(-105, -37, -105, 36, 21), CAP(-37, -61, -37, 95, 22), CAP(42, -99, 42, 63, 22), CAP(-37, -6, 42, -6, 14), CAP(111, -37, 111, 36, 21, { dark: 1 }), CAP(175, 0, 175, 0, 21, { sparse: 1 })],
    path: [[-182, 0, -160, 0, 10, 0], [-160, 0, -105, 50, 4.5, 1], [-105, 50, -105, -50, 9, 1], [-105, -50, -37, -75, 4.5, 2], [-37, -75, -37, -6, 9, 2], [-37, -6, 42, -6, 10, 2], [42, -6, 42, 70, 9, 2], [42, 70, 111, 50, 4.5, 3], [111, 50, 111, -50, 7, 3], [111, -50, 166, -6, 4.5, 4], [166, -6, 178, 2, 12, 4]],
    bars: [[-160, 0, -105, 50], [-105, -50, -37, -75], [42, 70, 111, 50], [111, -50, 166, -6]],
    start: [-178, 0], trig: [null, [-106, 42], [-37, -68], [110, 42], [164, -6]], gate: [178, 1],
    sections: [
      { name: 'SHORE DROP', obj: 'Clear the drop zone', line: 'Warden: "Boat\'s gone. Crabs in the trees — clear the sand."', waves: () => [mx(rp('crab', 14)), mx([...rp('crab', 16), ...rp('wick', 4)])] },
      { name: 'LEFT PILL', obj: 'Push up the corridor', line: 'Warden: "Canopy walls both sides. They\'ll come out of the leaves."', waves: () => [mx([...rp('crab', 26), ...rp('wick', 6)]), mx([...rp('crab', 30), ...rp('wick', 12)])] },
      { name: 'H BRIDGE', obj: 'Break the Brute on the crossbar', boss: [2, -6], line: 'Brute: "…LIQUIDATE…"', waves: () => [mx([...rp('crab', 28), ...rp('wick', 12)]), ['brute', ...mx([...rp('crab', 30), ...rp('wick', 12)])]] },
      { name: 'RIGHT PILL', obj: 'Hold the choke', line: 'Warden: "Tight and dark. Don\'t get pinned."', waves: () => [mx([...rp('crab', 36), ...rp('wick', 14)]), mx([...rp('crab', 42), ...rp('wick', 20)])] },
      { name: 'EXTRACT GATE', obj: 'Light the gate', hold: 10, line: 'Warden: "Gate tower\'s right there. Hold it and we\'re out."', waves: () => [mx([...rp('crab', 24), ...rp('wick', 10)])] } ] },
  binance: { name: 'BINANCE SIEGE', sub: 'Storm diamond · outer L\'s → core', water: 0x06262c, reef: 0x1f8a86, sand: 0xbfae86, ground: 0x23361e, path: 0x34312b, fog: 0x060d12, canopy: [0x2b6a2e, 0x376f2a, 0x1f4f22, 0x46803a], storm: 1,
    land: [BOX(-75, 0, 26, Math.PI / 4), BOX(0, -75, 26, Math.PI / 4), BOX(75, 0, 26, Math.PI / 4), BOX(0, 75, 26, Math.PI / 4), BOX(0, 0, 22, Math.PI / 4)],
    path: [[-104, 0, -75, 0, 11, 0], [-75, 0, -75, 0, 12, 0], [-75, 0, 0, -75, 4.5, 1], [0, -75, 0, -75, 12, 1], [0, -75, 75, 0, 4.5, 2], [75, 0, 75, 0, 13, 2], [75, 0, 0, 75, 4.5, 3], [0, 75, 0, 75, 12, 3], [0, 75, 0, 0, 4.5, 4], [0, 0, 0, 0, 14, 4]],
    bars: [[-75, 0, 0, -75], [0, -75, 75, 0], [75, 0, 0, 75], [0, 75, 0, 0]],
    start: [-102, 0], trig: [null, [-16, -59], [59, -16], [16, 59], [0, 26]], gate: [0, 0],
    sections: [
      { name: 'WEST DOCKS', obj: 'Take the docks', line: 'Warden: "Storm\'s on top of us. Move."', waves: () => [mx(rp('crab', 18)), mx([...rp('crab', 20), ...rp('wick', 6)])] },
      { name: 'NORTH RIDGE', obj: 'Clear the ridge', line: 'Warden: "Fires everywhere. Watch the treeline."', waves: () => [mx([...rp('crab', 28), ...rp('wick', 10)]), mx([...rp('crab', 32), ...rp('wick', 14)])] },
      { name: 'EAST FORT', obj: 'Break the Brute in the fort', boss: [75, 0], line: 'Brute: "…LIQUIDATE…"', waves: () => [mx([...rp('crab', 30), ...rp('wick', 12)]), ['brute', ...mx([...rp('crab', 30), ...rp('wick', 14)])]] },
      { name: 'SOUTH WALL', obj: 'Hold the wall', line: 'Warden: "Last stretch before the core."', waves: () => [mx([...rp('crab', 38), ...rp('wick', 16)]), mx([...rp('crab', 44), ...rp('wick', 22)])] },
      { name: 'DIAMOND CORE', obj: 'Light the core', hold: 12, boss: [0, -8], line: 'Warden: "That\'s the heart of it. Light it up."', waves: () => [['brute', ...mx([...rp('crab', 30), ...rp('wick', 14)])]] } ] },
};
let MAP = MAPS.hertzflow, MAPID = 'hertzflow', PATHS = [];
const landD = (x, z) => { let d = 1e9; for (const sh of MAP.land) d = Math.min(d, shapeD(sh, x, z)); for (const b of MAP.bars) d = Math.min(d, segD(x, z, [b[0], b[1]], [b[2], b[3]]) - 5.5); return d; };
const pathD = (x, z, open = 99) => { let d = 1e9; for (const q of PATHS) if (q[5] <= open) d = Math.min(d, segD(x, z, [q[0], q[1]], [q[2], q[3]]) - q[4]); return d; };
function clampTo(p, fn, lim) { for (let k = 0; k < 3; k++) { const d = fn(p.x, p.z); if (d <= lim) return; const e = .3, gx = fn(p.x + e, p.z) - fn(p.x - e, p.z), gz = fn(p.x, p.z + e) - fn(p.x, p.z - e), gl = Math.hypot(gx, gz) || 1; p.x -= gx / gl * (d - lim + .01); p.z -= gz / gl * (d - lim + .01); } }
function landSpawn(ang) { const zp = zayn.position; // canopy edge first (land, off-path), any land as fallback — never open water
  for (let k = 0; k < 28; k++) { const a = (ang ?? Math.random() * 6.28) + (Math.random() - .5) * (k < 14 ? 1.2 : 6.28), d = 13 + Math.random() * 14, x = zp.x + Math.cos(a) * d, z = zp.z + Math.sin(a) * d;
    if (landD(x, z) < -2 && (k > 16 || pathD(x, z) > 1)) return new THREE.Vector3(x, 0, z); }
  const v = zp.clone(); v.x += (Math.random() - .5) * 8; v.z += (Math.random() - .5) * 8; return v; }
const mapG = new THREE.Group(); arena.add(mapG);
const beacon = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 30, 10, 1, true), glow(SKY)); b.material.opacity = .25; b.position.y = 15; const rr = new THREE.Mesh(new THREE.TorusGeometry(5, .15, 6, 40), glow(SKY)); rr.rotation.x = Math.PI / 2; rr.position.y = .5; beacon.add(b, rr); } beacon.visible = false; arena.add(beacon);
const fires = []; let canopyIM = null;
const TREE_G = mergeG([new THREE.IcosahedronGeometry(1.7, 0).scale(1, .7, 1).translate(0, 2.6, 0), new THREE.IcosahedronGeometry(1.2, 0).scale(1, .7, 1).translate(.9, 3.3, .5), new THREE.CylinderGeometry(.18, .28, 2, 5).translate(0, 1, 0)]);
function buildMap(id) { MAP = MAPS[id]; MAPID = id; SECTIONS = MAP.sections;
  PATHS = MAP.path; for (const c of [...mapG.children]) { mapG.remove(c); c.traverse(o => { if (o.geometry && o.geometry !== TREE_G && o.geometry !== PLANE) o.geometry.dispose(); }); } fires.length = 0;
  const flat = (geo, col, y, o = {}) => { const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, roughness: .95, ...o })); m.position.y = y; mapG.add(m); return m; };
  const water = flat(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), MAP.water, -.6, { roughness: .25, metalness: .3 });
  const shapes = [...MAP.land, ...MAP.bars.map(b => CAP(b[0], b[1], b[2], b[3], 5.5, { bar: 1 }))];
  for (const sh of shapes) { flat(outline(sh, 8), MAP.reef, -.45, { transparent: true, opacity: .45, roughness: .2 }); flat(outline(sh, 1.8), MAP.sand, -.15); if (!sh.bar) flat(outline(sh, 0), sh.sparse ? MAP.sand : MAP.ground, 0); }
  for (const q of PATHS) flat(outline(CAP(q[0], q[1], q[2], q[3], q[4]), 0), MAP.path, .12); // packed sand/stone trail = the walkable A→B path
  // canopy: instanced low-poly trees packed on land outside the path (the walls the Static pours from)
  const pts = []; for (const sh of MAP.land) { const bb = sh.t === 'cap' ? [Math.min(sh.a[0], sh.b[0]) - sh.r, Math.max(sh.a[0], sh.b[0]) + sh.r, Math.min(sh.a[1], sh.b[1]) - sh.r, Math.max(sh.a[1], sh.b[1]) + sh.r] : [sh.c[0] - sh.h * 1.42, sh.c[0] + sh.h * 1.42, sh.c[1] - sh.h * 1.42, sh.c[1] + sh.h * 1.42];
    const step = sh.sparse ? 6 : 2.7; for (let x = bb[0]; x < bb[1]; x += step) for (let z = bb[2]; z < bb[3]; z += step) { const px = x + (Math.random() - .5) * step * .8, pz = z + (Math.random() - .5) * step * .8;
      if (shapeD(sh, px, pz) < -1 && pathD(px, pz) > (sh.sparse ? 2 : .6)) pts.push([px, pz, sh.dark]); } }
  canopyIM = new THREE.InstancedMesh(TREE_G, new THREE.MeshStandardMaterial({ roughness: .9, flatShading: true }), pts.length); const o = new THREE.Object3D(), col = new THREE.Color();
  pts.forEach(([x, z, dk], i) => { o.position.set(x, 0, z); o.rotation.y = Math.random() * 6.28; o.scale.setScalar(.8 + Math.random() * .7); o.updateMatrix(); canopyIM.setMatrixAt(i, o.matrix);
    col.setHex(MAP.canopy[i % MAP.canopy.length]).offsetHSL((Math.random() - .5) * .04, 0, (Math.random() - .5) * .08); if (dk) col.multiplyScalar(.62); canopyIM.setColorAt(i, col); });
  mapG.add(canopyIM);
  if (MAP.storm) { // ruins + fire accents
    const ruin = M(0x2a2a2e, 0, { roughness: .9 }); for (const sh of MAP.land) for (let k = 0; k < 4; k++) { const a = k * 1.57 + .7, d = sh.h * .7, b = new THREE.Mesh(new THREE.BoxGeometry(3 + Math.random() * 3, 2 + Math.random() * 5, 3 + Math.random() * 3), ruin); b.position.set(sh.c[0] + Math.cos(a) * d, 1.5, sh.c[1] + Math.sin(a) * d); b.rotation.y = Math.random(); if (pathD(b.position.x, b.position.z) > 3) mapG.add(b); }
    for (const sh of MAP.land) for (let k = 0; k < 2; k++) { const a = Math.random() * 6.28, d = sh.h * (.5 + Math.random() * .4), f = sprite(ORB, 0xff7a1a, 7, 7, .9); f.position.set(sh.c[0] + Math.cos(a) * d, 2.5, sh.c[1] + Math.sin(a) * d); mapG.add(f); fires.push(f); } }
  tower.position.set(MAP.gate[0], 0, MAP.gate[1]); scene.fog.color.set(MAP.fog); scene.background = new THREE.Color(MAP.fog);
  $('#mission b').textContent = MAP.name; }
let lightningT = 3; const hemi = scene.children.find(o => o.isHemisphereLight);
function stepMap(dt) { if (!arena.visible) return;
  for (const [i, f] of fires.entries()) { const k = 1 + Math.sin(S.t * 13 + i * 3) * .15 + Math.sin(S.t * 31 + i) * .08; f.scale.set(7 * k, 1, 7 * k); if (Math.random() < .08) burst(f.position.clone().setY(3), [0xff7a1a, 0xffc24a], 1, 2, 3, -3); }
  if (MAP.storm) { lightningT -= dt; if (lightningT < 0) { lightningT = 4 + Math.random() * 5; $('#flash').style.transition = 'none'; $('#flash').style.opacity = .55; hemi.intensity = 3.2; sfx('boom');
      setTimeout(() => { $('#flash').style.transition = 'opacity .5s'; $('#flash').style.opacity = 0; hemi.intensity = .55; }, 90); } } }
for (const o of [arena.children[0], arena.children[1]]) o.visible = false; // old circular floor + edge ring hidden

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
function rimMaterial() { // dark charcoal body; magenta only as thin rim + glitch fringe (instanceColor/vColor = rim tint, value jitter)
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .55, metalness: 0, flatShading: true });
  m.onBeforeCompile = s => { s.uniforms.uTime = U.uTime;
    s.fragmentShader = 'uniform float uTime;\n' + s.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 rimTint = diffuseColor.rgb; float hit = max(0.0, rimTint.r - 1.0);
        diffuseColor.rgb = vec3(0.075, 0.07, 0.085) * (0.85 + 0.3 * fract(rimTint.b * 7.0)) + hit * 0.35;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float rim = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 3.0);
        float n = fract(sin(dot(floor(vViewPosition.xy * 4.0) + floor(uTime * 14.0), vec2(12.9898, 78.233))) * 43758.5453);
        totalEmissiveRadiance += min(rimTint, vec3(1.0)) * (rim * 2.0 + step(0.93, n) * 0.5) + hit * 0.6;`); };
  return m; }
const SHELL = rimMaterial(); const SHELL_SOLID = rimMaterial(); SHELL_SOLID.color.set(0xff1e6a);
const STATIC = staticMaterial(); const STATIC_SOLID = staticMaterial(); STATIC_SOLID.color.set(0xd8204e); // same Static shader; solid tint for non-instanced
const STATIC_COL = new THREE.Color(0xd8204e), HIT_COL = new THREE.Color(0xffffff).multiplyScalar(3);

// ===== enemies (crabs instanced; runners/brutes share STATIC) =====
const TYPES = {
  crab: { hp: 18, sp: 6, dmg: 3, r: .9, xp: 1 },
  wick: { hp: 14, sp: 9.5, dmg: 3, r: .7, xp: 1 },
  brute: { hp: 260, sp: 3.2, dmg: 22, r: 2.2, xp: 8 },
};
const MAXC = 320;
function mergeG(list) { // tiny merge (non-indexed) so a crab part stays ONE instanced draw
  const parts = list.map(g => g.index ? g.toNonIndexed() : g), n = parts.reduce((a, g) => a + g.attributes.position.count, 0), pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  for (const g of parts) { pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); return out; }
// crab: wide flat carapace with spiked rim + raised back; claw: arm + big two-jaw pincer; 6 legs
const crabBody = new THREE.InstancedMesh(mergeG([new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.45, .55, 1.1), new THREE.CylinderGeometry(1.45, 1.2, .3, 10).scale(1, 1, .76).translate(0, -.12, 0),
  ...[-1, 1].map(sx => new THREE.ConeGeometry(.16, .55, 4).rotateZ(-sx * 1.3).translate(sx * 1.55, .05, .2)), ...[-1, 1].map(sx => new THREE.ConeGeometry(.14, .45, 4).rotateZ(-sx * 1.2).translate(sx * 1.35, .05, -.5))]), SHELL, MAXC);
const crabClaw = new THREE.InstancedMesh(mergeG([new THREE.BoxGeometry(.32, .3, .9).translate(0, 0, -.35), new THREE.SphereGeometry(.42, 8, 6).scale(1, .75, 1.1).translate(0, 0, .25),
  new THREE.ConeGeometry(.2, .85, 5).rotateX(Math.PI / 2).translate(.13, .08, .9), new THREE.ConeGeometry(.15, .7, 5).rotateX(Math.PI / 2).rotateZ(.3).translate(-.12, -.05, .82)]), SHELL, MAXC * 2);
const crabLeg = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, .12, .14).translate(.55, 0, 0).rotateZ(-.55), SHELL, MAXC * 6); crabLeg.count = 0; crabLeg.frustumCulled = false; scene.add(crabLeg);
const LEG_COL = new THREE.Color(0x8a0f2e);
for (const im of [crabBody, crabClaw]) { im.count = 0; im.frustumCulled = false; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(im); }
const crabEyes = new THREE.InstancedMesh(new THREE.SphereGeometry(.24, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe8ffff, toneMapped: false }), MAXC * 2);
const eyeGlow = new THREE.InstancedMesh(new THREE.SphereGeometry(.42, 8, 6), new THREE.MeshBasicMaterial({ color: 0x7ff6ff, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false }), MAXC * 2); eyeGlow.count = 0; eyeGlow.frustumCulled = false; scene.add(eyeGlow); crabEyes.count = 0; crabEyes.frustumCulled = false; scene.add(crabEyes);
const BRUTE_CHROME = new THREE.MeshStandardMaterial({ color: 0x2a2d34, metalness: .95, roughness: .28, emissive: 0x08090c });
const WICK_BODY = new THREE.CylinderGeometry(.42, .55, 2.4, 7), WICK_FLAME = new THREE.ConeGeometry(.22, .9, 5), WICK_LEG = new THREE.BoxGeometry(.18, 1.3, .22).translate(0, -.5, 0), WICK_BLADE = new THREE.ConeGeometry(.12, 1.3, 4);
const WICK_RED = M(0xff1a0a, 4);
const BRUTE_EYE = M(0xff1a10, 4), WHITE_EYE = new THREE.MeshBasicMaterial({ color: 0xffffff });
function makeMesh(type) {
  const g = new THREE.Group();
  if (type === 'wick') { const b = new THREE.Mesh(WICK_BODY, SHELL_SOLID); b.position.y = 1.9; b.rotation.x = .35; g.add(b); // hunched candle sprinter
    const fl = new THREE.Mesh(WICK_FLAME, WICK_RED); fl.position.set(0, 3.7, .55); fl.scale.set(1, 1.4, 1); g.add(fl);
    for (const sx of [-1, 1]) { const l = new THREE.Mesh(WICK_LEG, SHELL_SOLID); l.position.set(sx * .3, .7, 0); g.add(l); g.userData['l' + sx] = l; const a = new THREE.Mesh(WICK_BLADE, SHELL_SOLID); a.position.set(sx * .6, 2.1, .5); a.rotation.set(1.2, 0, sx * .3); g.add(a); } }
  if (type === 'brute') { const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.4, 2.2), BRUTE_CHROME); b.position.y = 2.6; g.add(b);
    const wick = new THREE.Mesh(new THREE.BoxGeometry(.5, 2.4, .5), M(0xff1a10, 3)); wick.position.y = 6; g.add(wick); const cf = new THREE.Mesh(new THREE.ConeGeometry(.35, .9, 6), glow(0xff3a10)); cf.position.y = 7.6; g.add(cf);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(2.66, .25, 2.26), M(0xff1a10, 2.5)); seam.position.y = 3.4; g.add(seam);
    for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.BoxGeometry(1, 2.6, 1), BRUTE_CHROME); a.position.set(s * 1.9, 2.4, 0); g.add(a); } }
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(type === 'brute' ? .2 : .15, 6, 4), type === 'brute' ? BRUTE_EYE : WHITE_EYE); e.position.set(s * .25, type === 'brute' ? 4 : 2.1, type === 'brute' ? 1.15 : .42); g.add(e); }
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
const shieldRim = new THREE.Mesh(new THREE.TorusGeometry(3.2, .3, 6, 48), glow(0xffc83d)); shieldRim.rotation.x = Math.PI / 2; shieldRim.material.opacity = 1; shieldRim.position.y = -1.6; shieldRim.visible = false; shield.add(shieldRim);
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
  for (const e of enemies) { if (e.hp >= e.mhp) continue; const [sx, sy] = toScreen(e.pos, e.type === 'brute' ? 7 : 3.2), bw = e.type === 'brute' ? 70 : 30;
    ox.fillStyle = 'rgba(0,0,0,.7)'; ox.fillRect(sx - bw / 2 - 1, sy - 1, bw + 2, 5); ox.fillStyle = '#ff2a3a'; ox.fillRect(sx - bw / 2, sy, bw * Math.max(0, e.hp / e.mhp), 3); }
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
let SECTIONS = [
  { name: 'SHORE LANDING', obj: 'Clear the beach', floor: 0xa49c8c, edge: 0xffd08a, line: 'Warden: "Those are crabs. Ugly. Easy. Hit them."',
    waves: () => [mix(rep('crab', 24)), mix([...rep('crab', 30), ...rep('wick', 10)])] },
  { name: 'TOWER RIDGE', obj: 'Restore Signal Tower 1', floor: 0x5a7378, edge: 0x4DB8FF, hold: 15, line: 'Warden: "Stand in the ring. Keep the Tower breathing."',
    waves: () => [mix([...rep('crab', 36), ...rep('wick', 14)]), mix([...rep('crab', 44), ...rep('wick', 22)])] },
  { name: 'CRATER GATE', obj: 'Defeat the Red Candle Brute', floor: 0x8a4a38, edge: 0xff1a1a, line: 'Brute: "…LIQUIDATE…"',
    waves: () => [mix([...rep('crab', 30), ...rep('wick', 20)]), ['brute', ...mix([...rep('crab', 40), ...rep('wick', 16)])]] },
];
let WAVES = [];
const keys = {}, joy = { x: 0, y: 0 };
const banner = (t, c = '#fff') => { const b = $('#banner'); b.textContent = t; b.style.color = c; b.style.opacity = 1; clearTimeout(banner.h); banner.h = setTimeout(() => b.style.opacity = 0, 1400); };
const fade = (on) => $('#fade').style.opacity = on ? 1 : 0;
const show = (id, on) => $(id).classList.toggle('hide', !on);
const BG_DAY = new THREE.Color(0xffc49a), BG_DARK = new THREE.Color(0x0a0c12);
function setArena(on) { const zc = MODELS.zayn && MODELS.zayn.userData.combat; if (zc) zc(on); arena.visible = on; decor.forEach(o => o.visible = !on); ocean.visible = !on; scene.background = on ? new THREE.Color(MAP.fog) : BG_DAY; scene.fog.color.set(on ? MAP.fog : 0xffd2a8); scene.fog.near = on ? 70 : 90; scene.fog.far = on ? 170 : 320; hemi.intensity = on ? (MAP.storm ? .55 : .75) : 1.1; sun.intensity = on ? (MAP.storm ? .6 : 1.1) : 1.9; sky.visible = !on; }

function clearField() { enemies.forEach(e => e.mesh && scene.remove(e.mesh)); enemies.length = 0; gems.length = 0; nums.length = 0; decals.forEach(d => scene.remove(d.m)); decals.length = 0; }
function startCine() {
  $('#title').classList.remove('on'); show('#title', false); show('#cine', true); show('#hud', false); show('#end', false);
  S.mode = 'over'; S.t = 0; boat.visible = false; setArena(false); clearField(); shield.visible = false; clouds.visible = true; scene.fog.far = 2000;
  // overview flies the selected map's logo silhouette (green canopy), not the old archipelago
  buildMap(MAPID); arena.visible = true; decor.forEach(o => o.visible = false); ocean.visible = false; scene.background = new THREE.Color(MAP.fog);
  { const bb = new THREE.Box3(); mapG.children.forEach(c => { if (c.geometry && c.geometry.type !== 'PlaneGeometry') bb.expandByObject(c); }); const c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3()); S.ovC = [c.x, c.z]; S.ovR = Math.max(sz.x, sz.z); }
  $('#cineText').textContent = MAPID === 'binance' ? 'BINANCE SIEGE' : 'HERTZFLOW'; $('#cineSub').textContent = MAPID === 'binance' ? 'Storm over the diamond · land at A, break the core' : 'Drop Shore · Left Pill · H Bridge · Right Pill · Extract Gate';
}
function startBoat() { S.mode = 'cine'; S.t = 0; clouds.visible = false; setArena(false); scene.fog.far = 320; $('#cineText').textContent = 'ALMOST THERE';
  boat.visible = true; boat.position.set(0, 0, 230); boat.rotation.y = Math.PI; boat.add(zayn); zayn.position.set(0, .9, -1); zayn.rotation.set(0, 0, 0); zayn.scale.set(1, 1, 1); }
function landOnBeach() {
  if (S.mode !== 'cine') return; S.mode = 'fading'; fade(1);
  setTimeout(() => {
    boat.visible = false; boat.remove(zayn); scene.add(zayn); buildMap(MAPID); S.yaw = Math.PI; setArena(true);
    Object.assign(S, { hp: CH.hp, en: 40, score: 0, kills: 0, xp: 0, wave: 0, iframes: 0, buff: 0, spawnQ: [], waveNext: 0, cd: { wave: 0, chain: 0, roar: 0, dodge: 0 } });
    show('#cine', false); show('#hud', true);
    startSection(0, true);
  }, 1000);
}
function secHud() { const c = SECTIONS[S.sec]; $('#secName').textContent = `${S.sec + 1}/${SECTIONS.length} · ${c.name}`;
  $('#secDots').innerHTML = SECTIONS.map((_, i) => `<i class="${i < S.sec ? 'done' : i === S.sec ? 'cur' : ''}"></i>`).join('');
  $('#obj').textContent = c.hold ? `${c.obj} — hold the ring ${Math.min(c.hold, S.hold).toFixed(0)}/${c.hold}s · wave ${S.wave}/${WAVES.length}` : `${c.obj} — wave ${S.wave}/${WAVES.length}`; }
function startSection(i, fromBoat = false, jump = false) { // sections are stretches of one continuous A→B path; boat drop + retries fade in at the section's entry
  const c = SECTIONS[i]; waves.length = 0; S.sec = i; S.open = i; S.wave = 0; S.hold = 0; S.spawnQ = []; S.waveNext = 0; S.secDone = false; S.await = null; WAVES = c.waves(); beacon.visible = false;
  if (fromBoat || jump) { clearField(); S.hp = CH.hp; S.vel = new THREE.Vector3(); const p = i === 0 ? MAP.start : MAP.trig[i]; zayn.position.set(p[0], .3, p[1]); cam.position.set(p[0] + ISO.x, ISO.y, p[1] + ISO.z - 6); }
  S.iframes = 1.5; S.frenzy = 0; S.buff = 0; S.cd = { wave: 0, chain: 0, roar: 0, dodge: 0 }; if (fromBoat) Object.assign(S, { en: 40, score: 0, kills: 0, xp: 0 }); else S.en = Math.max(S.en, 40); S.hp = Math.min(CH.hp, S.hp + CH.hp * .4);
  tower.visible = !!c.hold; S.secStart = { score: S.score, kills: S.kills, xp: S.xp }; secHud();
  const go = () => { S.mode = 'play'; banner(fromBoat ? `${MAP.name} · ${CH.name}` : `${i + 1}/${SECTIONS.length} · ${c.name}`, '#4DB8FF');
    setTimeout(() => { if (S.sec === i && S.mode === 'play') { banner(c.name, '#ffc83d'); $('#line').textContent = c.line; $('#line').style.opacity = 1; setTimeout(() => $('#line').style.opacity = 0, 3200); } }, 1300);
    setTimeout(() => { if (S.sec === i && S.mode === 'play' && !S.wave) nextWave(); }, fromBoat || jump ? 2600 : 1200); };
  if (fromBoat || jump) setTimeout(() => { fade(0); go(); }, 600); else go(); }
function sectionClear() { if (S.secDone) return; S.secDone = true;
  if (S.sec >= SECTIONS.length - 1) return win();
  const n = S.sec + 1, t = MAP.trig[n]; S.open = n; S.await = n; banner(`${SECTIONS[S.sec].name} CLEARED`, '#4DB8FF'); ring(zayn.position, SKY, 30, .8, .3, .06);
  beacon.position.set(t[0], 0, t[1]); beacon.visible = true; $('#obj').textContent = `Path open — head to ${SECTIONS[n].name} ▸`; }
window.__section = i => { fade(1); S.mode = 'clear'; setTimeout(() => startSection(i, false, true), 50); };
window.__map = id => { MAPID = id; }; window.__trig = () => MAP.trig[S.await]; window.__tp = (x, z) => { zayn.position.set(x, .3, z); }; window.__gate = () => MAP.gate; window.__kill = () => [...enemies].forEach(kill);
function nextWave() {
  if (S.wave >= WAVES.length) return;
  S.spawnQ = [...WAVES[S.wave]]; S.wave++; secHud();
  banner(`WAVE ${S.wave} · ${S.spawnQ.length} STATIC`, '#ff3cac');
}
function spawn(type, ang) { const T = TYPES[type], a = ang ?? Math.random() * 6.28, r = ARENA + 2;
  const bs = type === 'brute' && SECTIONS[S.sec] && SECTIONS[S.sec].boss, e = { type, T, pos: bs ? new THREE.Vector3(bs[0], 0, bs[1]) : landSpawn(ang), hp: T.hp * (1 + (S.sec || 0) * .35 + Math.max(0, S.wave - 1) * .15), mhp: T.hp * (1 + (S.sec || 0) * .35 + Math.max(0, S.wave - 1) * .15), stun: 0, kb: new THREE.Vector3(), atk: 0, hit: 0, tel: 0, yaw: 0, mesh: type === 'crab' ? null : makeMesh(type) };
  
  if (type === 'brute') { e.mesh.scale.setScalar(1.15); banner('RED CANDLE BRUTE', '#ff2a5a'); }
  enemies.push(e); burst(e.pos.clone().setY(1), [0xff1450, 0xa24cff], 10, 5, 4);
}
function best() { const b = Math.max(+localStorage.getItem('sw_best') || 0, S.score); localStorage.setItem('sw_best', b); return b; }
function win() { addMerits(S.xp + 100); S.mode = 'end'; setTimeout(() => { show('#retry', false); tower.visible = false; $('#endT').textContent = 'MISSION COMPLETE'; $('#endT').style.color = '#4DB8FF'; $('#endS').textContent = `${MAP.name} secured · ${S.kills} Static cleared · ${S.xp} gems · score ${S.score} · best ${best()}. Next: Moonleaf Oval. +${S.xp + 100} Merits (◆ ${merits()}).`; show('#end', true); }, 900); }
function lose() { addMerits(S.xp); S.mode = 'end'; banner('LIQUIDATED', '#ff2a5a'); setTimeout(() => { $('#endT').textContent = 'LIQUIDATED'; $('#endT').style.color = '#ff2a5a'; $('#endS').textContent = `${CH.name[0] + CH.name.slice(1).toLowerCase()} went down in ${SECTIONS[S.sec].name} · ${S.kills} kills · score ${S.score} · best ${best()}. Retry the section or run the mission back.`; show('#retry', true); show('#end', true); }, 1200); }

const aimDir = () => new THREE.Vector3(Math.sin(S.yaw), 0, Math.cos(S.yaw));
function boom(p, col, r, dmg, kb = 10) { if (r > 4) sfx('boom'); // AoE explosion: flash + rings + sparks + damage
  const q = p.clone().setY(1); flash(q, col, r * .45, .18); flash(q, 0xffffff, r * .22, .1); ring(p, col, r * 1.1, .4, .5); burst(q, [col, 0xffffff, 0xffc83d], 26 + r * 4, r * 2.2, 6);
  for (const e of [...enemies]) { const d = e.pos.clone().sub(p).setY(0), l = d.length(); if (l < r + e.T.r) damage(e, dmg * (l < r * .4 ? 1.5 : 1), d.normalize().multiplyScalar(kb)); }
}
function damage(e, d, kbv) {
  if (e.hp <= 0) return; d = Math.round(d * (S.buff > 0 ? 1.5 : 1) * (.85 + Math.random() * .3)); const crit = Math.random() < .12; if (crit) d *= 2;
  e.hp -= d; e.hit = .1; if (kbv) e.kb.add(kbv); S.score += d;
  floatTxt(e.pos, String(d), crit, crit ? '#ffe14a' : '#fff');
  if (e.hp <= 0) kill(e);
}
function kill(e) { const i = enemies.indexOf(e); if (i < 0) return; if (e.type === 'brute') sfx('boom'); enemies.splice(i, 1); if (e.mesh) scene.remove(e.mesh);
  const p = e.pos.clone().setY(1.2), big = e.type === 'brute';
  burst(p, big ? [0xff1a10, 0x2a2d34, 0xffffff] : [0xff1450, 0xff5a8a], big ? 40 : (S.quiet ? 3 : 7), big ? 10 : 3, big ? 8 : 6, -2); { const d = sprite(ORB, big ? 0xff2a10 : 0xff1450, big ? 9 : 3.2, big ? 9 : 3.2, .9); d.position.set(e.pos.x, .5, e.pos.z); scene.add(d); ropes.push({ m: d, t: .3, grow: 1 }); } // static dissolve flash(p, 0xff3c6e, big ? 9 : 2.6, .22); if (big) { ring(e.pos, 0xff2a5a, 16, .6); S.shake = .6; }
  const ep = e.pos.clone(); setTimeout(() => { for (let k = 0; k < e.T.xp; k++) if (gems.length < MAXG) gems.push({ p: ep.clone().add(new THREE.Vector3((Math.random() - .5) * (big ? 4 : .6), .9, (Math.random() - .5) * (big ? 4 : .6))), v: 0, t: Math.random() * 6 }); }, 300);
  S.kills++; S.score += big ? 1000 : 50; S.en = Math.min(100, S.en + (big ? 20 : 1.5)); S.shake = Math.max(S.shake, .12); }
const waves = [], ropes = [];
function fireShot(W, f) { const g = new THREE.Group(), sz = W.size, c = W.col; let mats = [];
  const add = (m, y = 0) => { m.position.y = y; g.add(m); mats.push(m.material); return m; };
  if (W.shape === 'arc' || W.shape === 'slash') { const wide = W.shape === 'slash' ? 1.5 : 1; add(sprite(CRESCENT, c, 6.2 * sz * wide, 4.4 * sz)); add(sprite(CRESCENT, 0xffffff, 5 * sz * wide, 3.2 * sz, .9), .05); }
  else if (W.shape === 'orb') { add(sprite(ORB, c, 3.6 * sz, 3.6 * sz)); add(sprite(ORB, 0xffffff, 1.6 * sz, 1.6 * sz), .05); }
  else if (W.shape === 'bolt') { add(sprite(STREAK, c, 1.1 * sz, 5.5 * sz)); add(sprite(STREAK, 0xffffff, .5 * sz, 4 * sz), .05); }
  else if (W.shape === 'ring') { add(sprite(ORB, c, 3 * sz, 3 * sz, .7)); const t = new THREE.Mesh(new THREE.TorusGeometry(1.4 * sz, .1, 4, 28), fxMat(ORB, c).clone()); t.rotation.x = Math.PI / 2; add(t); }
  g.position.copy(zayn.position).add(f.clone().multiplyScalar(1.6)).setY(1.3); g.rotation.y = Math.atan2(f.x, f.z) + Math.PI; scene.add(g);
  waves.push({ m: g, mats, v: f.clone().multiplyScalar(W.spd), life: W.life, life0: W.life, hits: new Set(), dmg: W.dmg * (S.frenzy > 0 ? 1.25 : 1), col: c, pierce: W.pierce, r: 2 * sz, spin: W.shape === 'ring', end: W.end });
  flash(g.position, c, 1.4 * sz, .1); }
const act = {
  wave(o = {}) { S.swing = .2; const W = { ...CH.wave, ...o }, f = o.dir || aimDir(); fireShot(W, f); sfx('shot'); },
  chain() { const md = CH.chain.mode, c = CH.chain.col, f = aimDir(), zp = zayn.position.clone().setY(0), at = d => zp.clone().add(f.clone().multiplyScalar(d)); S.swing = .2; sfx('boom');
    if (md !== 'lasso') banner(CH.chain.name + '!', '#' + c.toString(16).padStart(6, '0'));
    if (md === 'slam') { const n = nearest(18), p = n ? n.pos.clone().setY(0) : at(12); S.dodgeDir = p.clone().sub(zp).normalize(); S.dodge = .16; S.iframes = .4; setTimeout(() => { boom(p, c, 9, 55, 18); ring(p, 0xffffff, 12, .35, .3, .05); S.shake = .7; sfx('boom'); }, 160); return; }
    if (md === 'orb') { fireShot({ ...CH.wave, size: 2.2, spd: 16, life: 1.3, dmg: 18, pierce: 99, end: 8 }, f); S.shake = .3; return; }
    if (md === 'fan') { for (let k = -3; k <= 3; k++) { const a = Math.atan2(f.x, f.z) + k * .14; fireShot({ ...CH.wave, dmg: 14, pierce: 4 }, new THREE.Vector3(Math.sin(a), 0, Math.cos(a))); } return; }
    if (md === 'pull') { const n = nearest(20), p = n ? n.pos.clone().setY(0) : at(12); ring(p, c, 12, .4, .3, .05); for (const e of enemies) { const d = p.clone().sub(e.pos).setY(0); if (d.length() < 13) e.kb.add(d.multiplyScalar(2.2)); } setTimeout(() => { boom(p, c, 7, 45, 6); sfx('boom'); }, 380); return; }
    if (md === 'dash') { const a = zp.clone(), b = at(16); S.dodgeDir = f.clone(); S.dodge = .2; S.iframes = .5; const st = sprite(STREAK, c, 2.2, 18); st.position.copy(a.clone().lerp(b, .5)).setY(1.2); st.rotation.y = Math.atan2(f.x, f.z); scene.add(st); ropes.push({ m: st, t: .4 });
      for (const e of [...enemies]) { const t = Math.max(0, Math.min(1, e.pos.clone().sub(a).dot(f) / 16)), q = a.clone().lerp(b, t); if (Math.hypot(e.pos.x - q.x, e.pos.z - q.z) < 2.6 + e.T.r) { damage(e, 48, f.clone().multiplyScalar(6)); burst(e.pos.clone().setY(1.2), [c, 0xffffff], 10, 9, 4); } } S.shake = .4; return; }
    if (md === 'cleave') { boom(zp, c, 8.5, 50, 20); ring(zp, 0xffffff, 10, .3, .3, .05); S.shake = .6; return; }
    if (md === 'barrage') { for (let k = 0; k < 5; k++) setTimeout(() => { const p = at(5 + k * 4); boom(p, c, 4.5, 30, 10); sfx('boom'); }, k * 90); S.shake = .5; return; }
    let best = null, bd = 24;
    for (const e of enemies) { const d = e.pos.clone().sub(zayn.position).setY(0), l = d.length(); if (l < bd && d.normalize().dot(f) > .2) { bd = l; best = e; } }
    const end = best ? best.pos.clone() : zayn.position.clone().add(f.multiplyScalar(16)); end.y = 0;
    const st = zayn.position.clone().setY(2.4), len = st.distanceTo(end.clone().setY(1.5));
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, len, 6), M(0xffd44d, 2, { transparent: true })); rope.position.copy(st).lerp(end.clone().setY(1.5), .5); rope.lookAt(end.clone().setY(1.5)); rope.rotateX(Math.PI / 2); scene.add(rope); ropes.push({ m: rope, t: .4 });
    boom(end, 0xffc83d, 7, 40, 14); ring(end, 0xff8a1e, 10, .5, 1.2);
    S.shake = .4; banner('GOLD CHAIN!', '#ffc83d'); },
  roar() { const md = CH.roar.mode, c = CH.roar.col, p = zayn.position.clone().setY(0); sfx('roar'); const hc = '#' + c.toString(16).padStart(6, '0');
    if (md !== 'shield') { S.buff = 2.5; S.shake = .7; banner(CH.roar.name + '!', hc); ring(p, c, 18, .5, .3, .05); flash(p.clone().setY(2), 0xffffff, 3, .12); S.quiet = true;
      const hitAll = (r, dmg, kb, stun) => { for (const e of [...enemies]) { const d = e.pos.clone().sub(p).setY(0); if (d.length() < r) { e.stun = stun; damage(e, dmg, d.normalize().multiplyScalar(kb)); } } };
      if (md === 'freeze') { hitAll(30, 25, 4, 3.2); const w = sprite(ORB, c, 70, 70, .5); w.position.copy(p).setY(.6); scene.add(w); ropes.push({ m: w, t: .4 }); }
      if (md === 'heal') { S.hp = Math.min(CH.hp, S.hp + 35); hitAll(16, 22, 26, 1); floatTxt(p, '+35', true, '#2ee6d0'); }
      if (md === 'volley') { for (let k = 0; k < 18; k++) { const a = k / 18 * 6.283; fireShot({ ...CH.wave, dmg: 16, pierce: 5 }, new THREE.Vector3(Math.sin(a), 0, Math.cos(a))); } }
      if (md === 'pulse') { hitAll(14, 16, 14, 1); for (const k of [1, 2]) setTimeout(() => { const q = zayn.position.clone().setY(0); ring(q, c, 16, .4, .3, .05); for (const e of [...enemies]) { const d = e.pos.clone().sub(q).setY(0); if (d.length() < 15) { e.stun = 1; damage(e, 16, d.normalize().multiplyScalar(12)); } } sfx('boom'); }, k * 260); }
      if (md === 'blink') { const f = aimDir(), q = p.clone().add(f.multiplyScalar(13)); boom(p, c, 6, 35, 14); zayn.position.set(q.x, .3, q.z); S.iframes = 1; boom(q, c, 6, 35, 14); }
      if (md === 'frenzy') { S.frenzy = 5; S.hp = Math.min(CH.hp, S.hp + 15); hitAll(10, 20, 16, .6); }
      S.quiet = false; return; } ring(p, 0x3ef2ff, 16, .45, .3, .05); ring(p, SKY, 12, .3, .3, .04); flash(p.clone().setY(2), 0xffffff, 3, .12);
    burst(p.clone().setY(1), [0xffc83d, SKY], 50, 22, 4); S.quiet = true;
    for (const e of [...enemies]) { const d = e.pos.clone().sub(p).setY(0); if (d.length() < 15) { e.stun = 2; damage(e, 30, d.normalize().multiplyScalar(22)); } } S.quiet = false;
    S.buff = 5; S.shake = .8; banner(CH.roar.name + '!', '#3ef2ff'); },
  dodge() { S.dodge = .18; S.iframes = .45; const ix = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + joy.x, iz = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0) + joy.y;
    S.dodgeDir = Math.hypot(ix, iz) > .1 ? new THREE.Vector3(ix, 0, iz).normalize() : aimDir(); ring(zayn.position, CH.wave.col, 5, .25, .3, .06); flash(zayn.position.clone().setY(1.5), 0xffffff, 1.5, .1); sfx('whoosh'); S.shake = Math.max(S.shake, .15); },
};
function use(p) { if (S.mode !== 'play' || S.cd[p] > 0) return; if (COST[p] && S.en < COST[p]) { banner('NEED FLOW ENERGY', '#9df'); return; }
  S.en -= COST[p] || 0; S.cd[p] = CD[p] * (p === 'wave' && S.frenzy > 0 ? .55 : 1); act[p](); }

// ===== input: WASD/stick move, mouse aims, auto-fire at nearest when no mouse =====
addEventListener('keydown', e => { keys[e.code] = true; const m = { KeyQ: 'wave', KeyE: 'chain', KeyR: 'roar', Space: 'dodge' }[e.code]; if (m) { use(m); e.preventDefault(); } if (S.mode === 'over' && (e.code === 'Enter' || e.code === 'Escape')) { startBoat(); } else if (S.mode === 'cine' && (e.code === 'Enter' || e.code === 'Escape')) landOnBeach(); });
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
const STARTERS = ['lyra', 'hertzling', 'chado'], UNLOCK_COST = { kael: 150, warden: 200, bankyo: 350, zayn: 500, hero: 800 }; // Zayn/Hero/Bankyo are the strong kits
const ALL = new URLSearchParams(location.search).has('all');
const merits = () => +localStorage.getItem('sw_merits') || 0, owned = () => new Set([...STARTERS, ...JSON.parse(localStorage.getItem('sw_owned') || '[]')]);
const isOwned = id => ALL || owned().has(id);
function addMerits(n) { localStorage.setItem('sw_merits', merits() + n); }
function renderCards() {
$('.cards').innerHTML = Object.entries(CHARS).sort(([a], [b]) => isOwned(b) - isOwned(a)).map(([id, c]) => isOwned(id) ? `<div class="card pick" data-c="${id}" style="--cc:${c.col}"><div class="port" style="background:radial-gradient(circle at 35% 30%,${c.col},#0a1220 75%)">${c.name[0]}</div><h3>${c.name}</h3><small>${c.title}</small><p>${c.blurb}</p><div class="kit"><span>${c.chain.name}</span><span>${c.roar.name}</span></div><b>PLAY</b></div>` : `<div class="card locked" data-c="${id}" style="--cc:${c.col}"><div class="port">🔒</div><h3>${c.name}</h3><small>${c.title}</small><p>${c.blurb}</p><button class="unlock" data-c="${id}" ${merits() < UNLOCK_COST[id] ? 'disabled' : ''}>UNLOCK · ${UNLOCK_COST[id]} ◆</button></div>`).join('');
$('#merits') && ($('#merits').textContent = `◆ ${merits()} Merits`);
document.querySelectorAll('.card.pick').forEach(el => el.onclick = () => { setChar(el.dataset.c); fade(1); setTimeout(() => { startCine(); fade(0); }, 600); });
document.querySelectorAll('.unlock').forEach(el => el.onclick = e => { e.stopPropagation(); const id = el.dataset.c, cost = UNLOCK_COST[id]; if (merits() < cost) return;
  localStorage.setItem('sw_merits', merits() - cost); localStorage.setItem('sw_owned', JSON.stringify([...owned(), id].filter(x => !STARTERS.includes(x)))); renderCards(); }); }
renderCards();
document.querySelectorAll('#modes button[data-m]').forEach(b => b.onclick = () => { MAPID = b.dataset.m; document.querySelectorAll('#modes button').forEach(x => x.classList.toggle('on', x === b)); });
$('.tag').textContent += (+localStorage.getItem('sw_best') ? `  ·  Best score ${localStorage.getItem('sw_best')}` : '');
window.__merits = n => { addMerits(n); renderCards(); };
window.__pick = id => { setChar(id); startCine(); };
setChar('lyra'); if ('ontouchstart' in window || navigator.maxTouchPoints > 0) document.body.classList.add('touch');
$('#skip').onclick = () => { if (S.mode === 'over') startBoat(); landOnBeach(); };
$('#retry').onclick = () => { show('#end', false); fade(1); S.mode = 'clear'; const s0 = S.secStart; setTimeout(() => { Object.assign(S, s0); startSection(S.sec, false, true); }, 600); };
$('#again').onclick = () => { show('#end', false); fade(1); setTimeout(() => { startCine(); fade(0); }, 600); };
$('#menu').onclick = () => { show('#end', false); show('#hud', false); show('#title', true); renderCards(); S.mode = 'title'; setArena(false); clearField(); };

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
  else if (S.mode === 'over' || S.mode === 'overfade') { // aerial overview: archipelago reads as the HertzFlow mark, camera dives through clouds
    const k = Math.min(1, S.t / 5), e = k * k * (3 - 2 * k); cam.fov = 55; cam.updateProjectionMatrix();
    { const [ox, oz] = S.ovC || [0, 0], R = Math.max(120, S.ovR || 200); cam.position.set(ox + Math.sin(S.t * .15) * 15, R * 1.6 - e * R * .7, oz + R * .35 - e * R * .1); cam.lookAt(ox, 0, oz + e * 10); } const cv = Math.max(0, (k - .6) / .4); cover.forEach(c => c.material.opacity = cv * .95);
    if (S.t > 4.4 && S.mode === 'over') { S.mode = 'overfade'; fade(1); setTimeout(() => { if (S.mode === 'overfade') { startBoat(); fade(0); } }, 700); }
  }
  else if (S.mode === 'cine' || S.mode === 'fading') { boat.userData.wake.forEach((w, i) => { w.material.opacity = (i < 2 ? .3 : .45) + Math.sin(S.t * 9 + i) * .08; });
    const k = Math.min(1, S.t / 13); boat.position.z = 230 - k * 190; boat.position.y = Math.sin(S.t * 6) * .25; boat.rotation.z = Math.sin(S.t * 2) * .06; boat.rotation.x = -.06;
    burst(new THREE.Vector3(boat.position.x + (Math.random() - .5) * 3, .2, boat.position.z + 5), [0xffffff, 0xbff6ff], 2, 3, 2, 8);
    $('#cineSub').textContent = `Ember Dot · ${Math.max(0, (boat.position.z - 34) / 500).toFixed(2)} km`;
    const sw = Math.sin(S.t * .35) * 6;
    cam.position.set(boat.position.x + sw, 9 + Math.sin(S.t) * .4, boat.position.z + 19); cam.lookAt(boat.position.x, 3, boat.position.z - 20);
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
      const top = CH.speed * (S.frenzy > 0 ? 1.3 : 1); if (!S.vel) S.vel = new THREE.Vector3();
      if (S.dodge > 0) { S.dodge -= dt; S.vel.copy(S.dodgeDir).multiplyScalar(58 * (.4 + S.dodge / .18 * .6)); burst(zayn.position.clone().setY(1.5), [CH.wave.col, 0xffffff], 4, 2, 1, 0); }
      else { const want = mv.clone().multiplyScalar(top * ml), k = 1 - Math.exp(-dt * (ml > .1 ? 22 : 30)); S.vel.lerp(want, k); } // snappy accel, near-instant stop
      zayn.position.addScaledVector(S.vel, dt); const spd = S.vel.length(); S.stride = (S.stride || 0) + spd * dt * .55;
      const hop = S.dodge > 0 ? Math.sin((1 - S.dodge / .18) * Math.PI) * 1.4 : Math.abs(Math.sin(S.stride * Math.PI)) * Math.min(1, spd / top) * .55; zayn.position.y = .3 + hop;
      const lean = Math.min(.28, spd / top * .22); zayn.rotation.x = lean * Math.cos(Math.atan2(S.vel.x, S.vel.z) - zayn.rotation.y) * (S.dodge > 0 ? 2 : 1);
      zayn.scale.set(1, 1 + (S.land = Math.max(0, (S.land || 0) - dt * 6)) * -.18 + (S.dodge > 0 ? .1 : 0), 1); if (hop < .03 && spd > 3 && !S.wasDown) { S.land = .6; } S.wasDown = hop < .03; clampTo(zayn.position, (x, z) => pathD(x, z, S.open ?? 0), 0);
      let dy = S.yaw - zayn.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); zayn.rotation.y += dy * Math.min(1, dt * 40); // snap-to-face
      const ud = zayn.userData, w = spd > 2 ? Math.sin(S.stride * Math.PI) * .9 : 0; ud.legL.rotation.x = w; ud.legR.rotation.x = -w; ud.tail.rotation.z = Math.sin(S.t * 3) * .25; ud.core.rotation.y += dt * 3; tower.userData.core.rotation.y += dt * 1.5;
      S.swing = Math.max(0, S.swing - dt); ud.armR.rotation.x = S.swing > 0 ? -2.2 + (.2 - S.swing) * 16 : -.2 + w * .3;
      for (const k in S.cd) S.cd[k] = Math.max(0, S.cd[k] - dt); S.iframes -= dt; S.buff -= dt; S.frenzy = (S.frenzy || 0) - dt; S.en = Math.min(100, S.en + dt * 3);
      // auto-fire WAVE (kite + shoot); mouse hold / Q also fires
      if (mouse.down || (!mouse.on && nearest(24)) || (mouse.on && nearest(26))) use('wave');
      if (S.spawnQ.length) { S.spawnT -= dt; if (S.spawnT <= 0) { const a = Math.random() * 6.28, n = Math.min(S.spawnQ.length, 4 + S.wave * 2); for (let k = 0; k < n; k++) spawn(S.spawnQ.shift(), a + (Math.random() - .5) * .9); S.spawnT = 1.4 - S.wave * .2; } }
      else if (S.wave && S.wave >= WAVES.length) { const c = SECTIONS[S.sec];
        if (c.hold && S.hold < c.hold) { if (enemies.length < 10) S.spawnQ.push(...rep('crab', 8)); } // keep pressure until the tower is restored
        else if (!enemies.length) { S.waveNext += dt; if (S.waveNext > 1) sectionClear(); } }
      else if (!enemies.length && S.wave) { S.waveNext += dt; if (S.waveNext > 1.5) { S.waveNext = 0; nextWave(); } }
      if (S.await != null) { const t = MAP.trig[S.await]; if (Math.hypot(zayn.position.x - t[0], zayn.position.z - t[1]) < 8) startSection(S.await); }
      { const c = SECTIONS[S.sec]; if (c.hold && S.hold < c.hold) { if (Math.hypot(zayn.position.x - tower.position.x, zayn.position.z - tower.position.z) < 5) { S.hold += dt; if (S.hold >= c.hold) { S.spawnQ.length = 0; banner('GATE LIT', '#4DB8FF'); ring(tower.position, SKY, 40, 1, .4, .08); } } if ((S.t * 4 | 0) !== (S.lt | 0)) { S.lt = S.t * 4; secHud(); } } }
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
      for (let k = 1; k <= 5; k++) { const o = enemies[(i + k * 7) % enemies.length]; if (o === e) continue; const dx = e.pos.x - o.pos.x, dz = e.pos.z - o.pos.z, dd = dx * dx + dz * dz, rr = e.type === 'crab' && o.type === 'crab' ? 4.0 : (e.T.r + o.T.r) * 1.1; if (dd < rr * rr && dd > 1e-4) { const s = (rr - Math.sqrt(dd)) * .5 / Math.sqrt(dd); e.pos.x += dx * s; e.pos.z += dz * s; } }
      const px0 = e.pos.x, pz0 = e.pos.z; e.pos.addScaledVector(e.kb, dt); clampTo(e.pos, landD, -1);
      if (e.type !== 'brute') { const mv = Math.hypot(e.pos.x - (e.lx ?? px0), e.pos.z - (e.lz ?? pz0)), far = Math.hypot(e.pos.x - zayn.position.x, e.pos.z - zayn.position.z) > 7; e.stuckT = far && mv < e.T.sp * dt * .25 ? (e.stuckT || 0) + dt : 0; e.lx = e.pos.x; e.lz = e.pos.z;
        if (e.stuckT > 2.5) { e.stuckT = 0; e.pos.copy(landSpawn()); } } // shoreline-stuck Static re-emerge from canopy near the player e.kb.multiplyScalar(Math.pow(.02, dt)); e.hit -= dt;
      if (e.mesh) { const pulse = e.tel > 0 ? 1 + Math.sin(S.t * 40) * .08 : 1; e.mesh.position.set(e.pos.x, e.type === 'wick' ? Math.abs(Math.sin(S.t * 16 + i)) * .35 : 0, e.pos.z); if (e.type === 'wick') { const ph = Math.sin(S.t * 16 + i) * .9; e.mesh.userData['l-1'].rotation.x = ph; e.mesh.userData.l1.rotation.x = -ph; } e.mesh.rotation.y = e.yaw + (e.stun > 0 ? S.t * 8 : 0); e.mesh.scale.setScalar((e.type === 'brute' ? 1.15 : 1) * (e.hit > 0 ? 1.25 : pulse)); } }
    // write crab instances
    let c = 0;
    for (const e of enemies) { if (e.type !== 'crab') continue; const s = e.hit > 0 ? 1.3 : 1, bob = Math.abs(Math.sin(S.t * 14 + c)) * .15;
      o3.position.set(e.pos.x, .8 + bob, e.pos.z); o3.rotation.set(0, e.yaw + (e.stun > 0 ? S.t * 8 : 0), 0); o3.scale.setScalar(s); o3.updateMatrix(); crabBody.setMatrixAt(c, o3.matrix); if (!e.jc) { e.jc = new THREE.Color().setHSL(.91 + (Math.random() - .5) * .08, 1, .5 * (.9 + Math.random() * .2)); } crabBody.setColorAt(c, e.hit > 0 ? HIT_COL : e.jc);
      for (const sx of [-1, 1]) { o3.position.set(e.pos.x + Math.cos(e.yaw) * sx * 1.2, .9, e.pos.z - Math.sin(e.yaw) * sx * 1.2); o3.position.addScaledVector(v3.set(Math.sin(e.yaw), 0, Math.cos(e.yaw)), .9 + Math.sin(S.t * 10 + c) * .25); o3.rotation.set(0, e.yaw - sx * .35, 0); o3.scale.setScalar(1.25); o3.updateMatrix();
        const j = c * 2 + (sx > 0 ? 1 : 0); crabClaw.setMatrixAt(j, o3.matrix); crabClaw.setColorAt(j, e.hit > 0 ? HIT_COL : e.jc);
        o3.position.set(e.pos.x + Math.cos(e.yaw) * sx * .3 + Math.sin(e.yaw) * .85, 1.3 + bob, e.pos.z - Math.sin(e.yaw) * sx * .3 + Math.cos(e.yaw) * .85); o3.scale.setScalar(1); o3.updateMatrix(); crabEyes.setMatrixAt(j, o3.matrix); eyeGlow.setMatrixAt(j, o3.matrix); }
      const cy = Math.cos(e.yaw), sy = Math.sin(e.yaw);
      for (let L = 0; L < 6; L++) { const sx = L < 3 ? -1 : 1, row = (L % 3) - 1, ph = Math.sin(S.t * 22 + c + L * 2.1) * .35;
        o3.position.set(e.pos.x - cy * sx * .95 * -1 + sy * row * .55, .6, e.pos.z + sy * sx * .95 * -1 + cy * row * .55);
        o3.rotation.set(0, e.yaw + (sx > 0 ? 0 : Math.PI) + row * .45 + ph, 0); o3.scale.setScalar(1); o3.updateMatrix(); crabLeg.setMatrixAt(c * 6 + L, o3.matrix); crabLeg.setColorAt(c * 6 + L, e.jc); }
      c++; }
    crabBody.count = c; crabClaw.count = crabEyes.count = eyeGlow.count = c * 2; eyeGlow.instanceMatrix.needsUpdate = true; crabLeg.count = c * 6; crabLeg.instanceMatrix.needsUpdate = true; if (crabLeg.instanceColor) crabLeg.instanceColor.needsUpdate = true;
    for (const im of [crabBody, crabClaw, crabEyes]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; }
    // wave projectiles: pierce + mini explosion on hit
    for (let i = waves.length - 1; i >= 0; i--) { const w = waves[i]; w.life -= dt; w.m.position.addScaledVector(w.v, dt); const k = w.life / w.life0; for (const m of w.mats) m.opacity = Math.min(1, k * 3); w.m.scale.setScalar(1 + (1 - k) * .35); if (w.spin) w.m.rotation.y += dt * 9;
      if (Math.random() < .2) burst(w.m.position, [w.col], 1, 1.5, .5, 0);
      for (const e of enemies) if (!w.hits.has(e) && Math.hypot(e.pos.x - w.m.position.x, e.pos.z - w.m.position.z) < e.T.r + w.r) { w.hits.add(e); const p = e.pos.clone(); sfx('hit'); damage(e, w.dmg, w.v.clone().normalize().multiplyScalar(8)); burst(p.setY(1.2), [w.col, 0xffffff], 4, 7, 3); flash(p, 0xffffff, 1.2, .07); if (w.hits.size >= w.pierce) w.life = 0; }
      if (w.life <= 0) { if (w.end) boom(w.m.position.clone().setY(0), w.col, w.end, 30, 14); else { ring(w.m.position.clone().setY(0), w.col, 2.5, .2, .4, .08); } scene.remove(w.m); for (const m of w.mats) m.dispose(); waves.splice(i, 1); } }
    for (let i = ropes.length - 1; i >= 0; i--) { const r = ropes[i]; r.t -= dt; r.m.material.opacity = r.t * 2.5; if (r.grow) r.m.scale.multiplyScalar(1 - dt * 2.5); if (r.t <= 0) { scene.remove(r.m); r.m.material.dispose(); if (r.m.geometry !== PLANE) r.m.geometry.dispose(); ropes.splice(i, 1); } }
    for (let i = decals.length - 1; i >= 0; i--) { const d = decals[i]; d.t += dt; d.m.material.opacity = .15 + .3 * Math.abs(Math.sin(d.t * 18)); if (d.t > d.life) decals.splice(i, 1); }
    // gems: bob, magnet, collect
    let g = 0;
    for (let i = gems.length - 1; i >= 0; i--) { const gm = gems[i]; gm.t += dt; const dx = zp.x - gm.p.x, dz = zp.z - gm.p.z, d = Math.hypot(dx, dz);
      if (d < 7 || gm.v) { gm.v = Math.min(40, (gm.v || 8) + dt * 60); gm.p.x += dx / d * gm.v * dt; gm.p.z += dz / d * gm.v * dt; }
      if (d < 1.4 && S.mode === 'play') { gems.splice(i, 1); S.xp++; S.score += 10; sfx('gem'); S.en = Math.min(100, S.en + 1.2); continue; } }
    for (const gm of gems) { o3.position.set(gm.p.x, .9 + Math.sin(gm.t * 4) * .2, gm.p.z); o3.rotation.set(0, gm.t * 3, 0); o3.scale.setScalar(1); o3.updateMatrix(); gemIM.setMatrixAt(g, o3.matrix); gemGlowPos[g * 3] = o3.position.x; gemGlowPos[g * 3 + 1] = o3.position.y; gemGlowPos[g * 3 + 2] = o3.position.z; g++; }
    gemIM.count = g; gemIM.instanceMatrix.needsUpdate = true; gemGlow.geometry.setDrawRange(0, g); gemGlow.material.opacity = .65 + Math.sin(S.t * 6) * .3; gemGlow.geometry.attributes.position.needsUpdate = true;
    // shield bubble (dodge i-frames / ROAR buff)
    const sh = S.iframes > 0 || S.buff > 0; shield.visible = sh && S.mode === 'play'; if (sh) { shield.position.set(zp.x, 2.4, zp.z); shield.scale.setScalar(1 + Math.sin(S.t * 10) * .04); shield.material.opacity = S.iframes > 0 ? .38 : .3; shieldRim.rotation.z += dt * 2; }
    // fixed isometric follow camera
    const narrow = cam.aspect < 1; if (cam.fov !== (narrow ? 55 : 42)) { cam.fov = narrow ? 55 : 42; cam.updateProjectionMatrix(); }
    v3.copy(zp).add(ISO); v3.z -= 6; cam.position.lerp(v3, Math.min(1, dt * 6)); S.shake = Math.max(0, S.shake - dt);
    if (S.shake) cam.position.add(new THREE.Vector3((Math.random() - .5), 0, (Math.random() - .5)).multiplyScalar(S.shake * 1.6));
    cam.lookAt(cam.position.x - ISO.x, zp.y, cam.position.z - ISO.z);
    $('#hpF').style.width = (S.hp / CH.hp * 100) + '%'; $('#enF').style.width = S.en + '%'; $('#score').textContent = `${S.score}  ·  ◆ ${S.xp}  ·  ☠ ${S.kills}`;
    document.querySelectorAll('.p').forEach(b => { const p = b.dataset.p; const cdp = S.cd[p] / CD[p] * 100; b.style.setProperty('--cdp', cdp + '%'); b.classList.toggle('ready', cdp <= 0 && !(COST[p] && S.en < COST[p])); b.style.opacity = COST[p] && S.en < COST[p] ? .5 : 1; });
  }
  if (arena.visible) { for (let i = 0; i < DUSTN; i++) { dustPos[i * 3] += Math.sin(S.t * .3 + i) * dt * .6 + dt * .4; dustPos[i * 3 + 1] += Math.cos(S.t * .5 + i * 1.7) * dt * .2; if (dustPos[i * 3] > 55) dustPos[i * 3] = -55; } dustG.attributes.position.needsUpdate = true; }
  stepMap(dt); stepParticles(dt); stepFx(dt); drawOverlay(dt);
  R.render(scene, cam); requestAnimationFrame(tick);
}
function hurt(d) { if (S.iframes > 0 || S.mode !== 'play') return; sfx('hurt'); S.hp -= S.buff > 0 ? d * .4 : d; S.shake = Math.max(S.shake, .25); burst(zayn.position.clone().setY(2), [0xff2a5a, 0xffffff], 18, 7, 5); floatTxt(zayn.position, '-' + d, false, '#ff4a5a'); if (S.hp <= 0) { S.hp = 0; lose(); } }
requestAnimationFrame(tick);
window.__spawn = spawn; window.__S = S; window.__use = use; window.__enemies = enemies;

// ===== theme music (HTMLAudioElement, starts on first gesture) =====
const music = new Audio('assets/audio/theme.mp3'); music.loop = true; music.preload = 'auto';
let muted = localStorage.getItem('sw_muted') === '1', musicVol = .55;
const muteBtn = document.getElementById('mute');
function applyMusic() { music.volume = muted ? 0 : musicVol; music.muted = muted; muteBtn.textContent = muted ? '🔇' : '♪'; muteBtn.classList.toggle('off', muted); if (!muted) music.play().catch(() => {}); }
function setDuck(lv) { musicVol = lv; if (!muted) music.volume = musicVol; }
// WebAudio SFX (synth, no files): hit tick, shot whoosh, boom, gem blip, dodge whoosh, roar
let AC = null, sfxBus = null; const lastSfx = {};
function initAudio() { if (AC) return; try { AC = new (window.AudioContext || window.webkitAudioContext)(); sfxBus = AC.createGain(); sfxBus.gain.value = .9; const comp = AC.createDynamicsCompressor(); sfxBus.connect(comp); comp.connect(AC.destination); } catch (e) { AC = null; } }
let noiseBuf = null; const noise = () => { if (noiseBuf) return noiseBuf; noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return noiseBuf; };
function sfx(type) { if (!AC || muted) return; const now = AC.currentTime, gap = { hit: .035, shot: .06, gem: .045, boom: .07 }[type] || 0; if (now - (lastSfx[type] || 0) < gap) return; lastSfx[type] = now;
  const env = (g, a, d, v) => { g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(v, now + a); g.gain.exponentialRampToValueAtTime(.0001, now + a + d); };
  const nz = (f0, f1, q, a, d, v, type = 'bandpass') => { const src = AC.createBufferSource(); src.buffer = noise(); const fl = AC.createBiquadFilter(); fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f0, now); fl.frequency.exponentialRampToValueAtTime(f1, now + a + d); const g = AC.createGain(); env(g, a, d, v); src.connect(fl); fl.connect(g); g.connect(sfxBus); src.start(now); src.stop(now + a + d + .05); };
  const tone = (f0, f1, a, d, v, w = 'sine') => { const o = AC.createOscillator(); o.type = w; o.frequency.setValueAtTime(f0, now); o.frequency.exponentialRampToValueAtTime(f1, now + a + d); const g = AC.createGain(); env(g, a, d, v); o.connect(g); g.connect(sfxBus); o.start(now); o.stop(now + a + d + .05); };
  if (type === 'hit') { nz(3200, 900, 1.2, .002, .07, .35); tone(220, 90, .002, .06, .25, 'square'); }
  if (type === 'shot') nz(1800, 5000, .8, .01, .12, .22);
  if (type === 'whoosh') nz(600, 3000, .7, .02, .2, .45);
  if (type === 'boom') { nz(900, 60, .7, .005, .45, .9, 'lowpass'); tone(110, 35, .005, .4, .6); }
  if (type === 'roar') { nz(400, 80, .6, .02, .7, .8, 'lowpass'); tone(160, 50, .03, .7, .5, 'sawtooth'); }
  if (type === 'gem') tone(1400 + Math.random() * 400, 2400, .002, .08, .18, 'triangle');
  if (type === 'hurt') { tone(300, 80, .003, .2, .4, 'square'); } }
muteBtn.addEventListener('pointerdown', e => e.stopPropagation());
muteBtn.onclick = e => { e.stopPropagation(); muted = !muted; localStorage.setItem('sw_muted', muted ? '1' : '0'); applyMusic(); };
addEventListener('keydown', e => { if (e.code === 'KeyM') muteBtn.click(); });
const unlock = () => { initAudio(); if (!muted) music.play().catch(() => {}); };
['pointerdown', 'keydown', 'touchstart'].forEach(t => addEventListener(t, unlock, { once: true, capture: true }));
applyMusic();
setInterval(() => setDuck(S.mode === 'title' || S.mode === 'over' || S.mode === 'overfade' ? .55 : S.mode === 'cine' ? .32 : .16), 250); // duck theme under battle SFX
