function shaderPipeline(shaders, graphicsLayer , uniforms, w,h, pass){
  let currentGL = graphicsLayer;
  for (let i = 0; i < shaders.length; i++){
    let nextGL = createGraphics(w, h,WEBGL);
    nextGL.shader(shaders[i]);
    shaders[i].setUniform('tex0', currentGL);
    if(uniforms[i]){
      for (let k =0; k< uniforms[i].length; k++){
        shaders[i].setUniform(uniforms[i][k].name,uniforms[i][k].value);
      }
    }
    nextGL.quad(-1,1,1,1,1,-1,-1,-1);
    currentGL = nextGL;
  }

  return currentGL;
}