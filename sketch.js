let RSlider;
let rSlider;
let spacingSlider;
let skewSlider;
let aperture;
let longSamples;
let shortSamples;

let myShader;
let gl;
let cnv;
let glSmere;
let glReColor;
let reColorShader;
let glDeform;
let deformShader;
let shaderPass = 3;
let img, monitor_img;

function preload(){
  // load the shader
  myShader = loadShader('vertShader.glsl', 'fragSahder.glsl');
	smereShader = loadShader('vertShader.glsl', 'fragSahderHSmere.glsl');
	reColorShader = loadShader('vertShader.glsl', 'recolorFragShader.glsl');
	deformShader = loadShader('vertShader.glsl', 'deformFragShader.glsl');
	img = loadImage('GLaDOShd_Portal_2.png');
	monitor_img = loadImage('Assets/monitor.png');
}
let capture;
function setup() {
	cnv = createCanvas(600, 450).parent("drawArea");
	pixelDensity(1);
	gl = createGraphics(width, height,WEBGL);
	glSmere = createGraphics(width, height,WEBGL);
	glReColor= createGraphics(width, height,WEBGL);
	glDeform = createGraphics(width, height,WEBGL);
	createSliders();
	aperture = new Aperture();
	aperture.color = color(77,204,255);
	fill(77,204,255);
	longSamples = new averageFilter(60);
	shortSamples = new averageFilter(5);
	console.log(shortSamples);

	capture = createCapture(VIDEO);
	capture.hide();
	//capture.size(320, 240);
}

let fr = 0;

function draw() {
	shaderPass = sPass.value();
	background(0);
	aperture.setR(0.9*width/2) ;
	aperture.show();
	stroke(77,204,255);
	strokeWeight(6);
	for(let i = 0; i<10;i++){
		line(0,i*height/10,5,i*height/10);
	}
	noStroke();

	textFont("consolas");
	textSize(50);
	textAlign(RIGHT,TOP);
	if(frameCount%30 == 0) fr = frameRate();
	text(int(fr), width, 0);
	textSize(20);
	textAlign(RIGHT,BOTTOM);
	text(frameCount, width, height);

	image(capture, 0, 0, width,height);


	if((frameCount%6==0)&&defMultAnimate.checked()){
		if(random()<0.3){
			defMult.value(random(0.05,0.15));
			defFreq.value(random(150,300));
		} else{
			defMult.value(0.001);
			defFreq.value(50);
		}
	}

	let rendered = shaderPipeline(cnv,shaderPass);

	let marginx = 0.1;
	let marginy = 0.1;
	let x0 = width*marginx;
	let y0 = height*marginy;
	let w = width-2*x0;
	let h = height-2*y0;
	background(0)
	image(rendered,x0,y0,w,h);
	image(monitor_img,-3,-3,width+3,height+3);
}

function mousePressed() {
}

let freqy, multy,offy, freqx,multx,offx, mixXY,shift;
let defMult, defFreq, defOff;
let defMultAnimate;
function createSliders(){
	freqy   = createSliderMacro("freqy",	0, 300, 100.0,	0);
	multy   = createSliderMacro("multy",	0, 2,		 	0.5,		0);
	offy    = createSliderMacro("offy",		0, 1, 		0.5,		0);
	freqx   = createSliderMacro("freqx",	0, 300, 60.0,		0);
	multx   = createSliderMacro("multx",	0, 2,			0.5,		0);
	offx    = createSliderMacro("offx",		0, 1,			0.5,		0);
	mixXY   = createSliderMacro("mixXY",	0, 1,			0.9,		0);
	shift   = createSliderMacro("shift",	0, 1,			0.05,		0);
	defMult = createSliderMacro("defMult",0, 0.1,	0.001,	0);
	defMultAnimate = createCheckbox("Anim",true).parent("sliderArea");
	defFreq = createSliderMacro("defFreq",0, width/2, 50,			0);
	defFreqAnimate = createCheckbox("Anim",true).parent("sliderArea");
	defOff  = createSliderMacro("defOff",	0, 7, 		TWO_PI/8.0,0);
	sPass  = createSliderMacro("ShaderPass",	0,4, 	4,1);
}

function createSliderMacro(name, min, max, def, step){
	let slider = createSlider(min, max, def,step).parent("sliderArea");
	createElement("span", name).parent("sliderArea");
	createElement("br").parent("sliderArea");
	return slider;
}

class averageFilter{
	constructor(fl){
		this.index =0;
		this.filterLength = fl;
		this.values = [];
		for (let i = 0; i<this.filterLength; i++){
			this.values[i] =0;
		}
	}

	add(val){
		this.values[this.index] = val;
		this.index++;
		if (this.index >= this.filterLength) this.index = 0;
		return this.get();
	}

	get(){
		let sum =0;
		for (let i = 0; i<this.filterLength; i++){
			sum += this.values[i];
		}
		return sum/this.filterLength;
	}
}

function shaderPipeline(graphicsLayer, pass){
	if(pass == 0) return graphicsLayer;
	if(!pass) pass = -1;
	//recolor pass
	glReColor.shader(reColorShader);
	reColorShader.setUniform('tex0', graphicsLayer);
	glReColor.rect(-width/2,-height/2,width,height);

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

	gl.rect(-width/2,-height/2,width,height);
	if(pass == 2) return gl;
	//smere shader pass
	glSmere.shader(smereShader);
	smereShader.setUniform('tex0',gl);
	glSmere.rect(-width/2,-height/2,width,height);	
	if(pass == 3) return glSmere;
	//deform shader pass
	glDeform.shader(deformShader);
	deformShader.setUniform('tex0',glSmere);
	glDeform.rect(-width/2,-height/2,width,height);	
	if(pass == 4) return glDeform;
	
}