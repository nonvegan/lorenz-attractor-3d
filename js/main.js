import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { mapValue, restrain, getMs, getMousePosElem } from "./helpers.js";
import { Vector } from "./classes.js";

window.addEventListener(
  "load",
  function main(evt) {
    window.removeEventListener(evt.type, main, false);
    const canvasDiv = document.getElementById("canvasDiv");
    const optionsDiv = document.getElementById("optionsDiv");
    const gravityRange = document.getElementById("rangeInput");
    const resetButton = document.getElementById("resetButton");
    const switchInput = document.getElementById("switchInput");
    const width = window.screen.height / 1.8;
    const height = window.screen.height / 1.8;
    let renderer, scene, camera, line;
    const points = [];

    function setup() {
      renderer = new THREE.WebGLRenderer();
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 500);
      renderer.setSize(width, height);
      canvasDiv.appendChild(renderer.domElement);

      camera.position.set(0, 0, 150);
      camera.lookAt(0, 0, 0);

      const material = new THREE.LineBasicMaterial({
        linewidth: 1,
        color: 0x0000ff,
      });

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      line = new THREE.Line(geometry, material);
      scene.add(line);
      renderer.render(scene, camera);
    }
    function animate() {
      requestAnimationFrame(animate);
      line.rotation.y+=0.01
      renderer.render(scene, camera);
    }
    function getValues() {
      let x = 1;
      let y = 1;
      let z = 1;
      let n = 0;
      const dt = 0.01;
      const a = 10;
      const b = 28;
      const c = 8 / 3;
      for (let i = 0; i < 2000; i++) {
        const dx = a * (y - x);
        const dy = x * (b - z) - y;
        const dz = x * y - c * z;
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
        points.push(new THREE.Vector3(x, y, z));
      }
    }
    getValues();
    setup();
    animate();
  },
  false
);
