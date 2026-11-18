import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#characterCanvas');
const stage = document.querySelector('#portraitStage');
const fallback = document.querySelector('#portraitFallback');
const statusEl = document.querySelector('#modelStatus');
const buttons = [...document.querySelectorAll('.expression-btn')];
if (!canvas || !stage) throw new Error('3D character stage is missing.');

const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 1.35, 5.7);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
scene.add(new THREE.HemisphereLight(0xffffff, 0x3d3540, 2.1));
const key = new THREE.DirectionalLight(0xffe4c4, 3.1); key.position.set(3, 4, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0x7b9dff, 2.2); rim.position.set(-4, 2, -3); scene.add(rim);
const fill = new THREE.PointLight(0xffffff, 30, 12); fill.position.set(0, 1, 3); scene.add(fill);
const root = new THREE.Group(); scene.add(root);
let mixer = null, model = null, morphMeshes = [], morphMap = new Map(), headBone = null, spineBone = null;
let targetExpression = 'neutral';
const clock = new THREE.Clock();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  const r = canvas.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height);
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas); resize();

function normalizedName(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); }
function scanModel(gltf) {
  model = gltf.scene; root.add(model);
  const box = new THREE.Box3().setFromObject(model); const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1; const scale = 3.15 / maxDim;
  model.scale.setScalar(scale); model.position.set(-center.x * scale, -box.min.y * scale - .1, -center.z * scale);
  model.traverse(o => {
    if (o.isMesh && o.morphTargetDictionary && o.morphTargetInfluences) {
      morphMeshes.push(o);
      Object.entries(o.morphTargetDictionary).forEach(([name, index]) => {
        const key = normalizedName(name); if (!morphMap.has(key)) morphMap.set(key, []);
        morphMap.get(key).push({ mesh: o, index });
      });
    }
    if (o.isBone) { const n = normalizedName(o.name); if (!headBone && (n === 'head' || n.includes('head'))) headBone = o; if (!spineBone && (n === 'spine' || n.includes('spine1'))) spineBone = o; }
  });
  if (gltf.animations?.length) { mixer = new THREE.AnimationMixer(model); gltf.animations.forEach((clip, i) => { if (i === 0) mixer.clipAction(clip).play(); }); }
  if (fallback) fallback.style.opacity = '0';
  statusEl.innerHTML = '<span class="status-pulse"></span> RIGGED MODEL LOADED / ' + morphMeshes.length + ' FACE MESHES';
  const hasFace = [...morphMap.keys()].some(k => /blink|jawopen|mouthsmile|mouthfunnel|browinnerup/.test(k));
  buttons.forEach(b => { b.disabled = !hasFace; b.title = hasFace ? 'Animate this expression' : 'This model has no compatible facial blendshapes'; });
  if (!hasFace) statusEl.innerHTML = '<span class="status-pulse"></span> 3D MODEL LOADED / FACIAL BLENDSHAPES NOT FOUND';
}
new GLTFLoader().load('assets/models/character.glb', scanModel, undefined, () => {
  statusEl.innerHTML = '<span class="status-pulse"></span> 8-VIEW PORTRAIT PREVIEW / 3D RIG NOT YET INSTALLED';
});

const aliases = {
  blinkLeft: ['eyeblinkleft', 'blinkleft', 'leyeclosed'], blinkRight: ['eyeblinkright', 'blinkright', 'reyeclosed'],
  smile: ['mouthsmileleft', 'mouthsmileright', 'mouthsmile'],
  jaw: ['jawopen', 'mouthopen', 'visemeaa'],
  browUp: ['browinnerup', 'browouterupleft', 'browouterupright'],
  browDown: ['browdownleft', 'browdownright'],
  wide: ['eyewideleft', 'eyewideright'],
  frown: ['mouthfrownleft', 'mouthfrownright'],
  pucker: ['mouthfunnel', 'mouthpucker']
};
function setMorph(alias, value) {
  const names = aliases[alias] || [alias];
  names.forEach(n => { const list = morphMap.get(normalizedName(n)) || []; list.forEach(({ mesh, index }) => mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(mesh.morphTargetInfluences[index], value, .22)); });
}
function applyExpression(name, t) {
  const v = { smile: { smile: .82, browUp: .12 }, surprised: { jaw: .5, browUp: .9, wide: .55 }, angry: { browDown: .85, frown: .35 }, talk: { jaw: .18 + Math.abs(Math.sin(t * 8)) * .42, pucker: .08 }, neutral: {} }[name] || {};
  Object.keys(aliases).forEach(k => setMorph(k, v[k] || 0));
}
buttons.forEach(b => b.addEventListener('click', () => {
  targetExpression = b.dataset.expression; buttons.forEach(x => x.classList.toggle('active', x === b));
}));

let pointerX = 0, pointerY = 0;
stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); pointerX = ((e.clientX - r.left) / r.width - .5) * 2; pointerY = ((e.clientY - r.top) / r.height - .5) * 2; });
stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
let blinkAt = 2.5, blink = 0;
function animate() {
  requestAnimationFrame(animate); const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  if (mixer) mixer.update(dt);
  if (model) {
    const motion = reducedMotion ? 0 : 1;
    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, pointerX * .18 * motion, .045);
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointerY * .09 * motion + Math.sin(t * .7) * .012 * motion, .045);
    if (headBone) { headBone.rotation.y += (pointerX * .10 - headBone.rotation.y) * .035; headBone.rotation.x += (-pointerY * .06 - headBone.rotation.x) * .035; }
    if (spineBone) spineBone.rotation.z = Math.sin(t * .7) * .012 * motion;
    if (t > blinkAt) { blink = 1; blinkAt = t + 3.1 + Math.random() * 2.6; }
    applyExpression(targetExpression, t);
    if (blink > 0) { blink = Math.max(0, blink - dt * 7); setMorph('blinkLeft', blink); setMorph('blinkRight', blink); }
  }
  renderer.render(scene, camera);
}
animate();
