class Aperture{
  constructor(){
    this.blades = 8;
    this.spacing = 3*TWO_PI/360;
    this.bladeAngle = TWO_PI/this.blades;
    this.beta = (this.bladeAngle- 2*this.spacing)/2;
    this.R = 300;
    this.r = 130;
    this.baseSkew = asin((this.R/this.r)*sin(this.beta));
    this.skew = this.baseSkew;
    this.color = color(255);
  }

  show() {
    push();
    this.calculateBaseSkew();
    this.setStyle();
    for(let i = 0; i<this.blades;i++){
      const currAngle = i*this.bladeAngle;
      let a1 = -1*(this.bladeAngle/2-this.spacing) + currAngle;
      let a2 =    (this.bladeAngle/2-this.spacing) + currAngle;
      let x1 = this.R*sin(a1);
      let y1 = this.R*cos(a1);
      let x2 = this.R*sin(a2);
      let y2 = this.R*cos(a2);
      let x3 = this.r*sin(currAngle - this.skew);
      let y3 = this.r*cos(currAngle - this.skew);
      triangle(x1,y1,x2,y2,x3,y3);
      arc(0,0,2*this.R,2*this.R,a1+PI/2,a2+PI/2,CHORD);
    }
    pop();
  }

  calculateBaseSkew(){
    this.baseSkew = asin((this.R/this.r)*sin(this.beta));
    this.skew = this.baseSkew;
  }

  setR(val){
    this.R = max(val, this.r);
  }
  setr(val){
    if((this.R/val)*sin(this.beta)<1){
      this.r = constrain(val, 0, this.R);
    } else {
      this.r = this.R*sin(this.beta);
    }
  }

  setStyle(){
    translate(width/2,height/2);
    fill(this.color);
    stroke(this.color);
    strokeJoin(ROUND);
    strokeWeight(2);
  }
}