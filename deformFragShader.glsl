precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
float k = 1.0;
float a = 1.0;
float b = 0.3; //0.3
float streach = 0.35;//0.38

void main() {
  //settings
  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  //uv = 1.0 - uv;
  vec2 tempUV = vec2(b*(a*pow((uv.y-0.5),2.0) + k)*(uv.x-0.5),b*(a*pow((uv.x-0.5),2.0) + k)*(uv.y-0.5))+uv;
  tempUV = tempUV - (streach)*(uv-0.5); // streach

  vec4 tex = texture2D(tex0, tempUV);

  gl_FragColor = tex;
}