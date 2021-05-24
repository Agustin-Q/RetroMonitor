#define TWO_PI 6.2831853
precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float freqy;
uniform float multy;
uniform float offy;
uniform float freqx;
uniform float multx;
uniform float offx;
uniform float mixXY;
uniform float shift;

uniform float defMult;
uniform float defFreq;
uniform float defOff;

void main() {
  //settings



  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  //uv = 1.0 - uv;

  //mapear los uvs con un seno
  vec2 uv2 = uv;
  uv2.x = uv2.x + defMult * (sin(defFreq*TWO_PI*uv.y+defOff));
  uv = uv2;
  // get the webcam as a vec4 using texture2D
  vec4 tex = texture2D(tex0, uv);

  float valy = multy*sin(freqy*TWO_PI*uv.y)+offy;
  float valx =multx*sin(freqx*TWO_PI*uv.x)+offx;
  float val = mix(valx, valy, mixXY);
  tex.rgb += shift; //shift color up. its a burn?
  tex.rgb = tex.rgb * val;

  gl_FragColor = tex;
}