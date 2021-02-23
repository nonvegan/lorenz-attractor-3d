import * as THREE from "https://threejs.org/build/three.module.js";
import { LineGeometry } from "https://threejs.org/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "https://threejs.org/examples/jsm/lines/LineMaterial.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "https://threejs.org/examples/jsm/lines/Line2.js";

window.addEventListener(
  "load",
  function main(evt) {
    window.removeEventListener(evt.type, main, false);

    const canvasDiv = document.getElementById("canvasDiv");
    const switchInput = document.getElementById("switchInput");
    const resetButton = document.getElementById("resetButton");

    switchInput.addEventListener("change", (evt) => {
      controls.autoRotate = switchInput.checked;
    });
    resetButton.addEventListener("click", (evt) => {
      // controls.reset();
      console.log(line.geometry);
    });

    const width = Math.min(window.innerWidth, window.innerHeight) / 1.5;
    const height = Math.min(window.innerWidth, window.innerHeight) / 1.5;
    let renderer, scene, camera, matLine, controls, line;
    const positions = [];
    const colors = [];
    const MAX_POINTS = 1000;
    let x = 1;
    let y = 1;
    let z = 1;
    const dt = 0.01;
    const a = 10;
    const b = 28;
    const c = 8 / 3;

    function setup() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(width / height);
      renderer.setClearColor(0x000000, 0.0);
      renderer.setSize(width, height);
      canvasDiv.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
      camera.position.set(-140, 60, 0);
      const color = new THREE.Color();
      for (let i = 0, n = 0; i < MAX_POINTS; i++) {
        const dx = a * (y - x);
        const dy = x * (b - z) - y;
        const dz = x * y - c * z;
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
        if (n > 1) n = 0;
        positions.push(x, y, z);
        color.setHSL((n += 0.01), 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
      }

      const geometry = new LineGeometry();
      geometry.setPositions(positions);
      geometry.setColors(colors);
      matLine = new LineMaterial({
        linewidth: 4,
        vertexColors: true,
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target = new THREE.Vector3(x, y, z);
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.saveState();
      scene.add((line = new Line2(geometry, matLine)));
      renderer.render(scene, camera);
    }

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.setClearColor(0x000000, 0);
      renderer.setViewport(0, 0, width, height);
      matLine.resolution.set(width, height);
      renderer.render(scene, camera);
    }

    setup();
    animate();
  },
  false
);
