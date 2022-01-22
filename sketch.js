function Particle() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 2;
  
  this.prevPos = this.pos.copy();
  
  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }
  
  this.applyForce = function(force) {
    this.acc.add(force);
  }
  
  this.show = function() {
	stroke(3, 5);
    strokeWeight(3);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }
  
  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  this.edges = function() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
  
}

let inc = 0.1;
let scl = 10;
let cols, rows;

let zoff = 0;

let fr;

let particles = [];

let flowfield;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width/scl);
  rows = floor(height/scl);
  fr = createP('');
  
  flowfield = new Array(cols * rows);
  
  for (let i = 0; i < 2500; i++) {
  	particles[i] = new Particle();
  }
  background(255);
} 


function draw() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
  	for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
      stroke(0, 50);
  	}
    yoff += inc;
    
    zoff += 0.0003;
  }
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
  	particles[i].update();
    particles[i].edges();
  	particles[i].show();
  }
}