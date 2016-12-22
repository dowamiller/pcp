precision mediump float;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVertexPosition;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;

void main() {
    float ka = 0.8;
    float kd = 0.5;
    float ks = 0.4;
    float ns = 80.0;
    float costheta = 0.0;
    float costhetapowerns = 0.0;
    vec3 ia = vColor.rgb*ka;
    float cosphi = max(dot(normalize(vNormal),normalize(uLightPosition-vVertexPosition)), 0.0);
    vec3 id = vColor.rgb*uLightColor.rgb*cosphi*kd;
    vec3 reflectDirection = reflect(-(uLightPosition-vVertexPosition),vNormal);
    if(cosphi == 0.0){
        ks = 0.0;
    } else {
        costheta = max(dot(normalize(-vVertexPosition),normalize(reflectDirection)), 0.0);
        costhetapowerns = pow(costheta,ns);
    }
    vec3 is = uLightColor.rgb*costhetapowerns*ks;
    gl_FragColor = vec4(ia+id+is,1);
}