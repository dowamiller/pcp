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
var vertexPositionId;
var colorId;
var normalId;
var vertexBuffer;
var colorBuffer;
var normalBuffer;
var modelViewMatrixId;
var projectionMatrixId;
var normalMatrixId;

//beleuchtung
var lightAnimationPosY = -5;
var lightAnimationPosX = 5;
var lightPosition = [0,-10,0];
var lightColor = [1,1,1];

var uLightPositionId;
var uLightColorId;


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
    vertexPositionId = gl.getAttribLocation(shaderProgram , 'aVertexPosition');
    colorId = gl.getAttribLocation(shaderProgram, 'aColor');
    normalId = gl.getAttribLocation(shaderProgram, 'aNormal');
}

function setUpUniforms(){
    modelViewMatrixId = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    projectionMatrixId = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    normalMatrixId = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');
    uLightPositionId = gl.getUniformLocation(shaderProgram, 'uLightPosition');
    uLightColorId = gl.getUniformLocation(shaderProgram, 'uLightColor');
}

function setUpBuffers(){
    "use strict";
    var vertices = [
        //front
        -0.5, -0.5, -0.5,     //v1
        0.5,-0.5,-0.5,        //v2
        -0.5,-0.5,0.5,        //v4
        0.5,-0.5,0.5,         //v3

        //back
        0.5,0.5,-0.5,         //v5
        -0.5,0.5,-0.5,        //v6
        0.5,0.5,0.5,          //v8
        -0.5,0.5,0.5,         //v7

        //right
        0.5,-0.5,-0.5,        //v2
        0.5,0.5,-0.5,         //v5
        0.5,-0.5,0.5,         //v3
        0.5,0.5,0.5,          //v8

        //left
        -0.5, -0.5, -0.5,     //v1
        -0.5,-0.5,0.5,        //v4
        -0.5,0.5,-0.5,        //v6
        -0.5,0.5,0.5,         //v7

        //top
        0.5,-0.5,0.5,         //v3
        0.5,0.5,0.5,          //v8
        -0.5,-0.5,0.5,        //v4
        -0.5,0.5,0.5,         //v7

        //bottom
        -0.5, -0.5, -0.5,     //v1
        -0.5,0.5,-0.5,        //v6
        0.5,-0.5,-0.5,        //v2
        0.5,0.5,-0.5         //v5

        ];
    vertexBuffer = gl. createBuffer ();
    gl. bindBuffer (gl. ARRAY_BUFFER , vertexBuffer );
    gl. bufferData (gl. ARRAY_BUFFER , new Float32Array ( vertices ), gl.
        STATIC_DRAW );

    var colors = [
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,

        1,1,0,
        1,1,0,
        1,1,0,
        1,1,0,

        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1,

        0,1,1,
        0,1,1,
        0,1,1,
        0,1,1,

        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,

        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0
    ]
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl. ARRAY_BUFFER , new Float32Array ( colors ), gl.
        STATIC_DRAW );

    var normals= [

        //front
        0,-1,0,
        0,-1,0,
        0,-1,0,
        0,-1,0,

        //back
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0,

        //right
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,


        //left
        -1,0,0,
        -1,0,0,
        -1,0,0,
        -1,0,0,

        //top
        0,0,1,
        0,0,1,
        0,0,1,
        0,0,1,

        //bottom
        0,0,-1,
        0,0,-1,
        0,0,-1,
        0,0,-1
    ]
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl. ARRAY_BUFFER , new Float32Array ( normals ), gl.
        STATIC_DRAW );

}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);


    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [5,5,5]);
    mat4.rotate(modelMatrix,modelMatrix,rotAngle,[-1,0.5,1]);

    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[0,-10,0],[0,0,0],[0,0,1]);
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( modelViewMatrixId ,false, modelViewMatrix);

    var projectionMatrix = mat4.create();
    mat4.frustum(projectionMatrix,-2,2,-2*canvas.height/canvas.width,2*canvas.height/canvas.width,2,20);
    gl.uniformMatrix4fv( projectionMatrixId ,false, projectionMatrix);

    var normalMatrix= mat3.create();
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(normalMatrixId, false, normalMatrix);

    setLights(viewMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorId);


    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalId, 3, gl.FLOAT, false ,0 , 0);
    gl.enableVertexAttribArray(normalId);

    gl.bindBuffer(gl.ARRAY_BUFFER , vertexBuffer);
    gl.vertexAttribPointer(vertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(vertexPositionId);
    for(var i = 0 ; i <6 ;i++){
        gl.drawArrays(gl.TRIANGLE_STRIP,i*4,4);
    }

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

function setLights ( viewMatrix ) {
     // light position must be in eye coordinates , but are specified
     // in world coordinate , so they are transformed by the current
     // view matrix
     var lightPositionEye = vec3 . create ();
     vec3 . transformMat4 ( lightPositionEye , vec3.clone(lightPosition) , viewMatrix );
     gl. uniform3fv ( uLightPositionId, lightPositionEye );
     gl. uniform3fv ( uLightColorId, lightColor );
     }

