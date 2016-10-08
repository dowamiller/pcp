attribute vec2 aVertexPosition;
attribute vec4 aColor;
uniform mat3 uRotMatrix;
uniform mat3 uScaleMatrix;
varying vec4 vColor;

void main() {
    gl_Position = vec4((uScaleMatrix * uRotMatrix * vec3(aVertexPosition,0)),1);
    vColor = aColor;
}