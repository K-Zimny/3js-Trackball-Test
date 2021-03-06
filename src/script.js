import "./style.css";
import jQuery from "jquery";
import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "./CustomGlitch";

const clock = new THREE.Clock();

let perspectiveCamera,
  orthographicCamera,
  controls,
  scene,
  renderer,
  stats,
  composer;

let glitchPass;

const params = {
  orthographicCamera: false,
};

const frustumSize = 400;

init();
animate();

function init() {
  const aspect = window.innerWidth / window.innerHeight;

  perspectiveCamera = new THREE.PerspectiveCamera(50, aspect, 1, 2000);
  perspectiveCamera.position.z = -1500;

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

  // protected zone radius

  const protectedArea = 65;

  //   Triangle Mesh
  const geometry = new THREE.ConeGeometry(5, 16, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 350; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 1000;
    mesh.position.y = (Math.random() - 0.5) * 1000;
    mesh.position.z = (Math.random() - 0.5) * 1000;
    mesh.rotation.x = (Math.random() - 0.5) * 1000;
    mesh.rotation.y = (Math.random() - 0.5) * 1000;
    mesh.rotation.z = (Math.random() - 0.5) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    if (mesh.position.z > protectedArea || mesh.position.z < -protectedArea) {
      scene.add(mesh);
    }

    if (mesh.position.y > protectedArea || mesh.position.y < -protectedArea) {
      scene.add(mesh);
    }

    if (mesh.position.x > protectedArea || mesh.position.x < -protectedArea) {
      scene.add(mesh);
    }
    // scene.add(mesh);
  }

  //   Sphere Mesh
  const geometrySphere = new THREE.IcosahedronGeometry(8, 4);
  const materialSphere = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 350; i++) {
    const meshSphere = new THREE.Mesh(geometrySphere, materialSphere);
    meshSphere.position.x = (Math.random() - 0.5) * 1000;
    meshSphere.position.y = (Math.random() - 0.5) * 1000;
    meshSphere.position.z = (Math.random() - 0.5) * 1000;
    meshSphere.updateMatrix();
    meshSphere.matrixAutoUpdate = false;
    if (
      meshSphere.position.z > protectedArea ||
      meshSphere.position.z < -protectedArea
    ) {
      scene.add(meshSphere);
    }

    if (
      meshSphere.position.y > protectedArea ||
      meshSphere.position.y < -protectedArea
    ) {
      scene.add(meshSphere);
    }

    if (
      meshSphere.position.x > protectedArea ||
      meshSphere.position.x < -protectedArea
    ) {
      scene.add(meshSphere);
    }
    // scene.add(meshSphere);
  }

  //   Box Mesh
  const geometryBox = new THREE.BoxGeometry(9, 10, 10);
  const materialBox = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
  });

  for (let i = 0; i < 350; i++) {
    const meshBox = new THREE.Mesh(geometryBox, materialBox);
    meshBox.position.x = (Math.random() - 0.5) * 1000;
    meshBox.position.y = (Math.random() - 0.5) * 1000;
    meshBox.position.z = (Math.random() - 0.5) * 1000;
    meshBox.rotation.x = (Math.random() - 0.5) * 1000;
    meshBox.rotation.y = (Math.random() - 0.5) * 1000;
    meshBox.rotation.z = (Math.random() - 0.5) * 1000;
    meshBox.updateMatrix();
    meshBox.matrixAutoUpdate = false;
    if (
      meshBox.position.z > protectedArea ||
      meshBox.position.z < -protectedArea
    ) {
      scene.add(meshBox);
    }

    if (
      meshBox.position.y > protectedArea ||
      meshBox.position.y < -protectedArea
    ) {
      scene.add(meshBox);
    }

    if (
      meshBox.position.x > protectedArea ||
      meshBox.position.x < -protectedArea
    ) {
      scene.add(meshBox);
    }
    // scene.add(meshBox);
  }

  // loader

  const loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
    // resource URL
    "s2-2.glb",
    // called when the resource is loaded
    function (gltf) {
      gltf.scene.rotation.z = Math.PI * 0.15;
      gltf.scene.rotation.y = Math.PI * 1.05;
      gltf.scene.position.y = -10;
      gltf.scene.scale.set(8, 8, 8);
      scene.add(gltf.scene);
    },
    // called while loading is progressing
    function (xhr) {
      // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      // console.log("An error happened");
    }
  );

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
  renderer.domElement.id = "c";
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  //

  // const gui = new GUI();
  // gui
  //   .add(params, "orthographicCamera")
  //   .name("use orthographic")
  //   .onChange(function (value) {
  //     controls.dispose();

  //     createControls(value ? orthographicCamera : perspectiveCamera);
  //   });

  //

  window.addEventListener("resize", onWindowResize);

  createControls(perspectiveCamera);

  // postprocessing

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, perspectiveCamera));

  glitchPass = new GlitchPass();
  composer.addPass(glitchPass);
}

