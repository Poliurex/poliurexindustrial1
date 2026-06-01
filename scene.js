/**
 * POLIUREX — Hero 3D Scene
 * Undulating wireframe mesh that evokes the liquid polyurea surface.
 * Three.js r128. No external dependencies beyond the CDN import.
 */
;(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ─────────────────────────────── */
  var renderer = new THREE.WebGLRenderer({
    canvas:    canvas,
    antialias: false,        // off for perf on mobile
    alpha:     true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene & Camera ───────────────────────── */
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 7);
  camera.lookAt(0, 0, 0);

  /* ── Mesh geometry ────────────────────────── */
  // Large plane with many segments for smooth waves
  var geo = new THREE.PlaneGeometry(22, 14, 90, 55);
  var mat = new THREE.MeshBasicMaterial({
    color:       0xc8871a,
    wireframe:   true,
    transparent: true,
    opacity:     0.065,
  });

  var mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI * 0.22;   // tilt toward viewer
  mesh.position.y = -0.5;
  scene.add(mesh);

  /* ── Cache original vertex positions ─────── */
  var pos  = geo.attributes.position;
  var orig = new Float32Array(pos.array);  // immutable copy
  var cnt  = pos.count;

  /* ── Animation state ──────────────────────── */
  var clock = new THREE.Clock();
  var raf;
  var paused = false;

  function animate() {
    raf = requestAnimationFrame(animate);
    if (paused) return;

    var t = clock.getElapsedTime();

    for (var i = 0; i < cnt; i++) {
      var xi = orig[i * 3];
      var yi = orig[i * 3 + 1];

      // Three overlapping sinusoidal waves for organic feel
      var z = Math.sin(xi * 0.30 + t * 0.42) * 0.20
            + Math.cos(yi * 0.25 + t * 0.34) * 0.14
            + Math.sin((xi + yi) * 0.18 + t * 0.26) * 0.09;

      pos.setZ(i, z);
    }

    pos.needsUpdate = true;
    renderer.render(scene, camera);
  }

  /* ── Resize handler ───────────────────────── */
  function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize, { passive: true });

  /* ── Visibility: pause when tab is hidden ─── */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      paused = true;
      cancelAnimationFrame(raf);
    } else {
      paused = false;
      clock.start();
      animate();
    }
  });

  /* ── Reduce opacity on scroll ─────────────── */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var progress = Math.min(window.scrollY / window.innerHeight, 1);
      mat.opacity  = 0.065 * (1 - progress * 0.85);
      ticking = false;
    });
  }, { passive: true });

  /* ── Start ────────────────────────────────── */
  onResize();
  animate();

})();
