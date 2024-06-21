import "./style.css";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats-js";

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
camera.position.set(0, 0, 6);
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

let text;

// グループを作ってシーンに追加
const group = new THREE.Group();
scene.add(group);

// 桁数を揃える
const leftFillNum = (num) => {
  return num.toString().padStart(2, "0");
};

// 時計の針の作成
const createHand = (length, color) => {
  const geometry = new THREE.BoxGeometry(0.1, length, 0.1);
  geometry.translate(0, length / 2, 0); // 原点を一端に移動
  const material = new THREE.MeshBasicMaterial({ color: color });
  const hand = new THREE.Mesh(geometry, material);
  hand.position.z = -0.2; // 針の位置を調整
  return hand;
};

const secondHand = createHand(3, 0x7bcce2);
const minuteHand = createHand(4, 0x86a1ed);
const hourHand = createHand(5, 0x89dedf);

scene.add(secondHand, minuteHand, hourHand);

// 時間を表示する
const drawTime = (font) => {
  group.remove(text);

  const now = new Date();
  const hour = leftFillNum(now.getHours());
  const minute = leftFillNum(now.getMinutes());
  const second = leftFillNum(now.getSeconds());
  const milliSecond = now.getMilliseconds();
  const currentTime = `${hour}:${minute}:${second}`;

  const textGeometry = new TextGeometry(currentTime, {
    font: font,
    size: 1,
    depth: -0.2,
  });
  textGeometry.center();

  text = new THREE.Mesh(
    textGeometry,
    new THREE.MeshBasicMaterial({ color: 0xefd8f0 })
  );
  group.add(text);

  // 時計の針の回転を更新
  const secondAngle =
    (now.getSeconds() + now.getMilliseconds() / 1000) * (Math.PI / 30);
  const minuteAngle =
    (now.getMinutes() + now.getSeconds() / 60) * (Math.PI / 30);
  const hourAngle =
    ((now.getHours() % 12) + now.getMinutes() / 60) * (Math.PI / 6);

  secondHand.rotation.z = -secondAngle;
  minuteHand.rotation.z = -minuteAngle;
  hourHand.rotation.z = -hourAngle;

  setTimeout(drawTime, 1000 - milliSecond, font);
};

// フォントの読み込み
const fontLoader = new FontLoader();
fontLoader.load("./fonts/Dosis_Regular.json", (font) => {
  setTimeout(drawTime, 1000, font);
});

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

  // コントロールの更新
  controls.update();

  requestAnimationFrame(animate);
};

animate();

const geometry = new THREE.RingGeometry(-1, 5, 12);
const material = new THREE.MeshBasicMaterial({
  color: 0x333333,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -0.5;
scene.add(mesh);
