// =======================
// SCENE
// =======================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe5e5e5);

// =======================
// CAMERA
// =======================
const camera = new THREE.PerspectiveCamera(
  75,
  document.querySelector(".map-area").clientWidth /
    document.querySelector(".map-area").clientHeight,
  0.1,
  1000
);
camera.position.set(0, 15, 30);

// =======================
// RENDERER
// =======================
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("map3d"),
  antialias: true
});
renderer.setSize(
  document.querySelector(".map-area").clientWidth,
  document.querySelector(".map-area").clientHeight
);

// =======================
// CONTROLS
// =======================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;

// 🔥 ZOOM SA KUNG SAAN ANG CURSOR
controls.zoomToCursor = true;
controls.screenSpacePanning = false;
controls.zoomSpeed = 0.8;

// =======================
// LIGHTS
// =======================
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// =======================
// ANIMATION
// =======================
const clock = new THREE.Clock();
const mixers = [];

// =======================
// LOADER
// =======================
const loader = new THREE.GLTFLoader();

// =======================
// MODELS
// =======================
let campusMap, clinicMap, shsMap, teachersMap, principalMap;

// =======================
// FUNCTIONS
// =======================

// hide all models
function hideAllModels() {
  if (campusMap) campusMap.visible = false;
  if (clinicMap) clinicMap.visible = false;
  if (shsMap) shsMap.visible = false;
  if (teachersMap) teachersMap.visible = false;
  if (principalMap) principalMap.visible = false;
}

// camera focus
function focusModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  camera.position.copy(center);
  camera.position.x += size * 0.4;
  camera.position.y += size * 0.6;
  camera.position.z += size * 0.4;

  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}

// animation setup
function setupAnimation(gltf, model) {
  if (gltf.animations && gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    mixers.push(mixer);
  }
}

// =======================
// LOAD MODELS
// =======================

// CAMPUS MAP (DEFAULT)
loader.load("models/campus_map.glb", (gltf) => {
  campusMap = gltf.scene;
  scene.add(campusMap);
  setupAnimation(gltf, campusMap);
  focusModel(campusMap);
});

// CLINIC
loader.load("models/clinic_map.glb", (gltf) => {
  clinicMap = gltf.scene;
  clinicMap.visible = false;
  scene.add(clinicMap);
  setupAnimation(gltf, clinicMap);
});

// SHS BUILDING
loader.load("models/shsbuilding.glb", (gltf) => {
  shsMap = gltf.scene;
  shsMap.visible = false;
  scene.add(shsMap);
  setupAnimation(gltf, shsMap);
});

// TEACHERS FACULTY
loader.load("models/teachersfaculty.glb", (gltf) => {
  teachersMap = gltf.scene;
  teachersMap.visible = false;
  scene.add(teachersMap);
  setupAnimation(gltf, teachersMap);
});

// PRINCIPAL OFFICE
loader.load("models/principaloffice.glb", (gltf) => {
  principalMap = gltf.scene;
  principalMap.visible = false;
  scene.add(principalMap);
  setupAnimation(gltf, principalMap);
});

// =======================
// SIDEBAR CLICK
// =======================
document.querySelectorAll(".menu-box li").forEach(item => {
  item.addEventListener("click", () => {
    const location = item.dataset.location;

    hideAllModels();

    if (location === "Clinic" && clinicMap) {
      clinicMap.visible = true;
      focusModel(clinicMap);
    }

    if (location === "SHS Building" && shsMap) {
      shsMap.visible = true;
      focusModel(shsMap);
    }

    if (location === "Teachers Faculty" && teachersMap) {
      teachersMap.visible = true;
      focusModel(teachersMap);
    }

    if (location === "Principal Office" && principalMap) {
      principalMap.visible = true;
      focusModel(principalMap);
    }
  });
});

// =======================
// ANIMATE LOOP
// =======================
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  mixers.forEach(mixer => mixer.update(delta));

  controls.update();
  renderer.render(scene, camera);
}
animate();

// =======================
// RESIZE FIX
// =======================
window.addEventListener("resize", () => {
  const width = document.querySelector(".map-area").clientWidth;
  const height = document.querySelector(".map-area").clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
