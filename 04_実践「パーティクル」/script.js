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
camera.position.set(1, 1, 2);
scene.add(camera);

//ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//テクスチャ設定
const texture = new THREE.TextureLoader().load("./textures/14.gif");

//パーティクル
const particlesGeometry = new THREE.SphereGeometry(1, 12, 12);
// const material = new THREE.MeshStandardMaterial();
// const sphere = new THREE.Mesh(particlesGeometry, material);
// scene.add(sphere);

const pointMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
  color: 0xff0fff,
});
const particles = new THREE.Points(particlesGeometry, pointMaterial);
// scene.add(particles);

//バッファジオメトリ
const bufferGeometry = new THREE.BufferGeometry();
const count = 50;
const vertices = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

//for文でランダムな値を代入
for (let i = 0; i < count * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
console.log(vertices);

//ジオメトリに組み込む
bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
bufferGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

//プロパティを調整
const pointMaterial2 = new THREE.PointsMaterial({
  size: 0.5,
  alphaMap: texture,
  colors: 0x00000ff,
  sizeAttenuation: true,
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});

pointMaterial2.map = texture;

//メッシュ化
const particles2 = new THREE.Points(bufferGeometry, pointMaterial2);
scene.add(particles2);

gui.add(pointMaterial2, "size", 0.01, 1);

//レンダラー
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(size.w, size.h);
document.body.appendChild(renderer.domElement);

//コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const clock = new THREE.Clock();
//アニメーション
const animate = () => {
  stats.begin();
  controls.update();
  const elapsedTime = clock.getElapsedTime();

  //座標の変更
  for (let i = 0; i < count; i++) {
    const i3 = i * 1;
    const x = bufferGeometry.attributes.position.array[i3]; //追加
    bufferGeometry.attributes.position.array[i3 + 2] = Math.sin(
      elapsedTime - x
    ); //変更
  }

  bufferGeometry.attributes.position.needsUpdate = true; //おまじない

  console.log(elapsedTime);

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