function createControls(camera) {
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 0;
  controls.zoomSpeed = 0;
  controls.panSpeed = 0;
  controls.maxDistance = 1500;

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
  // Animate
  if (perspectiveCamera.position.z < 0) {
    perspectiveCamera.position.x -= Math.cos(1 * Math.PI * 2) / 16;
    perspectiveCamera.position.y += Math.cos(1 * Math.PI * 2) / 16;
    perspectiveCamera.position.z += Math.cos(1 * Math.PI * 2);
  } else {
    perspectiveCamera.position.x += Math.cos(1 * Math.PI * 2) / 64;
    perspectiveCamera.position.y += Math.cos(1 * Math.PI * 2) / 64;
    perspectiveCamera.position.z += Math.cos(1 * Math.PI * 2) / 124;
    controls.minDistance = 125;
    controls.maxDistance = 500;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
  }

  perspectiveCamera.lookAt(new THREE.Vector3(0, 0, 0));

  requestAnimationFrame(animate);

  controls.update();

  stats.update();

  render();
}

function render() {
  const glitchThreshold = 350;
  const glitchThresholdPos = glitchThreshold;
  const glitchThresholdNeg = -glitchThreshold;
  const camera = params.orthographicCamera
    ? orthographicCamera
    : perspectiveCamera;

  if (
    perspectiveCamera.position.z < glitchThresholdNeg ||
    perspectiveCamera.position.z > glitchThresholdPos ||
    perspectiveCamera.position.x < glitchThresholdNeg ||
    perspectiveCamera.position.x > glitchThresholdPos ||
    perspectiveCamera.position.y < glitchThresholdNeg ||
    perspectiveCamera.position.y > glitchThresholdPos
  ) {
    composer.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

// ---------------------------------------

jQuery(document).ready(function () {
  console.log("jQuery Ready!");
  // ---------------------------------------
  // js event listener hide text on canvas scroll
  // ---------------------------------------

  // FIXME: Fix mouse clicks double clinking on phone

  c.addEventListener("mousedown", function () {
    jQuery("header").fadeTo(250, 0);
  });

  c.addEventListener("mouseup", function () {
    jQuery("header").fadeTo(250, 1);
  });

  // c.addEventListener("touchstart", function () {
  //   jQuery("header").fadeTo(250, 0);
  // });

  // c.addEventListener("touchend", function () {
  //   jQuery("header").fadeTo(250, 1);
  // });

  // ---------------------------------------
  // END js event listener hide text on canvas scroll
  // ---------------------------------------

  // ---------------------------------------

  // ---------------------------------------
  // introText Animation
  // ---------------------------------------

  jQuery("#introText")
    .delay(7000)
    .animate(
      {
        opacity: 1,
        top: "+=10%",
        // height: "toggle",
      },
      3000,
      function () {
        jQuery("#introText")
          .delay(3000)
          .animate({ opacity: 0, top: "+=10%" }, 3000, function () {
            jQuery("#introTitle")
              .delay(1000)
              .animate(
                {
                  opacity: 1,
                  top: "+=10%",
                  // height: "toggle",
                },
                3000,
                function () {
                  jQuery("#introTitle")
                    .delay(1000)
                    .animate(
                      {
                        opacity: 0,
                        top: "+=10%",
                      },
                      3000,
                      function () {
                        jQuery("#introText").addClass("hidden");
                        jQuery("#introTitle").addClass("hidden");
                        jQuery("header").removeClass("block");
                        jQuery("header").css("opacity", "0");
                        jQuery("header").css("visibility", "visible");
                        jQuery("header").css("display", "none");
                        jQuery("header").delay(500).animate(
                          {
                            opacity: 1,
                            height: "toggle",
                          },
                          3000
                        );
                      }
                    );
                }
              );
          });
      }
    );

  // ---------------------------------------
  // ENDintroText Animation
  // ---------------------------------------

  // ---------------------------------------

  // ---------------------------------------
  // Hide/show "page" cards
  // ---------------------------------------

  // hide/show functions

  function showPage(linkPage) {
    jQuery("header")
      .fadeTo(1000)
      .delay(0)
      .fadeTo(1000, 0, function () {
        jQuery("header").addClass("hidden");
        jQuery("header").removeClass("block");
      });
    jQuery(linkPage).addClass("block");
    jQuery(linkPage).css("opacity", "0");
    jQuery(linkPage).fadeTo(1000).delay(1000).fadeTo(1000, 1);
  }

  function hidePage(linkPage) {
    jQuery(linkPage)
      .fadeTo(1000)
      .delay(0)
      .fadeTo(1000, 0, function () {
        jQuery(linkPage).addClass("hidden");
        jQuery(linkPage).removeClass("block");
      });
    jQuery(header).addClass("block");
    jQuery(header).css("opacity", "0");
    jQuery(header).fadeTo(1000).delay(1000).fadeTo(1000, 1);
  }

  // ---------------------------------------
  // END Hide/show "page" cards
  // ---------------------------------------

  // ---------------------------------------

  // ---------------------------------------
  // Explore World
  // ---------------------------------------

  // Explore World

  function startExplore() {
    jQuery("header").fadeTo(1000, 0);
    jQuery("header").addClass("hidden");
    jQuery("header").removeClass("block");
    jQuery("#endExplore").addClass("block");

    if (jQuery(window).width() < 767) {
      jQuery("#canvasHelperMobile").css("display", "block");
      jQuery("#canvasHelperMobile").addClass("block");
      jQuery("#canvasHelperMobile")
        .delay(0)
        .animate(
          {
            opacity: 1,
          },
          1000,
          function () {
            jQuery("#c").on("touchstart", function () {
              jQuery("#canvasHelperMobile").css("opacity", "0");
              jQuery("#canvasHelperMobile").removeClass("block");
              jQuery("#canvasHelperMobile").addClass("hidden");
            });
            jQuery("#endExplore").on("touchstart", function () {
              jQuery("#canvasHelperMobile").css("opacity", "0");
              jQuery("#canvasHelperMobile").removeClass("block");
              jQuery("#canvasHelperMobile").addClass("hidden");
            });
          }
        );
    } else {
      jQuery("#canvasHelperDesktop")
        .delay(0)
        .animate(
          {
            opacity: 1,
          },
          1000,
          function () {
            jQuery("#c").on("mousedown", function () {
              jQuery("#canvasHelperDesktop").css("opacity", "0");
            });
            jQuery("#endExplore").on("click", function () {
              jQuery("#canvasHelperDesktop").css("opacity", "0");
              jQuery("#canvasHelperDesktop").removeClass("block");
              jQuery("#canvasHelperDesktop").addClass("hidden");
            });
          }
        );
    }
  }

  function endExplore() {
    jQuery("header").fadeTo(1000, 1);
    jQuery("header").removeClass("hidden");
    jQuery("header").addClass("block");
    jQuery("#endExplore").addClass("hidden");
    jQuery("#endExplore").removeClass("block");
  }

  // ---------------------------------------
  // END Explore World
  // ---------------------------------------

  // ---------------------------------------

  // ---------------------------------------
  // Page cards scene animation
  // ---------------------------------------

  function lookAtPage(iteration, divFactor) {
    for (let i = 0; i < iteration; i++) {
      perspectiveCamera.position.x =
        Math.cos(Math.random() * Math.PI * 2) / divFactor;
      perspectiveCamera.position.y =
        Math.cos(Math.random() * Math.PI * 2) / divFactor;
      perspectiveCamera.position.z =
        Math.cos(Math.random() * Math.PI * 2) / divFactor;
    }
  }
  function lookAtHome(iteration, xPos, yPos, zPos) {
    for (let i = 0; i < iteration; i++) {
      perspectiveCamera.position.x = xPos * Math.random();
      perspectiveCamera.position.y = yPos * Math.random();
      perspectiveCamera.position.z = zPos;
    }
  }

  // ---------------------------------------
  // END Page cards scene animation
  // ---------------------------------------

  // ---------------------------------------

  jQuery("#aboutLink").on("click", function () {
    showPage("#about");
    lookAtPage(500, -2);
    jQuery("#audioBtn").addClass("hidden");
  });

  jQuery("#aboutHomeBtn").on("click", function () {
    hidePage("#about");
    lookAtHome(500, 100, 100, 200);
  });

  jQuery("#whyLink").on("click", function () {
    showPage("#why");
    lookAtPage(500, -3);
    jQuery("#audioBtn").addClass("hidden");
  });

  jQuery("#whyHomeBtn").on("click", function () {
    hidePage("#why");
    lookAtHome(500, -300, -600, 250);
  });

  jQuery("#howLink").on("click", function () {
    showPage("#how");
    lookAtPage(500, -4);
    jQuery("#audioBtn").addClass("hidden");
  });

  jQuery("#howHomeBtn").on("click", function () {
    hidePage("#how");
    lookAtHome(500, 500, -500, 300);
  });

  jQuery("#explore").on("click", function () {
    startExplore();
    jQuery("#audioBtn").addClass("hidden");
  });

  jQuery("#endExplore").on("click", function () {
    endExplore();
  });

  // Audio

  jQuery("#audioBtn").on("click", function () {
    document.getElementById("audio").play();
    jQuery("#audioBtn").addClass("hidden");
  });
});
