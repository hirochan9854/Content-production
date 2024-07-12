import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
camera.position.set(6, 6, 6);
scene.add(camera);

//周囲光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const lightFolder = gui.addFolder("Light");
lightFolder.add(light, "intensity", 0, 3, 0.01).name("AmbientLight");

//平行光源
const directionalLight = new THREE.DirectionalLight(0xff0fff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(3, 3, 0);

lightFolder
  .add(directionalLight, "intensity", 0, 3, 0.01)
  .name("DirectionalLight");

//半球光源
const hemisphereLight = new THREE.HemisphereLight(0x0fffff, 0xffff00, 0.5);
scene.add(hemisphereLight);

lightFolder
  .add(hemisphereLight, "intensity", 0, 3, 0.01)
  .name("HemisphereLight");

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/*--------------------
3Dモデル
--------------------*/

//オブジェクトの追加
const key = {
  up: false,
  down: false,
  right: false,
  left: false,
};

//グループの追加
const group = new THREE.Group();
group.position.set(0, 0.8, 0);
scene.add(group);

// テクスチャの読み込み
const mtlLoader = new MTLLoader();
mtlLoader.load("models/Phoenix/Phoenix-bl.mtl", (materials) => {
  materials.preload();

  //OBJデータの読み込み（カッコ内に移動）
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load("models/Phoenix/Phoenix-bl.obj", (obj) => {
    obj.position.set(0, 0, 0);
    // group.add(obj);

    const scl = {
      val: 0.5,
    };
    obj.scale.set(scl.val, scl.val, scl.val);

    const scaleFolder = gui.addFolder("Scale");
    scaleFolder.add(scl, "val", 0.1, 1, 0.01).onChange((val) => {
      obj.scale.set(val, val, val);
    });

    const positionFolder = gui.addFolder("Position");
    positionFolder.add(obj.position, "x", -10, 10, 0.1);
    positionFolder.add(obj.position, "y", -10, 10, 0.1);
    positionFolder.add(obj.position, "z", -10, 10, 0.1);

    const rotationFolder = gui.addFolder("Rotation");
    rotationFolder.add(obj.rotation, "x", -10, 10, 0.1);
    rotationFolder.add(obj.rotation, "y", -10, 10, 0.1);
    rotationFolder.add(obj.rotation, "z", -10, 10, 0.1);

    // キーダウンイベント設定（変更）
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          key.up = true;
          break;
        case "ArrowDown":
          key.down = true;
          break;
        case "ArrowRight":
          key.right = true;
          break;
        case "ArrowLeft":
          key.left = true;
          break;
        case "KeyR":
          group.position.set(0, 0.8, 0);
          group.rotation.set(0, 0, 0);
          camera.position.set(6, 6, 6);
          break;
        case "Space":
          key.space = true;
          break;
      }
    });

    // キーアップイベント設定（追加）
    document.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "ArrowUp":
          key.up = false;
          break;
        case "ArrowDown":
          key.down = false;
          break;
        case "ArrowRight":
          key.right = false;
          break;
        case "ArrowLeft":
          key.left = false;
          break;
        case "Space":
          key.space = false;
          break;
      }
    });
  });
});

//GLTFデータの読み込み
const gltfLoader = new GLTFLoader();
gltfLoader.load("models/rock/rock_01_4k.gltf", (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  group.add(gltf.scene);
});
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//床を追加
const floor = new THREE.BoxGeometry(10, 0.1, 10);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.3,
  roughness: 0.4,
});
const floorMesh = new THREE.Mesh(floor, floorMaterial);
floorMesh.position.y = 0;
scene.add(floorMesh);

/*--------------------
イベント時の処理
--------------------*/

//マウスコントロール
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

  controls.update();

  if (key.up && group.position.z > -4) {
    group.position.z -= 0.1;
    group.rotation.y = 3.1;
    group.rotation.x -= 5;
  }
  if (key.down && group.position.z < 4) {
    group.position.z += 0.1;
    group.rotation.y = 0;
    group.rotation.x -= 5;
  }
  if (key.right && group.position.x < 4) {
    group.position.x += 0.1;
    group.rotation.y = 1.6;
    group.rotation.x -= 5;
  }
  if (key.left && group.position.x > -4) {
    group.position.x -= 0.1;
    group.rotation.y = -1.6;
    group.rotation.x -= 5;
  }
  if (key.space) {
    group.position.y += 0.1;
    camera.position.y = group.position.y + 6;
  }

  requestAnimationFrame(animate);
};

animate();
