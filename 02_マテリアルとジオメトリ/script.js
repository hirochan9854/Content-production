//モジュールの読み込み
import * as THREE from "https://cdn.skypack.dev/three@0.132";
import OrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";
import Stats from "https://cdn.skypack.dev/stats.js.fps";

//モジュールの追加
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

//GUIの追加
const gui = new GUI();

//スタッツの追加
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

//シーンの追加
const scene = new THREE.Scene();

//カメラの追加
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 5);

//レンダラーの追加
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//マウス操作機能の追加
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

//物体の追加
const boxGeometry = new THREE.BoxGeometry();
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const torusGeometry = new THREE.TorusGeometry(0.5, 0.15, 30, 50, 4.5);

const count = 50; //変数追加
const bufferGeometry = new THREE.BufferGeometry();

//「三角形の座標9点 * count」分の配列を用意する
const vertices = new Float32Array(9 * count);

//for文でランダムな値を代入
for (let i = 0; i < 9 * count; i++) {
  vertices[i] = (Math.random() - 0.5) * 10; //大きさを２倍に
  console.log(vertices[i]);
}

bufferGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const bufferMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
const buffer = new THREE.Mesh(bufferGeometry, bufferMaterial);
// scene.add(buffer);

const material = new THREE.MeshNormalMaterial({ wireframe: false });

const box = new THREE.Mesh(boxGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

box.position.set(0, 0.5, 0);

sphere.position.set(1.5, 0.5, 0);

torus.position.set(-1.5, 0.5, 0);
torus.rotation.z = Math.PI * 0.3;

plane.position.set(0, -0.5, 0);
plane.rotation.x = -Math.PI * 0.5;

scene.add(box, sphere, plane, torus);

gui.add(box.position, "x").min(-3).max(3).step(0.1).name("translteX");
gui.add(box.position, "y").min(-3).max(3).step(0.1).name("translteY");
gui.add(box.position, "z").min(-3).max(3).step(0.1).name("translteZ");
gui.add(box.rotation, "x").min(0).max(6.28).name("rotateX");
gui.add(box.rotation, "y").min(0).max(6.28).name("rotateY");

gui.add(material, "visible");
gui.add(material, "wireframe");

//ライトの追加
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1);
scene.add(light);

//アニメーション関数
function animate() {
  stats.begin();
  controls.update();
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

//アニメーションを実行
animate();

//ウィンドウリサイズ時の処理
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", onWindowResize);
