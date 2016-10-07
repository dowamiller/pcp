attribute vec2 aVertexPosition;
attribute vec4 aColor;
uniform mat3 uMatrix;
varying vec4 vColor;

void main() {
    gl_Position = vec4((uMatrix * vec3(aVertexPosition,0)),1);
    vColor = aColor;
}