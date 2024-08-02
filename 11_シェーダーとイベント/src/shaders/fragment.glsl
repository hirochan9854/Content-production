uniform float r;
uniform float g;
uniform float b;

void main(){
  gl_FragColor = vec4(r, g, b, 1.0); //色の定義(赤、緑、青、不透明度)
}