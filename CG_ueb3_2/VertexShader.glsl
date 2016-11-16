attribute vec3 aVertexPosition;
attribute vec3 aColor;
varying vec4 vColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


void main() {
    vColor = vec4(aColor,1);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1);
}