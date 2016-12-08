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

function definePaddelNormals(gl) {
    "use strict";
    var paddelNormal = [0.0, 0.0, -1.0];
    // make 4 entries, one for each vertex
    var allVertsNormal = padelNormal.concat(padelNormal, padelNormal, padelNormal);
    var bufferNormals = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormals);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
    return bufferNormals;
}

function drawPaddel(gl, paddel, aVertexPositionId, aVertexColorId, aVertexNormalId) {
    "use strict";
    gl.bindBuffer(gl.ARRAY_BUFFER, paddel.bufferColor);
    gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddel.bufferNormals);
    gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexNormalId);

    gl.bindBuffer(gl.ARRAY_BUFFER, paddel.bufferVertices);
    gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function definePaddel(gl, paddelColor, paddelPosition) {
    var paddel = {};
    paddel.bufferVertices = definePaddelVertices(gl);
    paddel.bufferColor = definePaddelColor(gl,paddelColor);
    paddel.bufferNormals = definePaddelNormals(gl);
    paddel.position = paddelPosition;
    paddel.size = paddelSize;
    paddel.speed = [0, 0, 0];
    return paddel;
}
