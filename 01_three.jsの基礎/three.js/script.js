import * as THREE from "https://cdn.skypack.dev/three@0.132";

//モジュールの読み込み
import OrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";

//シーンの作成
const scene = new THREE.Scene();

//カメラの作成
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 500; //カメラの位置を調整

//レンダラーの作成
const renderer = new THREE.WebGLRenderer({ alpha: true }); //透明度の変更
renderer.setSize(window.innerWidth, window.innerHeight); //サイズの調整
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

//テクスチャの読み込み
const texture = new THREE.TextureLoader().load("./images/earth.jpg");

//球体ジオメトリの追加（※画面上にはまだ何も表示されない）
const geometry = new THREE.SphereGeometry(100, 64, 32);

//マテリアルの追加（※画面上にはまだ何も表示されない）
const material = new THREE.MeshStandardMaterial({
  map: texture, // テクスチャの設定
});

// メッシュで組み合わせる（※画面上にはまだ何も表示されない）
const sphere = new THREE.Mesh(geometry, material);

//シーンに追加
scene.add(sphere);

//ライトの追加
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1); //位置の調整
scene.add(light); //シーンに追加

//ポイント光源を作成
const pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);

// ポイント光源のヘルパー（場所を特定するためのもの）を作成
const helper = new THREE.PointLightHelper(pointLight, 10);
scene.add(helper);

//関数に設定
function animate() {
  //ポイント光源を動かす
  pointLight.position.set(
    200 * Math.sin(0.005 * Date.now()),
    200 * Math.sin(0.01 * Date.now()),
    200 * Math.cos(0.005 * Date.now())
  );
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

//関数の実行
animate();

//関数を追加
function onWindowResize() {
  //レンダリングサイズを再設定
  renderer.setSize(window.innerWidth, innerHeight);

  //カメラのアスペクト比を調整
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", onWindowResize);
