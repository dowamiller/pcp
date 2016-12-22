attribute vec3 aVertexPosition;
attribute vec4 aColor;
attribute vec3 aNormal;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;


void main() {
    vColor = aColor;
    vec4 vertexPositon4 = (uModelViewMatrix * vec4(aVertexPosition,1));
    vVertexPosition = vertexPositon4.xyz / 1.0;
    vNormal = normalize(uNormalMatrix*aNormal);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition,1);
}