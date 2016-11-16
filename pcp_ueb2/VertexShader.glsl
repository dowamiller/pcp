attribute vec2 aVertexPosition;
attribute vec4 aColor;
uniform mat4 uModelViewMatrix ;
uniform mat4 uModelViewMatrix ;

void main() {
    gl_Position = uModelViewMatrix * vec4(aVertexPosition,0,1);
}