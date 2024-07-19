uniform sampler2D uTex;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(uTex, vUv);
  gl_FragColor = texColor;
}
