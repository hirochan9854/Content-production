import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

console.log(gsap);

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
const canvas = document.querySelector("#webgl");

/*--------------------
必須項目
--------------------*/

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
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, //「キャンバスの取得」で取得した要素に設定
  alpha: true, //追加
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);

//オブジェクトの追加
const colors = [0x97e3fd, 0xcdbefd, 0xf0e468, 0xf78fd7, 0x32c7db];

// オブジェクトの追加
function createRandomGeometry() {
  let num = 2; // 修正：サイズを適切に生成
  const geometry = new THREE.BoxGeometry(num, num, num); // 小さなボックスジオメトリ
  const wireframe = new THREE.WireframeGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: colors[Math.floor(Math.random() * colors.length)], // 修正：色をランダムに選択
  });
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
for (let i = 0; i < 100; i++) {
  // 数を増やす
  const geometry = createRandomGeometry();
  geometries.push(geometry);
  scene.add(geometry);
}

/*--------------------
イベント時の処理
--------------------*/

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
// アニメーション
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  geometries.forEach((geometry) => {
    geometry.rotation.x += 0.01;
    geometry.rotation.y += 0.01;
  });

  requestAnimationFrame(animate);
};

/*--------------------
gsap
--------------------*/
for (let i = 0; i < geometries.length; i++) {
  gsap.fromTo(
    geometries[i].position,
    {},
    {
      x: -10 + Math.random() * 20,
      scrollTrigger: {
        trigger: "#projects",
        start: "top 80%",
        end: "bottom 20%",
        markers: true,
        scrub: true,
      },
    }
  );
  gsap.fromTo(
    geometries[i].position,
    {},
    {
      y: -10 + Math.random() * 20,
      scrollTrigger: {
        trigger: "#skills",
        start: "top 80%",
        end: "bottom 20%",
        markers: true,
        scrub: true,
      },
    }
  );
  gsap.fromTo(
    geometries[i].position,
    {},
    {
      z: -10 + Math.random() * 20,
      scrollTrigger: {
        trigger: "#skills",
        start: "top 80%",
        end: "bottom 20%",
        markers: true,
        scrub: true,
      },
    }
  );
}

animate();
