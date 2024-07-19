uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float wave1 = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  float wave2 = sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
  modelPosition.z += wave1 + wave2;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  vUv = uv;
}
