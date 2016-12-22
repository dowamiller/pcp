/**
 * Created by Dominik on 08.12.2016.
 */

window.onload = startup;

var canvas;
var gl;
var shaderProgram;
var lastTimeStamp;

var paddel;
var ball;
var wall1;
var wall2;
var wall3;
var wall4;
var wall5;

var error;

//beleuchtung
var lightPosition = [0,1,2];
var lightColor = [1,1,1];


function startup() {
    canvas = document.getElementById("gameCanvas");
    gl = createGLContext(canvas);
    error = new Audio()
    initGL();
    initObjects();
    initControls();
    gameLoop();
}

function  initGL() {
    gl.clearColor(0, 0, 0, 1.0);
    shaderProgram = loadAndCompileShaders(gl,'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributes();
    setUpUniforms();
}

function setUpAttributes(){
    "use strict";
    shaderProgram.aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
    shaderProgram.aColorId = gl.getAttribLocation(shaderProgram, 'aColor');
    shaderProgram.aNormalId = gl.getAttribLocation(shaderProgram, 'aNormal');
}

function setUpUniforms(){
    shaderProgram.modelViewMatrixId = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    shaderProgram.projectionMatrixId = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.normalMatrixId = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');
    shaderProgram.uLightPositionId = gl.getUniformLocation(shaderProgram, 'uLightPosition');
    shaderProgram.uLightColorId = gl.getUniformLocation(shaderProgram, 'uLightColor');
}

function  initObjects() {
    ball = defineBall(gl, 20,20,[0,0,0],[0.2,0.2,0.2]);
    paddel = definePaddel(gl,[0,0,1,0.8], [0, 0,2], [0.8,0.8,0.8]);
    wall1 = defineWall(gl,[1,1,1,1],[[-2,2,-2],[-2,2,2],[-2,-2,2],[-2,-2,-2]]);
    wall2 = defineWall(gl,[1,1,1,1],[[2,2,-2],[2,-2,-2],[2,-2,2],[2,2,2]]);
    wall3 = defineWall(gl,[1,1,1,1],[[-2,-2,2],[2,-2,2],[2,-2,-2],[-2,-2,-2]]);
    wall4 = defineWall(gl,[1,1,1,1],[[-2,2,2],[-2,2,-2],[2,2,-2],[2,2,2]]);
    wall5 = defineWall(gl,[1,1,1,1],[[-2,2,-2],[-2,-2,-2],[2,-2,-2],[2,2,-2]]);
}

function initControls() {
    window.onkeydown = function (e) {
        if (e.keyCode == 38) {
            paddel.direction[1] = 1;
        }
        if (e.keyCode == 40) {
            paddel.direction[1] = -1;
        }
        if (e.keyCode == 39) {
            paddel.direction[0] = 1;
        }
        if (e.keyCode == 37) {
            paddel.direction[0] = -1;
        }
        if(e.keyCode == 32){
            setRandomDirection(ball);
        }
    }
    window.onkeyup = function (e) {
        if(e.keyCode == 38 || e.keyCode == 40){
            paddel.direction[1] = 0;
        }
        if(e.keyCode == 39 || e.keyCode == 37){
            paddel.direction[0] = 0;
        }
    }
}

function gameLoop(){
    if(lastTimeStamp) {
        var deltaTime = Date.now() - lastTimeStamp;
        lastTimeStamp = Date.now();
        updateGame(deltaTime / 1000);
        detectAndHandleCollisions();
        draw();
    } else {
        lastTimeStamp = Date.now();
    }
    window.requestAnimationFrame(gameLoop);
}

function updateGame(deltaTime){
    updatePaddle(paddel, deltaTime);
    updateBall(ball, deltaTime)
}

function detectAndHandleCollisions(){
    detectPaddelWallCollisions(paddel, wall1);
    detectPaddelWallCollisions(paddel, wall2);
    detectPaddelWallCollisions(paddel, wall3);
    detectPaddelWallCollisions(paddel, wall4);
    detectPaddelWallCollisions(paddel, wall5);
    detectBallWallCollisions(ball, wall1);
    detectBallWallCollisions(ball, wall2);
    detectBallWallCollisions(ball, wall3);
    detectBallWallCollisions(ball, wall4);
    detectBallWallCollisions(ball, wall5);
    detectBallPaddelCollisions(ball, paddel);
}

function draw(){
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    var projectionMatrix = mat4.create();
    mat4.frustum(projectionMatrix,-2,2,-2,2,3,7.1);

    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[0,0,5],[0,0,0],[0,1,0]);

    setLights(viewMatrix);

    drawWall(gl,wall1,shaderProgram,viewMatrix,projectionMatrix);
    drawWall(gl,wall2,shaderProgram,viewMatrix,projectionMatrix);
    drawWall(gl,wall3,shaderProgram,viewMatrix,projectionMatrix);
    drawWall(gl,wall4,shaderProgram,viewMatrix,projectionMatrix);
    drawWall(gl,wall5,shaderProgram,viewMatrix,projectionMatrix);
    drawBall(gl, ball, [1, 0, 0],shaderProgram, viewMatrix, projectionMatrix);
    drawPaddel(gl, paddel,shaderProgram,viewMatrix, projectionMatrix);

}

