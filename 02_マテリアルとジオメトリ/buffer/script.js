import * as THREE from "https://cdn.skypack.dev/three@0.132";
import OrbitControls from "https://cdn.skypack.dev/threejs-orbit-controls";
import Stats from "https://cdn.skypack.dev/stats.js.fps";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

//GUIの作成
const gui = new GUI();

//スタッツの作成＆設定
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//シーンの作成
const scene = new THREE.Scene();

//カメラの作成＆設定
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラーの作成＆設定
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//コントローラーの作成＆設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

//バッファジオメトリで三角形を複数生成
// const count = 50;
const obj = {
  count: 50,
  size: 2,
};

const drawBuffer = (count, size) => {
  //   scene.remove(buffer);
  const bufferGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(9 * count);

  for (let i = 0; i < 9 * count; i++) {
    vertices[i] = (Math.random() - 0.5) * size;
  }

  bufferGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );

  const bufferMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  const mesh = new THREE.Mesh(bufferGeometry, bufferMaterial);
  return mesh;
  //   scene.add(buffer);
};

let buffer = drawBuffer(obj.count, obj.size);
scene.add(buffer);

gui.add(obj, "count", 0, 100, 1).onChange((value) => {
  scene.remove(buffer);
  buffer.material.dispose(); //追加
  buffer.geometry.dispose(); //追加
  buffer = drawBuffer(obj.count, obj.size);
  scene.add(buffer);
});
gui.add(obj, "size", 0, 10, 0.1).onChange((value) => {
  scene.remove(buffer);
  buffer.material.dispose(); //追加
  buffer.geometry.dispose(); //追加
  buffer = drawBuffer(obj.count, obj.size);
  scene.add(buffer);
});

//アニメーション関数の定義
const animate = () => {
  stats.begin();
  controls.update();
  renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(animate);
};

//アニメーション関数の実行
animate();

//ブラウザリサイズ時の関数の定義
const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

//ブラウザにリサイズイベントを登録
window.addEventListener("resize", onWindowResize);
