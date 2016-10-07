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
    setUpBuffers();
}

function setUpAttributes(){
    "use strict";
    aVertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
    aColorId = gl. getAttribLocation(shaderProgram,'aColor');
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
    gl.enableVertexAttribArray ( aColorId );
    gl.drawArrays (gl. TRIANGLE_FAN ,0 ,362);
}

function constructCircle(){
    cirlceVerts = new Float32Array(362*2);
    var i = 0;
    var deg = 0;
    cirlceVerts[i++] = 0;
    cirlceVerts[i++] = 0;
    do {
        cirlceVerts[i++] = Math.cos((Math.PI / 180) * deg)*(canvas.height/canvas.width);
        cirlceVerts[i++] = Math.sin((Math.PI / 180) * deg);
        deg++;
    } while(i<(362*2)-1)
}

function colorCircle(){
    cirlceColors = new Float32Array(362*4);
    var i = 0;
    cirlceColors[i++]= 0;
    cirlceColors[i++]= 0;
    cirlceColors[i++]= 0;
    cirlceColors[i++]= 1;
    do {
        cirlceColors[i++]= 0;
        cirlceColors[i++]= Math.random();
        cirlceColors[i++]= 0;
        cirlceColors[i++]= 1;
    }while(i<(362*4)-1)
}