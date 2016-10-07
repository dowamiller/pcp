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
var cirlceVerts;
var cirlceColors;
var rotInRadians = 0;
var uMatrixId;
var start = null;

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
    gl.clearColor(1,1,1,1);
    setUpAttributes();
    setUpUniforms();
    setUpBuffers();
}

function setUpAttributes(){
    "use strict";
    aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
    aColorId = gl. getAttribLocation(shaderProgram,'aColor');
}

function setUpUniforms(){
    uMatrixId = gl.getUniformLocation(shaderProgram, 'uMatrix');
}

function setUpBuffers(){
    "use strict";
    constructCircle();
    colorCircle();
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
    gl.bufferData(gl.ARRAY_BUFFER, cirlceVerts, gl.STATIC_DRAW);
    var  colors = [
        1,0,0,1,
        1,1,0,1,
        1,0,1,1,
        0,0,1,1,
        0,1,0,1,
        1,0,0,1
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cirlceColors, gl.STATIC_DRAW);
}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer ( aVertexPositionId , 2, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray ( aVertexPositionId );
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer( aColorId , 4 , gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray (aColorId);
    var rotMatrix = makeRotation(rotInRadians);
    var scaleMatrix = makeScale(canvas.height / canvas.width,1);
    //var matrix =
    gl.uniformMatrix3fv(uMatrixId, false, rotMatrix);
    gl.drawArrays (gl. TRIANGLE_FAN ,0 ,362);

}

function constructCircle(){
    cirlceVerts = new Float32Array(362*2);
    var i = 0;
    var deg = 0;
    cirlceVerts[i++] = 0;
    cirlceVerts[i++] = 0;
    do {
        cirlceVerts[i++] = Math.cos((Math.PI / 180) * deg);
        cirlceVerts[i++] = Math.sin((Math.PI / 180) * deg);
        deg++;
    } while(i<(362*2)-1)
}

function colorCircle(){
    cirlceColors = new Float32Array(362*4);
    var deg = 0;
    var i = 0;
    cirlceColors[i++]= 0;
    cirlceColors[i++]= 0;
    cirlceColors[i++]= 0;
    cirlceColors[i++]= 1;
    do {
        cirlceColors[i++]= Math.sin((Math.PI / 180)*deg);
        cirlceColors[i++]= Math.sin((Math.PI / 180)*deg);
        cirlceColors[i++]= 0;
        cirlceColors[i++]= 1;
        deg = deg+3;
    }while(i<(362*4)-1)
}

function makeRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    ];
}

function makeScale(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    ];

function drawAnimated ( timeStamp ) {
    if(!start) start = timeStamp;
    var progress = timeStamp - start;
    rotInRadians =(2 * Math.PI / 7) * (progress) / 1000;
    draw();
    window.requestAnimationFrame(drawAnimated);
}
window.requestAnimationFrame ( drawAnimated );