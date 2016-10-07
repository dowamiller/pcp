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
var buffer;
var uColorId;

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
    setUpUniforms();
}

function setUpAttributes(){
    "use strict";
    aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
}

function setUpBuffers(){
    "use strict";
    buffer = gl.createBuffer();
    var verts = [
        0,0,
        1,0,
        1,1,
        0,0,
        -1,0,
        -1,-1
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
}

function setUpUniforms(){
    uColorId = gl.getUniformLocation(shaderProgram, "uColor");
}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer ( aVertexPositionId , 2, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray ( aVertexPositionId );
    gl.uniform4f(uColorId, 0,1,0,1);
    gl.drawArrays (gl. TRIANGLES ,0 ,3);
    gl.uniform4f(uColorId, 1,0,1,1);
    gl.drawArrays (gl. TRIANGLES ,3 ,3);
    
}