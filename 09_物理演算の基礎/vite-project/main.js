import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { phy } from "phy-engine";

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
const canvas = document.querySelector("#webgl");

// サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(6, 6, 12);
scene.add(camera);

// ライトの追加
const light = new THREE.DirectionalLight(0xffffff);
scene.add(light);

// 中央線の表示
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/*--------------------
イベント時の処理
--------------------*/

// マウスコントロール
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

// アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  controls.update();

  requestAnimationFrame(animate);
};

/*--------------------
物理演算
--------------------*/

// 雪玉の追加
function addSnowball() {
  const snowballMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // 白色
  });

  const snowballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const snowball = new THREE.Mesh(snowballGeometry, snowballMaterial);

  snowball.position.set(
    Math.random() * 50 - 25,
    Math.random() * 50,
    Math.random() * 50 - 25
  );

  phy.add({
    mesh: snowball,
    type: "sphere",
    size: [0.1, 0.1, 0.1],
    pos: [snowball.position.x, snowball.position.y, snowball.position.z],
    rot: [0, 0, 0],
    density: 0.1,
    restitution: 0.3,
  });
}

const phyReady = () => {
  phy.activeMouse(controls, "drag");
  phy.set({ gravity: [0, -5, 0] });

  // 雪玉をランダムに追加
  for (let i = 0; i < 30; i++) {
    addSnowball();
  }
};

phy.init({
  type: "PHYSX",
  worker: true,
  compact: true,
  scene: scene,
  renderer: renderer,
  callback: phyReady,
});

document.addEventListener("dblclick", () => {
  addSnowball();
});

setInterval(() => {
  addSnowball();
}, 10);

animate();
