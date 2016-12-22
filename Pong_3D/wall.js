/**
 * Created by Dominik on 14.12.2016.
 */


function defineWall(gl,  wallColor, points){
    var wall = {};
    wall.points = points;
    wall.normal = calculateNormal(points);
    wall.bufferVertices = defineWallVertices(gl, points);
    wall.bufferColor = defineWallColor(gl, wallColor,points.length);
    wall.bufferNormals = defineWallNormals(gl,wall.normal ,points.length);
    return wall;
}

function defineWallVertices(gl, points){
    var vertices = [];
    points.forEach(function (cornerpoint) {
        vertices = vertices.concat(cornerpoint);
    });
    var bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return bufferVertices;
}

function defineWallColor(gl, color,n){
    "use strict";
    var allVerts = [];
    for(var i = 0; i<n; i++){
        allVerts = allVerts.concat(color);
    }
    var bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allVerts), gl.STATIC_DRAW);
    return bufferColor;
}

function defineWallNormals(gl,wallNormal,n){
    var allVertsNormal = [];
    for(var i = 0; i<n; i++){
        allVertsNormal = allVertsNormal.concat(wallNormal);
    }
    var bufferNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allVertsNormal), gl.STATIC_DRAW);
    return bufferNormals;
}

function drawWall(gl, wall, shaderProgramm, viewMatrix, projectionMatrix){
    var modelMatrix = mat4.create();
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( shaderProgram.modelViewMatrixId ,false, modelViewMatrix);

    gl.uniformMatrix4fv( shaderProgram.projectionMatrixId ,false, projectionMatrix);

    var normalMatrix= mat3.create();
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixId, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, wall.bufferColor);
    gl.vertexAttribPointer(shaderProgramm.aColorId, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, wall.bufferNormals);
    gl.vertexAttribPointer(shaderProgramm.aNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aNormalId);

    gl.bindBuffer(gl.ARRAY_BUFFER, wall.bufferVertices);
    gl.vertexAttribPointer(shaderProgramm.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aVertexPositionId);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, wall.points.length);
}

function calculateNormal(points){
    var u = vectorDifference(points[1], points[0]);
    var v = vectorDifference(points[points.length-1],points[0]);
    var crossProduct = vec3.create();
    vec3.cross(crossProduct,u,v);
    vec3.normalize(crossProduct,crossProduct);
    return [crossProduct[0],crossProduct[1],crossProduct[2]];
}

function vectorDifference(a,b){
    var result = [];
    result.push(b[0]-a[0]);
    result.push(b[1]-a[1]);
    result.push(b[2]-a[2]);
    return new Float32Array(result);
}
