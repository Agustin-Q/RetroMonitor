function shaderPipeline(graphicsLayer, pass){
	if(pass == 0) return graphicsLayer;
	if(!pass) pass = -1;
	//recolor pass
	glReColor.shader(reColorShader);
	reColorShader.setUniform('tex0', graphicsLayer);
	glReColor.quad(-1,1,1,1,1,-1,-1,-1);


	if(pass == 1) return glReColor;

	//fist shader pass
	gl.shader(myShader);
	myShader.setUniform('tex0', glReColor);
	myShader.setUniform('freqy',freqy.value());
	myShader.setUniform('multy',multy.value());
	myShader.setUniform('offy',offy.value());
	myShader.setUniform('freqx',freqx.value());
	myShader.setUniform('multx',multx.value());
	myShader.setUniform('offx',offx.value());
	myShader.setUniform('mixXY',mixXY.value());
	myShader.setUniform('shift',shift.value());

	myShader.setUniform('defMult',defMult.value());
	myShader.setUniform('defFreq',defFreq.value());
	myShader.setUniform('defOff',defOff.value());

	gl.quad(-1,1,1,1,1,-1,-1,-1);
	if(pass == 2) return gl;
	//smere shader pass
	glSmere.shader(smereShader);
	smereShader.setUniform('tex0',gl);
	glSmere.quad(-1,1,1,1,1,-1,-1,-1);
	if(pass == 3) return glSmere;
	//deform shader pass
	glDeform.shader(deformShader);
	deformShader.setUniform('tex0',glSmere);
	glDeform.quad(-1,1,1,1,1,-1,-1,-1);
	//glDeform.triangle(0,0,0,10,10,0);
	if(pass == 4) return glDeform;
	
	glTrapezoid.shader(trapezoidShader);
	trapezoidShader.setUniform('tex0',glDeform);
	glTrapezoid.quad(-1,1,1,1,1,-1,-1,-1);
	if(pass == 5) return glTrapezoid;
}