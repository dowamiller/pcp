/**
 * Created by Dominik on 08.12.2016.
 */
/**
 * Define and draw a paddel.
 */

function definePaddelVertices(gl) {
    "use strict";
    // define the vertices of the paddel
    var vertices = [
        -0.5, 0.5, 0,       // v0
        -0.5, -0.5, 0,        // v1
        0.5, 0.5, 0,         // v2
        0.5,-0.5, 0        // v3
    ];
    var bufferVertices  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return bufferVertices;
}

function definePaddelColor(gl, paddelColor) {
    "use strict";
    // make 4 entries, one for each vertex
    var allVerts = paddelColor.concat(paddelColor, paddelColor, paddelColor);
    var bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allVerts), gl.STATIC_DRAW);
    return bufferColor;
}

function definePaddelNormals(gl, normal) {
    "use strict";
    var paddelNormal = [0.0, 0.0, 1.0];
    // make 4 entries, one for each vertex
    var allVertsNormal = normal.concat(normal, normal, normal);
    var bufferNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allVertsNormal), gl.STATIC_DRAW);
    return bufferNormals;
}

function drawPaddel(gl, paddel, shaderProgramm, viewMatrix, projectionMatrix) {
    "use strict";
    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix,modelMatrix, paddel.position);
    mat4.scale(modelMatrix, modelMatrix, paddel.size);
    //mat4.rotate(modelMatrix,modelMatrix, Math.PI/4, [1,0,0]);
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( shaderProgram.modelViewMatrixId ,false, modelViewMatrix);

    gl.uniformMatrix4fv( shaderProgram.projectionMatrixId ,false, projectionMatrix);

    var normalMatrix= mat3.create();
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixId, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddel.bufferColor);
    gl.vertexAttribPointer(shaderProgramm.aColorId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddel.bufferNormals);
    gl.vertexAttribPointer(shaderProgramm.aNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aNormalId);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddel.bufferVertices);
    gl.vertexAttribPointer(shaderProgramm.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aVertexPositionId);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


function definePaddel(gl, paddelColor, paddelPosition, paddelSize) {
    var paddel = {};
    paddel.normal = [0.0, 0.0, -1.0];
    paddel.bufferVertices = definePaddelVertices(gl);
    paddel.bufferColor = definePaddelColor(gl,paddelColor);
    paddel.bufferNormals = definePaddelNormals(gl, paddel.normal);
    paddel.position = paddelPosition;
    paddel.size = paddelSize;
    paddel.direction = [0, 0];
    paddel.speed = 3;
    return paddel;
}

function updatePaddle(paddel, deltaTime){
    var normalizedDirection = vec2.create();
    vec2.normalize(normalizedDirection, new Float32Array(paddel.direction));
    paddel.position[0] += normalizedDirection[0] * paddel.speed * deltaTime;
    paddel.position[1] += normalizedDirection[1] * paddel.speed * deltaTime;
}





