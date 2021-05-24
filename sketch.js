let RSlider;
let rSlider;
let spacingSlider;
let skewSlider;

let cnv;
let shaderPass = 3;
let img, monitor_img;
let shaders = [];

function preload(){
  // load the shader
	monitor_img = loadImage('Assets/monitor.png');

	shaders.push(loadShader('vertShader.glsl', 'recolorFragShader.glsl'));
  shaders.push(loadShader('vertShader.glsl', 'fragSahder.glsl'));
	shaders.push(loadShader('vertShader.glsl', 'fragSahderHSmere.glsl'));
	shaders.push(loadShader('vertShader.glsl', 'deformFragShader.glsl'));
	shaders.push(loadShader('vertShader.glsl', 'trapezoidFragShader.glsl'));	
}
let capture;
function setup() {
	cnv = createCanvas(600, 450).parent("drawArea");
	pixelDensity(1);
	createSliders();
	fill(77,204,255);
	capture = createCapture(VIDEO);
	capture.hide();
	//capture.size(320, 240);
}

let fr = 0;

function draw() {
	background(0);
	stroke(77,204,255);
	strokeWeight(6);
	
	noStroke();
	
	textFont("consolas");
	textSize(35);
	textAlign(LEFT, BASELINE);
	fill(255);
	text("Loading... Please note that we have added a consequence for failure. Any contact with the chamber floor will result in an 'unsatisfactory' mark on your official testing record followed by death. Good luck!", 30,30,width-60,height-60);
	textAlign(RIGHT,TOP);
	
	if(frameCount%30 == 0) fr = frameRate();
	text(int(fr), width, 0);
	textSize(20);
	textAlign(RIGHT,BOTTOM);
	text(frameCount, width, height);
	
	//image(capture, 0, 0, width,height);
	
	
	if((frameCount%6==0)&&defMultAnimate.checked()){
		if(random()<0.3){
			defMult.value(random(0.05,0.15));
			defFreq.value(random(150,300));
		} else{
			defMult.value(0.001);
			defFreq.value(50);
		}
	}

	noFill();
	stroke(255);
	rect(20,20,width - 40, height -40);
	shaderPass = sPass.value();

	let uniforms = [];
	uniforms[1] = [];
	uniforms[1] = [
		{name: 'freqy', value: freqy.value()},
		{name: 'multy', value: multy.value()},
		{name: 'offy', value: offy.value()},
		{name: 'freqx', value: freqx.value()},
		{name: 'multx', value: multx.value()},
		{name: 'offx', value: offx.value()},
		{name: 'mixXY', value: mixXY.value()},
		{name: 'shift', value: shift.value()},
		{name: 'defMult', value: defMult.value()},
		{name: 'defFreq', value: defFreq.value()},
		{name: 'defOff', value: defOff.value()},
	];
	let rendered = shaderPipeline(shaders,cnv, uniforms, 600, 450 );
	
	background(0)
	image(rendered,92,70,410,274);
	image(monitor_img,-3,-3,width+3,height+3);
	noLoop();
}

function mousePressed() {
	console.log(`${mouseX}, ${mouseY}`);
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
	defMultAnimate = createCheckbox("Anim",false).parent("sliderArea");
	defFreq = createSliderMacro("defFreq",0, width/2, 50,			0);
	defFreqAnimate = createCheckbox("Anim",false).parent("sliderArea");
	defOff  = createSliderMacro("defOff",	0, 7, 		TWO_PI/8.0,0);
	sPass  = createSliderMacro("ShaderPass",	0,5, 	5,1);
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