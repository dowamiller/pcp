attribute vec3 aVertexPosition;
attribute vec4 aColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1);
}