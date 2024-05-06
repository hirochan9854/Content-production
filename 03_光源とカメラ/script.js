import * as THREE from "https://cdn.skypack.dev/three@0.132";
import OrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";
import Stats from "https://cdn.skypack.dev/stats.js.fps";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//サイズ
const size = {
  w: window.innerWidth,
  h: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(75, size.w / size.h, 0.1, 100);
// const camera = new THREE.OrthographicCamera(-500, 500, 300, -300, 0.1, 100);
camera.position.set(0, 1, 5);
scene.add(camera);

//ライト

// //周囲光
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
// gui.add(ambientLight, "intensity", 0, 1, 0.01).name("ambientLight");

// //平行光
// const directionalLight = new THREE.DirectionalLight(0xff0fff, 0.5);
// scene.add(directionalLight);
// gui.add(directionalLight, "intensity", 0, 1, 0.01).name("directionalLight");

//半球光源
const hemisphereLight = new THREE.HemisphereLight(0x0fffff, 0xffff00, 0.5);
scene.add(hemisphereLight);
gui.add(hemisphereLight, "intensity", 0, 1, 0.01).name("hemisphereLight");

//ポイント光源
const pointLight = new THREE.PointLight(0xee7800, 1);
pointLight.position.set(-10, 10, 0);
scene.add(pointLight);
gui.add(pointLight, "intensity", 0, 1, 0.01).name("pointLight(intensity)");
gui.add(pointLight, "distance", 0, 20, 0.01).name("pointLight(distance)");

//マテリアル
const material = new THREE.MeshStandardMaterial();

//オブジェクト
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

//レンダラー
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(size.w, size.h);
document.body.appendChild(renderer.domElement);

//コントロール
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.1;

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  camera.position.x = e.clientX / size.w - 0.5;
  camera.position.y = 0.5 - e.clientY / size.h;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  console.log(camera.position.x);
  console.log(camera.position.y);
});

camera.lookAt(new THREE.Vector3(0, 0, 0));

//アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(animate);
};

animate();

//リサイズ
const onWindowResize = () => {
  size.w = window.innerWidth;
  size.h = window.innerHeight;
  renderer.setSize(size.w, size.h);

  camera.aspect = size.w / size.h;
  camera.updateProjectionMatrix();
};

window.addEventListener("resize", onWindowResize);
