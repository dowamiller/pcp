//
// Computer Graphics 
//
// Uebung 2: WebGL
//
window.onload = startup;

// canvas and gl object are saved globally
var canvas;
var gl;
var shaderProgram;
var aVertexPositionId;
var posBuffer;
var aColorId;
var colorBuffer;

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
    setUpBuffers();
}

function setUpAttributes(){
    "use strict";
    aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
    aColorId = gl. getAttribLocation(shaderProgram,'aColor');
}

function setUpBuffers(){
    "use strict";
    posBuffer = gl.createBuffer();
    colorBuffer = gl.createBuffer();
    var verts = [
        0,0,
        1,0,
        1,1,
        0,0,
        -1,0,
        -1,-1
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var  colors = [
        1,0,0,1,
        1,1,0,1,
        1,0,1,1,
        0,0,1,1,
        0,1,0,1,
        1,0,0,1
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new  Float32Array(colors), gl.STATIC_DRAW);
}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer ( aVertexPositionId , 2, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray ( aVertexPositionId );
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer( aColorId , 4 , gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray ( aColorId );
    gl.drawArrays (gl. TRIANGLES ,0 ,6);
    
}