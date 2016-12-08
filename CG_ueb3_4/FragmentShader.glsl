precision mediump float;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;

void main() {
    float ka = 0.5;
    float kd = 0.4;
    float ks = 0.4;
    float ns = 5.0;
    vec3 ia = vec3(vColor.x*ka, vColor.y*ka,vColor.z*ka);
    float cosphi = dot(normalize(vNormal),normalize(uLightPosition-vVertexPosition));
    vec3 id = vec3(cosphi*uLightColor.x*vColor.x*kd,cosphi*uLightColor.y*vColor.y*kd,cosphi*uLightColor.z*vColor.z*kd);
    vec3 reflectDirection = reflect(uLightPosition-vVertexPosition, vNormal);
    float costhetapowerns = pow(dot(normalize(reflectDirection),normalize(vVertexPosition)),ns);
    vec3 is = vec3(costhetapowerns*uLightColor.x*vColor.x*ks,costhetapowerns*uLightColor.y*vColor.y*ks,costhetapowerns*uLightColor.z*vColor.z*ks);
    gl_FragColor = vec4(ia+id+is,1);
}