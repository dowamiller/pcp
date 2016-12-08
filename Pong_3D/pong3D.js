/**
 * Created by Dominik on 08.12.2016.
 */

var canvas;
var gl;
var shaderProgram;

function startup() {
    canvas = document.getElementById("gameCanvas");
    gl = createGLContext(canvas);
    initGL();
    initObjects();
    initControls();
    gameLoop();
}

function  initGL() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    shaderProgram = loadAndCompileShaders(gl,'VertexShader.glsl', 'FragmentShader.glsl');
    setupAbributes();
}

function  initObjects() {

}

function initControls() {

}

function gameLoop(){

}