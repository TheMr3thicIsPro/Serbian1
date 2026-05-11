import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  const canvas = document.getElementById('tooth-canvas');
  if (!canvas) return;

  /* ── Renderer ─────────────────────────────────────────── */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    /* WebGL not supported — hide canvas so layout is not broken */
    canvas.style.display = 'none';
    const loaderEl = document.getElementById('tooth-loader');
    if (loaderEl) loaderEl.style.display = 'none';
    return;
  }

  /* Explicitly transparent — alpha:true alone is not always enough */
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ── Scene / Camera ───────────────────────────────────── */
  const scene = new THREE.Scene();

  function stageSize() {
    /* Measure the parent tooth-stage, not the canvas itself */
    const p = canvas.parentElement;
    return {
      w: p ? (p.clientWidth  || 340) : 340,
      h: p ? (p.clientHeight || 400) : 400,
    };
  }

  const { w: W, h: H } = stageSize();
  renderer.setSize(W, H, false);

  const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
  camera.position.set(0, 0.4, 5.5);

  /* ── Lighting ─────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xfff8f0, 0.55));

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xc9a96e, 0.55);
  fill.position.set(-4, 2, 2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0x9ecbff, 0.4);
  rim.position.set(0, -3, -4);
  scene.add(rim);

  /* ── Enamel material ──────────────────────────────────── */
  const enamelMat = new THREE.MeshPhysicalMaterial({
    color: 0xf7f2ec,
    roughness: 0.12,
    metalness: 0.0,
    reflectivity: 0.5,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  });

  /* ── Load GLB ─────────────────────────────────────────── */
  const loader = new GLTFLoader();
  let tooth = null;

  loader.load(
    './tooth.glb',
    function (gltf) {
      tooth = gltf.scene;

      const box    = new THREE.Box3().setFromObject(tooth);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      tooth.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      tooth.scale.setScalar(2.8 / maxDim);

      tooth.traverse(function (node) {
        if (node.isMesh) {
          node.material = enamelMat;
          node.castShadow = false;
        }
      });

      tooth.rotation.x = -0.08;
      scene.add(tooth);

      const loaderEl = document.getElementById('tooth-loader');
      if (loaderEl) loaderEl.style.opacity = '0';
    },
    undefined,
    function () {
      const loaderEl = document.getElementById('tooth-loader');
      if (loaderEl) loaderEl.style.display = 'none';
    }
  );

  /* ── Mouse parallax ───────────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let autoAngle = 0;
  let floatT    = 0;

  /* ── Render loop ──────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);

    if (tooth) {
      autoAngle += 0.006;
      floatT     += 0.012;

      const targetX = autoAngle + mouseX * 0.35;
      const targetY = mouseY * 0.18;

      tooth.rotation.y += (targetX - tooth.rotation.y) * 0.04;
      tooth.rotation.x += (-0.08 + targetY - tooth.rotation.x) * 0.04;
      tooth.position.y  = Math.sin(floatT) * 0.08;
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ───────────────────────────────────────────── */
  const resizeObs = new ResizeObserver(function () {
    const { w, h } = stageSize();
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
  resizeObs.observe(canvas.parentElement || canvas);
})();
