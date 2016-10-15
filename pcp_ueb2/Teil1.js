//
// Computer Graphics 
//
// Uebung 2: WebGL
//
window.onload = startup;
window.requestAnimationFrame(drawAnimated);
// canvas and gl object are saved globally
var canvas;
var gl;
var shaderProgram;
var aVertexPositionId;
var posBuffer;
var uColorId;
var uModelViewMatrixId;
var matrixStack = [];

// middel line
var numberOfVertsLine = 2;

//Padel
var padelWidth = 15;
var padelHeight = 100;
var numberOfVertsPadel = 6;
var padelDirection = 0; // -1: up, 1: down
var padelSpeed = 0.8; // [pixel / ms]
var padel1Position;
var padel2Position;

//Ball;
var ballWidth = 12;
var ballHeight = 12;
var numberOfVertsBall = 6;
var ballDirection;
var ballSpeed=0.5; // [pixel/ms]
var ballPosition;

//PointCounter;
var numberOfVertsPointCounter;

//animation
var oldTime = null;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    canvas = document.getElementById("gameCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

function initGL() {
    "use strict";
    shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    gl.clearColor(0,0,0,1);
    setUpAttributes();
    setUpPositions();
    setUpUniforms();
    setUpBuffers();
}

function setUpAttributes(){
    "use strict";
    aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
}

function setUpUniforms(){
    uModelViewMatrixId = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    uColorId = gl.getUniformLocation(shaderProgram, 'uColorId');
}

function setUpBuffers(){
    "use strict";
    posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    var verts = setUpVerts();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
}
function setUpPositions(){
    padel1Position = [50, canvas.height/2,0];
    padel2Position = [canvas.width - 50, canvas.height/2,0];
    ballPosition = [canvas.width/2, canvas.height/2, 0];
    ballDirection = [0, 0, 0];
}

function setUpVerts(){
    var verts = [];
    verts = verts.concat([
        canvas.width/2, 0,
        canvas.width/2, canvas.height
    ]);
    verts = verts.concat([
        -padelWidth/2, -padelHeight/2,
        padelWidth/2, -padelHeight/2,
        padelWidth/2, padelHeight/2,
        padelWidth/2, padelHeight/2,
        -padelWidth/2, padelHeight/2,
        -padelWidth/2, -padelHeight/2
    ]);
    verts = verts.concat([
        -ballWidth/2, -ballHeight/2,
        ballWidth/2, -ballHeight/2,
        ballWidth/2, ballHeight/2,
        ballWidth/2, ballHeight/2,
        -ballWidth/2, ballHeight/2,
        -ballWidth/2, -ballHeight/2
    ]);
    return verts;
}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.lineWidth(100);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer ( aVertexPositionId , 2, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray ( aVertexPositionId );
    gl.uniform4fv(uColorId,[1,1,1,1]);

    //orthoprojectcion
    var matrix = mat4.create();
    mat4.ortho(matrix, 0, canvas.width, canvas.height, 0, 0, 0);
    matrixStack.push(matrix);

    //drawMiddelLine
    gl.uniformMatrix4fv( uModelViewMatrixId ,false, matrixStack[matrixStack.length-1]);
    gl.drawArrays (gl. LINES ,0 ,numberOfVertsLine);

    //draw padel 1
    matrix = mat4.clone(matrixStack[matrixStack.length-1]);
    mat4.translate(matrix, matrix,padel1Position);
    gl.uniformMatrix4fv( uModelViewMatrixId ,false, matrix);
    gl.drawArrays (gl. TRIANGLES ,numberOfVertsLine ,numberOfVertsPadel);

    //draw padel 2
    matrix = mat4.clone(matrixStack[matrixStack.length-1]);
    mat4.translate(matrix, matrix,padel2Position);
    gl.uniformMatrix4fv( uModelViewMatrixId ,false, matrix);
    gl.drawArrays (gl. TRIANGLES ,numberOfVertsLine ,numberOfVertsPadel);

    //drawBall
    matrix = mat4.clone(matrixStack[matrixStack.length-1]);
    mat4.translate(matrix, matrix, ballPosition);
    gl.uniformMatrix4fv( uModelViewMatrixId ,false, matrix);
    gl.drawArrays (gl. TRIANGLES, numberOfVertsLine + numberOfVertsPadel, numberOfVertsBall);
}

function drawAnimated ( timeStamp ) {
    if(oldTime)
    {
        var delta = timeStamp - oldTime;
        oldTime = timeStamp;
        calculateNewPadelPosition(delta);
        calculateNewBallPosition(delta);
        draw();
    } else {
        oldTime = timeStamp;
    }
    window.requestAnimationFrame(drawAnimated);
}
//window.requestAnimationFrame(drawAnimated);

function calculateNewPadelPosition(delta){
    var newY = padel1Position[1] + delta  * padelSpeed * padelDirection;
    if(newY < ((padelHeight/2) -1)) {
        padel1Position[1] = padelHeight / 2 - 1;
    } else if (newY > canvas.height - (padelHeight/2)){
        padel1Position[1] = canvas.height - (padelHeight/2);
    } else {
        padel1Position[1] = newY;
    }
    if(ballPosition[1] < padelHeight / 2 ) {
        padel2Position[1] = padelHeight / 2 - 1;
    } else if(ballPosition[1] > canvas.height - padelHeight/2 ){
        padel2Position[1] = canvas.height - padelHeight/2
    } else {
            padel2Position[1] = ballPosition[1];
    }
}

function calculateNewBallPosition(delta){
    var newX = ballPosition[0] + delta *ballDirection[0];
    var newY = ballPosition[1] = ballPosition[1] + delta *ballDirection[1];
    if (newY < 0 || newY > canvas.height){
        ballDirection[1] = -1 * ballDirection[1];
    }
    if((newX > padel1Position[0]-padelWidth/2 && newX < padel1Position[0]+padelWidth/2) && (newY > padel1Position[1] - padelHeight/2 && newY < padel1Position[1] + padelHeight/2)){
        ballDirection[0] = -1 * ballDirection[0];
    }   else if((newX > padel2Position[0]-padelWidth/2 && newX < padel2Position[0]+padelWidth/2) && (newY > padel2Position[1] - padelHeight/2 && newY < padel2Position[1] + padelHeight/2)){
        ballDirection[0] = -1 * ballDirection[0];
    }
    ballPosition[0] = ballPosition[0] + delta *ballDirection[0];
    ballPosition[1] = ballPosition[1] + delta *ballDirection[1];
    if(newX < 0 || newX > canvas.width){
        if(newX < 0){
            // Player1 -1 Point
        } else {
            //player2 -1Point
        }
        ballPosition = [canvas.width/2, canvas.height/2, 0];
        ballDirection = [0, 0, 0];
    }
}

window.addEventListener("keydown", function(event) {
    if (event.keyCode == 38) {
        padelDirection = -1;
    }
    if (event.keyCode == 40) {
        padelDirection = 1;
    }
    if (event.keyCode == 32) {
        var randAngle = Math.random()*2*Math.PI;
        ballDirection = [ballSpeed*Math.sin(randAngle), ballSpeed*Math.cos(randAngle), 0];
    }
})

window.addEventListener("keyup", function(event) {
    if (event.keyCode == 38 || event.keyCode == 40) {
        padelDirection = 0;
    }
})

