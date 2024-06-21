import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import Stats from "stats-js";

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