function detectPaddelWallCollisions(paddel, wall){
    var distanceWallZero = vec3.dot(wall.points[0], wall.normal);
    var distancePaddelWall = vec3.dot(paddel.position, wall.normal) - distanceWallZero;
    if(distancePaddelWall < paddel.size[0]/2){
        paddel.position[0] = wall.normal[0] != 0 ? wall.normal[0] * (distanceWallZero + paddel.size[0] / 2) : paddel.position[0];
        paddel.position[1] = wall.normal[1] != 0 ? wall.normal[1] * (distanceWallZero + paddel.size[1] / 2) : paddel.position[1];
        paddel.position[2] = wall.normal[2] != 0 ? wall.normal[2] * (distanceWallZero + paddel.size[2] / 2) : paddel.position[2];
    }
}

function detectBallWallCollisions(ball, wall){
    var distanceWallZero = vec3.dot(wall.points[0], wall.normal);
    var distanceBallWall = vec3.dot(ball.position, wall.normal) - distanceWallZero;
    if(distanceBallWall < ball.size[0]){
        ball.direction[0] = wall.normal[0] != 0 ? ball.direction[0]* -1: ball.direction[0];
        ball.direction[1] = wall.normal[1] != 0 ? ball.direction[1]* -1: ball.direction[1];
        ball.direction[2] = wall.normal[2] != 0 ? ball.direction[2]* -1: ball.direction[2];
        playTocSound();
    }
}

function detectBallPaddelCollisions(ball, paddel){
    var distancePaddelZero = vec3.dot(paddel.position, paddel.normal);
    var distanceBallPaddel = vec3.dot(ball.position, paddel.normal) - distancePaddelZero;
    if(distanceBallPaddel < ball.size[0]*1.1) {
        if ((ball.position[0] < paddel.position[0] + paddel.size[0]/2) && (ball.position[0] > paddel.position[0] - paddel.size[0]/2)
            && (ball.position[1] < paddel.position[1] + paddel.size[1]/2) && (ball.position[1] > paddel.position[1] - paddel.size[1]/2)) {
            ball.direction[0] = paddel.normal[0] != 0 ? ball.direction[0] * -1 : ball.direction[0];
            ball.direction[1] = paddel.normal[1] != 0 ? ball.direction[1] * -1 : ball.direction[1];
            ball.direction[2] = paddel.normal[2] != 0 ? ball.direction[2] * -1 : ball.direction[2];
            playTocSound();
        }else {
            paddelLostBall(ball);
            playErrorSound();
        }
    }
}

function setLights ( viewMatrix ) {
    // light position must be in eye coordinates , but are specified
    // in world coordinate , so they are transformed by the current
    // view matrix
    var lightPositionEye = vec3 . create ();
    vec3 . transformMat4 ( lightPositionEye , vec3.clone(lightPosition) , viewMatrix );
    gl. uniform3fv ( shaderProgram.uLightPositionId, lightPositionEye );
    gl. uniform3fv ( shaderProgram.uLightColorId, lightColor );
}

function playTocSound(){
    document.getElementById('toc').play();
}

function playErrorSound(){
    document.getElementById('error').play();
}