import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  const canvas = document.getElementById('tooth-canvas');
  if (!canvas) return;

  /* ── Renderer ─────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ── Scene / Camera ───────────────────────────────────── */
  const scene = new THREE.Scene();

  const W = canvas.clientWidth  || 340;
  const H = canvas.clientHeight || 400;
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
    transmission: 0.0,
  });

  /* ── Load GLB ─────────────────────────────────────────── */
  const loader = new GLTFLoader();
  let tooth = null;

  loader.load(
    './tooth.glb',
    function (gltf) {
      tooth = gltf.scene;

      /* Center + scale to fit stage */
      const box = new THREE.Box3().setFromObject(tooth);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      tooth.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      tooth.scale.setScalar(2.8 / maxDim);

      /* Apply enamel material to every mesh */
      tooth.traverse(function (node) {
        if (node.isMesh) {
          node.material = enamelMat;
          node.castShadow = false;
        }
      });

      /* Tilt slightly so crown faces camera */
      tooth.rotation.x = -0.08;

      scene.add(tooth);

      /* Hide loading indicator */
      const loader_el = document.getElementById('tooth-loader');
      if (loader_el) loader_el.style.opacity = '0';
    },
    undefined,
    function (err) {
      console.warn('Tooth GLB load error', err);
    }
  );

  /* ── Mouse parallax ───────────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let autoAngle = 0;

  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Float animation (mirrors CSS float-tooth) ────────── */
  let floatT = 0;

  /* ── Render loop ──────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);

    if (tooth) {
      autoAngle += 0.006;
      floatT     += 0.012;

      targetX = autoAngle + mouseX * 0.35;
      targetY = mouseY * 0.18;

      tooth.rotation.y += (targetX - tooth.rotation.y) * 0.04;
      tooth.rotation.x += (-0.08 + targetY - tooth.rotation.x) * 0.04;

      /* Gentle vertical float */
      tooth.position.y = Math.sin(floatT) * 0.08;
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize handler ───────────────────────────────────── */
  const resizeObs = new ResizeObserver(function () {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
  resizeObs.observe(canvas);
})();
