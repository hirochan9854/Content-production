uniform float uFrequency;
uniform float uTime;
uniform float uMove;
uniform float uSide; //追加

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // z座標の変位をsin波で制御
  modelPosition.z += sin(modelPosition.x * uFrequency + uTime) * 0.1; //変更

  // x座標の変位をsin波で制御
  modelPosition.x += sin(modelPosition.z * uFrequency + uMove) * 0.1; //追加

  // y座標の変位をsin波で制御
  modelPosition.y += sin(modelPosition.z * uFrequency + uSide) * 0.1; //追加

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
