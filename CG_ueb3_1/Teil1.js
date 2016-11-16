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
var vertexBuffer;
var edgeBuffer;
var uColorId;
var modelViewMatrixId;
var projectionMatrixId;

//animation
var oldTime = null;
twoPlayerMode = false;
var rotAngle = 0;

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
    setUpUniforms();
    setUpBuffers();
}

function setUpAttributes(){
    "use strict";
    aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
}

function setUpUniforms(){
    modelViewMatrixId = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    projectionMatrixId = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    uColorId = gl.getUniformLocation(shaderProgram, 'uColor');
}

function setUpBuffers(){
    "use strict";
    var vertices = [
        -0.5,-0.5,-0.5, // v0
        0.5,-0.5,-0.5, // v1
        0.5,0.5,-0.5, // v2
        -0.5,0.5,-0.5, // v3
        -0.5,-0.5,0.5, // v4
        0.5,-0.5,0.5, // v5
        0.5,0.5,0.5, // v6
        -0.5,0.5,0.5 // v7
        ];
    vertexBuffer = gl. createBuffer ();
    gl. bindBuffer (gl. ARRAY_BUFFER , vertexBuffer );
    gl. bufferData (gl. ARRAY_BUFFER , new Float32Array ( vertices ), gl.
        STATIC_DRAW );
    var vertexIndices = [
        0,1,
        1,2,
        2,3,
        3,0,
        0,4,
        1,5,
        2,6,
        3,7,
        4,5,
        5,6,
        6,7,
        7,4
    ];
    edgeBuffer = gl. createBuffer ();
    gl. bindBuffer (gl. ELEMENT_ARRAY_BUFFER , edgeBuffer );
    gl. bufferData (gl. ELEMENT_ARRAY_BUFFER , new Uint16Array ( vertexIndices ), gl. STATIC_DRAW );
}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);


    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [5,5,5]);
    mat4.rotate(modelMatrix,modelMatrix,rotAngle,[0,0,1]);

    gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height/2);
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[10,0,3],[0,0,0],[0,0,1]);
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( modelViewMatrixId ,false, modelViewMatrix);
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix,-10,10,-10*canvas.height/canvas.width,10*canvas.height/canvas.width,2,20);
    gl.uniformMatrix4fv( projectionMatrixId ,false, projectionMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.vertexAttribPointer(aVertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , edgeBuffer);
    gl.drawElements(gl.LINES , 24, gl.UNSIGNED_SHORT , 0);

    gl.viewport(0, 0, canvas.width/2, canvas.height/2);
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[10,0,0],[0,0,0],[0,0,1]);
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( modelViewMatrixId ,false, modelViewMatrix);
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix,-10,10,-10*canvas.height/canvas.width,10*canvas.height/canvas.width,2,20);
    gl.uniformMatrix4fv( projectionMatrixId ,false, projectionMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.vertexAttribPointer(aVertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , edgeBuffer);
    gl.drawElements(gl.LINES , 24, gl.UNSIGNED_SHORT , 0);

    gl.viewport(0, canvas.height/2, canvas.width/2, canvas.height/2);
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[0,0,10],[0,0,0],[0,1,0]);
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( modelViewMatrixId ,false, modelViewMatrix);
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix,-10,10,-10*canvas.height/canvas.width,10*canvas.height/canvas.width,2,20);
    gl.uniformMatrix4fv( projectionMatrixId ,false, projectionMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.vertexAttribPointer(aVertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , edgeBuffer);
    gl.drawElements(gl.LINES , 24, gl.UNSIGNED_SHORT , 0);

    gl.viewport(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2);
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[10,0,3],[0,0,0],[0,0,1]);
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( modelViewMatrixId ,false, modelViewMatrix);
    var projectionMatrix = mat4.create();
    mat4.frustum(projectionMatrix,-2,2,-2*canvas.height/canvas.width,2*canvas.height/canvas.width,2,20);
    gl.uniformMatrix4fv( projectionMatrixId ,false, projectionMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.vertexAttribPointer(aVertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER , edgeBuffer);
    gl.drawElements(gl.LINES , 24, gl.UNSIGNED_SHORT , 0);
}

function drawAnimated ( timeStamp ) {
    if(oldTime)
    {
        var delta = timeStamp - oldTime;
        oldTime = timeStamp;
        rotAngle += (delta/1000) * Math.PI/2
        if(rotAngle >= 2 * Math.PI)
            rotAngle -= 2 * Math.PI;
        draw();
    } else {
        oldTime = timeStamp;
    }
    window.requestAnimationFrame(drawAnimated);
}

function getRandomizer(bottom, top) {
    return Math.floor(Math.random() * ( 1 + top - bottom )) + bottom;
}

