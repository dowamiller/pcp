/**
 * Created by Dominik on 08.12.2016.
 */
/**
 * Define and draw a ball.
 */
function defineBall(gl, latitudeBands, longitudeBands, ballPosition, ballSize) {
    "use strict";
    // define the vertices of the sphere
    var vertices = [];
    var normals = [];

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            // texture coordinates (not used)
            // var u = 1 - (longNumber / longitudeBands);
            // var v = 1 - (latNumber / latitudeBands);

            vertices.push(x);
            vertices.push(y);
            vertices.push(z);

            normals.push(x);
            normals.push(y);
            normals.push(z);
        }
    }

    var indices = [];
    for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            indices.push(first);
            indices.push(first + 1);
            indices.push(second);

            indices.push(second);
            indices.push(first + 1);
            indices.push(second + 1);
        }
    }
    var sphere = {};
    sphere.bufferVertices  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    sphere.bufferNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.bufferNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    sphere.bufferIndices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.bufferIndices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    sphere.numberOfTriangles = latitudeBands*longitudeBands*2;

    sphere.position = ballPosition;
    sphere.size = ballSize;
    sphere.speed = 2;
    sphere.direction = [0, 0, 0];
    return sphere;
}

function drawBall(gl, ball, color, shaderProgramm, viewMatrix, projectionMatrix) {
    "use strict";
    var modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, ball.position);
    mat4.scale(modelMatrix, modelMatrix, ball.size);

    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( shaderProgram.modelViewMatrixId ,false, modelViewMatrix);

    gl.uniformMatrix4fv( shaderProgram.projectionMatrixId ,false, projectionMatrix);

    var normalMatrix= mat3.create();
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixId, false, normalMatrix);

    // bind the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, ball.bufferVertices);
    gl.vertexAttribPointer(shaderProgramm.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aVertexPositionId);

    // color is directly specified as an attribute here, as it is valid for the whole object
    gl.disableVertexAttribArray(shaderProgramm.aColorId);
    gl.vertexAttrib4f(shaderProgramm.aColorId, color[0], color[1], color[2], 1);

    // bind the buffer for normal
    gl.bindBuffer(gl.ARRAY_BUFFER, ball.bufferNormals);
    gl.vertexAttribPointer(shaderProgramm.aNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aNormalId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ball.bufferIndices);
    gl.drawElements(gl.TRIANGLES, ball.numberOfTriangles*3 ,gl.UNSIGNED_SHORT, 0);
}

function updateBall(ball, deltaTime){
    var normalizedDirection = vec3.create();
    vec3.normalize(normalizedDirection, new Float32Array(ball.direction));
    ball.position[0] += normalizedDirection[0] * ball.speed * deltaTime;
    ball.position[1] += normalizedDirection[1] * ball.speed * deltaTime;
    ball.position[2] += normalizedDirection[2] * ball.speed * deltaTime;
}

function paddelLostBall(ball){
    ball.position = [0, 0, 0];
    ball.direction = [0, 0, 0];
}

function setRandomDirection(ball){
    ball.direction = [getRandom(-1, 1),getRandom(-1, 1),getRandom(-1, 1)];
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

