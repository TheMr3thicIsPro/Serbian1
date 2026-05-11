(function () {
  'use strict';

  var canvas = document.getElementById('tooth-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ─────────────────────────────────────────── */
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    canvas.style.display = 'none';
    var le = document.getElementById('tooth-loader');
    if (le) le.style.display = 'none';
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ── Scene / Camera ───────────────────────────────────── */
  var scene  = new THREE.Scene();

  function stageSize() {
    var p = canvas.parentElement;
    return {
      w: p ? (p.clientWidth  || 340) : 340,
      h: p ? (p.clientHeight || 400) : 400,
    };
  }

  var sz = stageSize();
  renderer.setSize(sz.w, sz.h, false);

  var camera = new THREE.PerspectiveCamera(32, sz.w / sz.h, 0.1, 100);
  camera.position.set(0, 0.4, 5.5);

  /* ── Lighting ─────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xfff8f0, 0.55));

  var key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key);

  var fill = new THREE.DirectionalLight(0xc9a96e, 0.55);
  fill.position.set(-4, 2, 2);
  scene.add(fill);

  var rim = new THREE.DirectionalLight(0x9ecbff, 0.4);
  rim.position.set(0, -3, -4);
  scene.add(rim);

  /* ── Enamel material ──────────────────────────────────── */
  var enamelMat = new THREE.MeshPhysicalMaterial({
    color: 0xf7f2ec,
    roughness: 0.12,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  });

  /* ── Load GLB ─────────────────────────────────────────── */
  var loader = new THREE.GLTFLoader();
  var tooth  = null;

  loader.load(
    './tooth.glb',
    function (gltf) {
      tooth = gltf.scene;

      var box    = new THREE.Box3().setFromObject(tooth);
      var center = box.getCenter(new THREE.Vector3());
      var size   = box.getSize(new THREE.Vector3());
      tooth.position.sub(center);
      var maxDim = Math.max(size.x, size.y, size.z);
      tooth.scale.setScalar(2.8 / maxDim);

      tooth.traverse(function (node) {
        if (node.isMesh) node.material = enamelMat;
      });

      tooth.rotation.x = -0.08;
      scene.add(tooth);

      var loaderEl = document.getElementById('tooth-loader');
      if (loaderEl) loaderEl.style.opacity = '0';
    },
    undefined,
    function () {
      var loaderEl = document.getElementById('tooth-loader');
      if (loaderEl) loaderEl.style.display = 'none';
    }
  );

  /* ── Mouse parallax ───────────────────────────────────── */
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  var autoAngle = 0, floatT = 0;

  /* ── Render loop ──────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);

    if (tooth) {
      autoAngle += 0.006;
      floatT     += 0.012;

      var targetX = autoAngle + mouseX * 0.35;
      var targetY = mouseY * 0.18;

      tooth.rotation.y += (targetX - tooth.rotation.y) * 0.04;
      tooth.rotation.x += (-0.08 + targetY - tooth.rotation.x) * 0.04;
      tooth.position.y  = Math.sin(floatT) * 0.08;
    }

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ───────────────────────────────────────────── */
  window.addEventListener('resize', function () {
    var s = stageSize();
    if (!s.w || !s.h) return;
    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
    renderer.setSize(s.w, s.h, false);
  });
})();
