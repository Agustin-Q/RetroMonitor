precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
float k=0.85;

void main() {
  //settings
  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.x = (uv.x-0.5) * (1.0/(uv.y + k*(1.0-uv.y))) +0.5;

  vec4 tex = texture2D(tex0, uv);
  //mult colors
  //tempTex = mix(tex, tempTex, 0.2);
  gl_FragColor = tex;
  //gl_FragColor = vec4(uv.x, uv.y, 0.0,1.0);
}