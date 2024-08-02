import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";

console.log(THREE);

// UIデバッグ
const gui = new GUI();

// FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/*--------------------
必須項目
--------------------*/

// キャンバスの取得
const canvas = document.querySelector(".webgl");

// サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 6);
scene.add(camera);

// ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

/*--------------------
オブジェクトの追加
--------------------*/

// マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

// UIデバッグ
gui.addColor(material, "color");
gui.add(material, "metalness", 0, 1, 0.001);
gui.add(material, "roughness", 0, 1, 0.001);

// ジオメトリ
const mesh1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), material);
const mesh2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), material);
const mesh3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), material);

// 位置の調整
mesh1.position.set(0, 0, 0);
mesh2.position.set(2, 0, 0);
mesh3.position.set(-2, 0, 0);

// scene.add(mesh1, mesh2, mesh3);

// ランダムな幾何学模様（線のみ）の生成関数
function createRandomGeometry() {
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // 小さなボックスジオメトリ
  const wireframe = new THREE.WireframeGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.LineSegments(wireframe, material);
  line.position.x = (Math.random() - 0.5) * 20;
  line.position.y = (Math.random() - 0.5) * 20;
  line.position.z = (Math.random() - 0.5) * 20;

  // ランダムな回転
  line.rotation.x = Math.random() * 2 * Math.PI;
  line.rotation.y = Math.random() * 2 * Math.PI;
  line.rotation.z = Math.random() * 2 * Math.PI;
  return line;
}

// 立方体のリストを保持
const geometries = [];

// 複数のランダムな幾何学模様をシーンに追加
for (let i = 0; i < 1000; i++) {
  // 数を増やす
  const geometry = createRandomGeometry();
  geometries.push(geometry);
  scene.add(geometry);
}

const bufferGeometry = new THREE.BufferGeometry();
const count = 5000;
const vertices = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 10;
}

bufferGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const pointMaterial = new THREE.PointsMaterial({
  size: 0.025,
  sizeAttenuation: true,
  color: 0x000000,
});

const particles = new THREE.Points(bufferGeometry, pointMaterial);
scene.add(particles);

renderer.render(scene, camera);

window.addEventListener("resize", () => {
  // サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
});

// マウスに反応させる
const cursor = {
  x: 0,
  y: 0,
};

// 追加
const dist = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = 0.5 - e.clientY / sizes.height;
});

// アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  // meshを回転させる
  mesh1.rotation.x += 0.001;
  mesh1.rotation.y += 0.001;
  mesh2.rotation.x += 0.001;
  mesh2.rotation.y += 0.001;
  mesh3.rotation.x += 0.001;
  mesh3.rotation.y += 0.001;

  // カメラの移動（変更）
  dist.x += (cursor.x - dist.x) * 0.01;
  dist.y += (cursor.y - dist.y) * 0.01;
  camera.position.x = dist.x;
  camera.position.y = dist.y;

  geometries.forEach((geometry) => {
    geometry.rotation.x += 0.002;
    geometry.rotation.y += 0.002;
  });

  requestAnimationFrame(animate);
};

animate();
