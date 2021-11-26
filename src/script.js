import "./style.css";
import * as THREE from "three";

// import Stats from "three/examples/jsm/libs/stats.module.js";
// import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

let perspectiveCamera, orthographicCamera, controls, scene, renderer, stats;

const params = {
  orthographicCamera: false,
};

const frustumSize = 400;

init();
animate();

function init() {
  const aspect = window.innerWidth / window.innerHeight;

  perspectiveCamera = new THREE.PerspectiveCamera(90, aspect, 1, 1000);
  perspectiveCamera.position.z = 500;

  orthographicCamera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  );
  orthographicCamera.position.z = 500;

  // world

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#009999");
  scene.fog = new THREE.FogExp2("#009999", 0.002);

  //   Triangle Mesh
  const geometry = new THREE.ConeGeometry(5, 16, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 250; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 1000;
    mesh.position.y = (Math.random() - 0.5) * 1000;
    mesh.position.z = (Math.random() - 0.5) * 1000;
    mesh.rotation.x = (Math.random() - 0.5) * 1000;
    mesh.rotation.y = (Math.random() - 0.5) * 1000;
    mesh.rotation.z = (Math.random() - 0.5) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);
  }

  //   Sphere Mesh
  const geometrySphere = new THREE.IcosahedronGeometry(8, 4);
  const materialSphere = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 250; i++) {
    const meshSphere = new THREE.Mesh(geometrySphere, materialSphere);
    meshSphere.position.x = (Math.random() - 0.5) * 1000;
    meshSphere.position.y = (Math.random() - 0.5) * 1000;
    meshSphere.position.z = (Math.random() - 0.5) * 1000;
    meshSphere.updateMatrix();
    meshSphere.matrixAutoUpdate = false;
    scene.add(meshSphere);
  }

  //   Box Mesh
  const geometryBox = new THREE.BoxGeometry(9, 10, 10);
  const materialBox = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 250; i++) {
    const meshBox = new THREE.Mesh(geometryBox, materialBox);
    meshBox.position.x = (Math.random() - 0.5) * 1000;
    meshBox.position.y = (Math.random() - 0.5) * 1000;
    meshBox.position.z = (Math.random() - 0.5) * 1000;
    meshBox.rotation.x = (Math.random() - 0.5) * 1000;
    meshBox.rotation.y = (Math.random() - 0.5) * 1000;
    meshBox.rotation.z = (Math.random() - 0.5) * 1000;
    meshBox.updateMatrix();
    meshBox.matrixAutoUpdate = false;
    scene.add(meshBox);
  }

  //   Torus Mesh
  //   const geometryTorus = new THREE.TorusGeometry(10, 3, 16, 100);
  //   const materialTorus = new THREE.MeshPhongMaterial({
  //     color: 0xffffff,
  //     flatShading: true,
  //   });

  //   for (let i = 0; i < 150; i++) {
  //     const meshTorus = new THREE.Mesh(geometryTorus, materialTorus);
  //     meshTorus.position.x = (Math.random() - 0.5) * 1000;
  //     meshTorus.position.y = (Math.random() - 0.5) * 1000;
  //     meshTorus.position.z = (Math.random() - 0.5) * 1000;
  //     meshTorus.updateMatrix();
  //     meshTorus.matrixAutoUpdate = false;
  //     scene.add(meshTorus);
  //   }

  // lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //   stats = new Stats();
  //   document.body.appendChild(stats.dom);

  //

  //   const gui = new GUI();
  //   gui
  //     .add(params, "orthographicCamera")
  //     .name("use orthographic")
  //     .onChange(function (value) {
  //       controls.dispose();

  //       createControls(value ? orthographicCamera : perspectiveCamera);
  //     });

  //

  window.addEventListener("resize", onWindowResize);

  createControls(perspectiveCamera);
}

function createControls(camera) {
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.keys = ["KeyA", "KeyS", "KeyD"];
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  perspectiveCamera.aspect = aspect;
  perspectiveCamera.updateProjectionMatrix();

  orthographicCamera.left = (-frustumSize * aspect) / 2;
  orthographicCamera.right = (frustumSize * aspect) / 2;
  orthographicCamera.top = frustumSize / 2;
  orthographicCamera.bottom = -frustumSize / 2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  controls.handleResize();
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  //   stats.update();

  render();
}

function render() {
  const camera = params.orthographicCamera
    ? orthographicCamera
    : perspectiveCamera;

  renderer.render(scene, camera);
}
