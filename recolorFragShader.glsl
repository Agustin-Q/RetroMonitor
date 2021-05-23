precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
vec4 inputColor = vec4(0,1,0,1);
float mixAmmount = 0.6;


void main() {
  //settings
  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;

  vec4 tex = texture2D(tex0, uv);
  float average = (tex.r+tex.g+tex.b)/3.0;
  vec4 tempTex = vec4(vec3(average),1);
  //mult colors
  tempTex = tempTex * inputColor;
  tempTex = mix(tex, tempTex, mixAmmount);
  //tempTex = mix(tex, tempTex, 0.2);
  gl_FragColor = tempTex;
}