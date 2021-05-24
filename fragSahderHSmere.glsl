precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

  float width = 600.0;
  int NumberOfSamples = 30;
  float mixAmmount = 0.2;

void main() {
  //settings
  vec2 dir2d = vec2(-4.0,0.0);
  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  //uv = 1.0 - uv;
  float accum = 0.0;
  vec4 tempTex = vec4(0.0);
  for(int i = 0; i < 10000; i++ ){
    if(i>=NumberOfSamples) break;
    vec2 tempUV = uv;
    accum += float(NumberOfSamples-i);
    tempUV += dir2d*float(i)/width;
    tempTex += texture2D(tex0, tempUV)*float(NumberOfSamples-i);
  }
  tempTex = tempTex / accum;
  vec4 tex = texture2D(tex0, uv);
  tempTex = mix(tex, tempTex, mixAmmount);
  gl_FragColor = tempTex;
}