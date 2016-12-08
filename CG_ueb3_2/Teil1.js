//
// Computer Graphics 
//
// Uebung 2: WebGL
//
window.onload = startup;
window.requestAnimationFrame(drawAnimated);

var canvas;
var gl;
var shaderProgram;
var cube;
var sphere;

//beleuchtung
var lightPosition = [0,-10,5];
var lightColor = [1,1,1];

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
    initObjects();
    draw();
}

function initGL() {
    "use strict";
    gl.clearColor(0,0,0,1);
    shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
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

function initObjects(){
    cube = defineCube(gl, [1, 0, 0], [1, 1, 0], [1, 0, 1], [0, 1, 1], [0, 0, 1], [0, 1, 0], 5);
    sphere = defineSphere(gl, 100, 100);
}

function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);

    var projectionMatrix = mat4.create();
    mat4.frustum(projectionMatrix,-2,2,-2,2,2,20);

    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix,[0,-10,0],[0,0,0],[0,0,1]);

    setLights(viewMatrix);

    gl.viewport(canvas.width/2, 0, canvas.width/2, canvas.height);
    var modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [4, 4, 4]);
    drawSphere(gl, sphere, [1, 1, 1], shaderProgram, modelMatrix, viewMatrix, projectionMatrix);

    gl.viewport(0, 0, canvas.width/2, canvas.height);
    modelMatrix = mat4.create();
    mat4.scale(modelMatrix, modelMatrix, [5,5,5]);
    mat4.rotate(modelMatrix,modelMatrix,rotAngle,[-1,0.5,1]);
    drawCube(gl, cube, shaderProgram,modelMatrix, viewMatrix, projectionMatrix);
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

function setLights ( viewMatrix ) {
     // light position must be in eye coordinates , but are specified
     // in world coordinate , so they are transformed by the current
     // view matrix
     var lightPositionEye = vec3 . create ();
     vec3 . transformMat4 ( lightPositionEye , vec3.clone(lightPosition) , viewMatrix );
     gl. uniform3fv ( shaderProgram.uLightPositionId, lightPositionEye );
     gl. uniform3fv ( shaderProgram.uLightColorId, lightColor );
     }

