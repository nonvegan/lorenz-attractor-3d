import * as THREE from "https://threejs.org/build/three.module.js";
import { LineGeometry } from "https://threejs.org/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "https://threejs.org/examples/jsm/lines/LineMaterial.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "https://threejs.org/examples/jsm/lines/Line2.js";

window.addEventListener("load", main, false);

function main(evt) {
  window.removeEventListener(evt.type, main, false);

  const canvasDiv = document.getElementById("canvasDiv");
  const switchInput = document.getElementById("switchInput");
  const resetButton = document.getElementById("resetButton");
  const forwardButton = document.getElementById("forwardButton");
  switchInput.addEventListener("change", (evt) => {
    controls.autoRotate = switchInput.checked;
  });
  forwardButton.addEventListener("click", (evt) => {
    for (let i = 0; i < 1000; i++) {
      LorenzStep();
    }
  });
  resetButton.addEventListener("click", reset);
  window.addEventListener("resize", () => {
    width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
    height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  
  let width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
  let height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
  let renderer;
  let scene;
  let camera;
  let matLine;
  let controls;
  let positions = [];
  let i = 0;
  let colors = [];
  let color = new THREE.Color();
  let n = 0;

  const MAX_AUTO_GEN_POINTS = 5000;
  const dt = 0.005;
  const a = 10;
  const b = 28;
  const c = 8 / 3;
  let x = 1;
  let y = 1;
  let z = 1;

  function setup() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setPixelRatio(width / height);
    renderer.setClearColor(0x000000, 0.0);
    renderer.setSize(width, height);
    canvasDiv.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(-140, 60, 0);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.autoRotate = switchInput.checked;
    controls.autoRotateSpeed = 4;
    controls.saveState();
  }

  function animate() {
    requestAnimationFrame(animate);
    if (i < MAX_AUTO_GEN_POINTS) {
      LorenzStep();
    }
    controls.target.lerp(new THREE.Vector3(x, y, z), 0.01);
    controls.update();
    renderer.setClearColor(0x282c34, 0);
    renderer.setViewport(0, 0, width, height);
    matLine.resolution.set(width, height);
    renderer.render(scene, camera);
  }

  function reset() {
    controls.reset();
    x = 1;
    y = 1;
    z = 1;
    n = 0;
    i = 0;
    positions = [];
    colors = [];
  }
  function LorenzStep() {
    scene.clear();
    const dx = a * (y - x);
    const dy = x * (b - z) - y;
    const dz = x * y - c * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    positions.push(x, y, z);
    if (n > 1) n = 0;
    color.setHSL((n += 0.01), 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);
    matLine = new LineMaterial({
      linewidth: width / 150,
      vertexColors: true,
    });
    let line = new Line2(geometry, matLine);
    scene.add(line);
    i++;
  }

  setup();
  animate();
}
