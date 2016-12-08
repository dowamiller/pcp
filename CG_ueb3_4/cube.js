/**
 * Created by Dominik on 08.12.2016.
 */
/**
 * Define and draw a cube.
 */
function defineCubeVertices(gl) {
    "use strict";
    // define the vertices of the paddel
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
    var bufferVertices  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return bufferVertices;
}

function defineCubeColor(gl, frontColor, backColor, rightColor, leftColor, topColor, bottomColor) {
    "use strict";
    var frontSideColor = frontColor.concat(frontColor, frontColor, frontColor);
    var backSideColor = backColor.concat(backColor, backColor, backColor);
    var rightSideColor = rightColor.concat(rightColor, rightColor, rightColor)
    var leftSideColor = leftColor.concat(leftColor, leftColor, leftColor);
    var topSideColor = topColor.concat(topColor, topColor, topColor);
    var bottomSideColor = bottomColor.concat(bottomColor, bottomColor, bottomColor);
    var allSides = frontSideColor.concat(backSideColor, rightSideColor, leftSideColor, topSideColor, bottomSideColor);
    var bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSides), gl.STATIC_DRAW);
    return bufferColor;
}

function defineCubeNormals(gl) {
    "use strict";
    var frontNormal = [0, -1, 0];
    var backNormal =  [0, 1, 0];
    var rightNormal = [1, 0, 0];
    var leftNormal = [-1, 0, 0];
    var topNormal = [0, 0, 1];
    var bottomNormal = [0, 0, -1];

    var frontSideNormal = frontNormal.concat(frontNormal, frontNormal, frontNormal);
    var backSideNormal = backNormal.concat(backNormal, backNormal, backNormal);
    var rightSideNormal = rightNormal.concat(rightNormal, rightNormal, rightNormal);
    var leftSideNormal = leftNormal.concat(leftNormal, leftNormal, leftNormal);
    var topSideNormal = topNormal.concat(topNormal, topNormal, topNormal);
    var bottomSideNormal = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);
    var allSidesNormal = frontSideNormal.concat(backSideNormal, rightSideNormal, leftSideNormal, topSideNormal, bottomSideNormal);
    var bufferNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
    return bufferNormals;
}

function defineCube(gl,  frontColor, backColor, rightColor, leftColor, topColor, bottomColor, cubeSize) {
    var cube = {};
    cube.bufferVertices = defineCubeVertices(gl);
    cube.bufferColor = defineCubeColor(gl,  frontColor, backColor, rightColor, leftColor, topColor, bottomColor);
    cube.bufferNormals = defineCubeNormals(gl);
    cube.size = cubeSize;
    return cube;
}

function drawCube(gl, cube, shaderProgramm, modelMatrix, viewMatrix, projectionMatrix) {
    "use strict";
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
    gl.uniformMatrix4fv( shaderProgram.modelViewMatrixId ,false, modelViewMatrix);

    gl.uniformMatrix4fv( shaderProgram.projectionMatrixId ,false, projectionMatrix);

    var normalMatrix= mat3.create();
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixId, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.bufferColor);
    gl.vertexAttribPointer(shaderProgramm.aColorId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.bufferNormals);
    gl.vertexAttribPointer(shaderProgramm.aNormalId, 3, gl.FLOAT, false ,0 , 0);
    gl.enableVertexAttribArray(shaderProgramm.aNormalId);

    gl.bindBuffer(gl.ARRAY_BUFFER , cube.bufferVertices);
    gl.vertexAttribPointer(shaderProgramm.aVertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(shaderProgramm.aVertexPositionId);
    for(var i = 0 ; i <6 ;i++){
        gl.drawArrays(gl.TRIANGLE_STRIP,i*4,4);
    }
}
