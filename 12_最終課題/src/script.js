import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"; //追加

gsap.registerPlugin(ScrollTrigger);

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/*--------------------
必須項目
--------------------*/

//キャンバスの取得
const canvas = document.querySelector("#webgl");

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 6);
scene.add(camera);

//ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //追加
});
renderer.setSize(sizes.width, sizes.height);

/*--------------------
3Dモデル
--------------------*/

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/scene.gltf", (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.05, 0.05, 0.05);
  model.rotation.set(-1.3, -0.12, -0.4);
  scene.add(model);

  // GSAPとScrollTriggerの設定

  // GSAPとScrollTriggerの設定
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "body", // トリガーとなる要素
        start: "top", // アニメーションの開始位置
        end: "bottom", // アニメーションの終了位置
        scrub: true, // スクロールに応じてアニメーション
        markers: true, // デバッグ用のマーカー（必要に応じて削除）
      },
    })
    .to(model.scale, {
      x: 0.2,
      y: 0.2,
      z: 0.2,
      ease: "power1.inOut", // スムーズなイージング
      duration: 2, // アニメーションの持続時間
    });
});

/*--------------------
イベント時の処理
--------------------*/

const geometries = [];
const createMultipleOctahedrons = () => {
  // テクスチャのロード
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load();

  for (let i = 0; i < 100; i++) {
    // ランダムなサイズと位置を生成
    const size = Math.random() * 0.5 + 0.1;
    const x = Math.random() * 10 - 5; // x座標は-5から5の範囲でランダム
    const y = Math.random() * 10 - 5; // y座標は-5から5の範囲でランダム
    const z = Math.random() * 10 - 5; // z座標は-5から5の範囲でランダム

    const octahedronGeometry = new THREE.OctahedronGeometry(size);
    // テクスチャを適用したマテリアルを作成
    const octahedronMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);

    // ランダムな位置に設定
    octahedron.position.set(x, y, z);

    geometries.push(octahedron);
    scene.add(octahedron);
  }
};

createMultipleOctahedrons();

window.addEventListener("resize", () => {
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
});

//アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  const animate = () => {
    requestAnimationFrame(animate);

    geometries.forEach((geometry) => {
      // 回転をランダムに変化させる
      geometry.rotation.x += Math.random() * 0.1;
      geometry.rotation.y += Math.random() * 0.1;
    });

    renderer.render(scene, camera);
  };

  requestAnimationFrame(animate);
};

animate();
