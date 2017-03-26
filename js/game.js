var device;
var file = [];

var spheres = [];
var preview = [];

var MAXSPH = 500;  //Max number of spheres
var MAXRAD = 18;   //Max Sphere radius
var MINRAD = 3;     //Min Sphere radius
var LAYER = [1, 2, 3, 4, 5];   //Max layers
var sphLayer = 1;   //Num layers
var numsounds = LAYER.length;  // Define the number of samples
var vol;

var TRAIL = 50; //In ms

var f = 0;
var HALFW;
var HALFH;

var FRICTION = 10000; //More is less, <1 is none
var fCount = 0;

var point; var pointR;
var offset;
var shot;

function preload(){
  for (var i = 0; i < numsounds; i++){
    file.push(loadSound('assets/' + (i+1) + '.ogg'));
  }
}

function setup() {
  createCanvas(960, 144).parent('game');
  rectMode(CENTER);
  ellipseMode(RADIUS);

  HALFW = width*0.5;
  HALFH = height*0.5;
  offset = createVector(0,0);
  point = createVector(HALFW,HALFH);
  pointR = 3;

  for(var i = 5; i > 0; i--){
    spheres.push(new Sphere(createVector(random(width), random(height)), random(MINRAD, MAXRAD), createVector(random(10), random(10)), spheres.length, random(LAYER)));
  }
  setInterval(endSound, 10);
}

function draw() {
  frameRate(60);

  for(var i = preview.length-1; i >= 0; i--){
    var prv = preview[i];
    prv.display();
    prv.placement();
  }

  for(var i = spheres.length-1; i >= 0; i--){
    var sph = spheres[i];
    sph.movement();
    sph.display();
    sph.collision();
  }

  if(keyIsDown(37) && point.x >= pointR){
    point.x -= pointR*0.5;
  }
  if(keyIsDown(38) && point.y >= pointR){
    point.y -= pointR*0.5;
  }
  if(keyIsDown(39) && point.x <= width-pointR){
    point.x += pointR*0.5;
  }
  if(keyIsDown(40) && point.y <= height-pointR){
    point.y += pointR*0.5;
  }
  if(keyIsDown(32)){
    if(preview.length <= 0){
      preview.push(new Sphere(createVector(point.x, point.y), 0, createVector(0, 0), preview.length, 0));
    }
    shot = createVector(offset.x - point.x, offset.y - point.y);
  }
  colorMode(HSB, 360, 100, 100);
    blendMode(DIFFERENCE);
      fill(360, 1, 100);
        textFont('Open Sans');
        textSize(12);
          text('Spheres: ' + spheres.length, 10, 15);

    blendMode(BLEND);
      fill(abs(sphLayer*360/LAYER.length), 100, 100);
        ellipse(point.x, point.y, pointR, pointR);

  colorMode(RGB, 255, 255, 255, 100);
    blendMode(MULTIPLY);
      fill(128, TRAIL);
        rect(HALFW, HALFH, width, height);
}

function keyPressed(){
  if(keyCode == 32){
    offset = createVector(point.x, point.y);
  }
  if(keyIsDown(40) && keyIsDown(38)){
    if(spheres.length-1 > -1){
      spheres.pop(preview.length-1);
    }
    blendMode(BLEND);
    colorMode(HSB, 360, 100, 100);
    fill(360, 0, 100);
    rect(HALFW, HALFH, width, height);
  }
  if(keyIsDown(39) && keyIsDown(37)){
    if(sphLayer <= LAYER.length+1){
      sphLayer++;
      if(sphLayer > LAYER.length){
        sphLayer = 1;}
    }
    blendMode(BLEND);
      colorMode(HSB, 360, 100, 100);
        fill(abs(sphLayer*360/LAYER.length), 100, 100);
          rect(HALFW, HALFH, width, height);
  }
}

function keyReleased(){
  if(keyCode == 32){
    if(preview.length-1 > 0){
      preview.pop(preview.length-1);
    }
    if(spheres.length-1 <= MAXSPH){
      spheres.push(new Sphere(createVector(point.x, point.y), random(MINRAD, MAXRAD), createVector(shot.x, shot.y), spheres.length, sphLayer));
    }
  }
}

function endSound(){
  if(fCount > 0){
    fCount--;
  }
}

function Sphere(position, radius, velocity, id, layer) {
  var p = position; var r = radius; var playSound;
  var v = velocity; var sphCollision; var endSound;

  this.layer = function() {
    return layer;
  }
  this.p = function() {
    return p;
  }
  this.r = function() {
    return r;
  }
  this.v = function() {
    return v;
  }

  this.placement = function() {
    //Preview of shotting sphere
    p.set(point.x, point.y);
    r = MINRAD;

    if(keyIsDown(32)){
      stroke(255);
        line(point.x, point.y, offset.x, offset.y);
      noStroke();
    }
  }

  this.movement = function() {
    // Movement of Sphere
    if(v.x > r){v.normalize(); v.mult(r);}
    else if(v.x < -r){v.normalize(); v.mult(r);}
    if(v.y > r){v.normalize(); v.mult(r);;}
    else if(v.y < -r){v.normalize(); v.mult(r);}

    if(FRICTION > 1){
      if(v.x > 0){ v.x -= abs(v.x)/FRICTION;}
      if(v.x < 0){ v.x += abs(v.x)/FRICTION;}
      if(v.y > 0){ v.y -= abs(v.y)/FRICTION;}
      if(v.y < 0){ v.y += abs(v.y)/FRICTION;}
    }
    p.add(v);
  };

  this.display = function() {
    // Display of Sphere
    noStroke();
    blendMode(BLEND);
      colorMode(HSB, 360, 100, 100);
        fill(abs(layer*360/LAYER.length), abs(v.y) + abs(v.x)/(2*r/600), 100);
          ellipse(p.x,p.y,r,r);
  };

  this.collision = function() {
    // Collision in canvas
    if(p.x+r > width){
      p.x += -abs(-width+p.x+r);
      v.x *= -1;
      playSound(layer, 0.5, r/MAXRAD);
    }
    if(p.x-r < 0){
      p.x += abs(p.x-r);
      v.x *= -1;
      playSound(layer, 1, r/MAXRAD);
      //this.playSound(1);
    }
    if(p.y+r > height){
      p.y += -abs(-height+p.y+r);
      v.y *= -1;
      playSound(layer, 1.5, r/MAXRAD);
      //this.playSound(2);
    }
    if(p.y-r < 0){
      p.y += abs(p.y-r);
      v.y *= -1;
      playSound(layer, 2, r/MAXRAD);
      //this.playSound(3);
    }

    for(var j = id+1; j < spheres.length; j++){
      var sphThis = spheres[id];
      if(j < 1) return;
      var sphOther = spheres[j];

      sphCollision(sphOther);
    }
  }
  sphCollision = function(sphOther){

    var sphThis = this;

    if(layer != sphOther.layer()) return;

    var pi = p;             var ri = r;
    var pj = sphOther.p();  var rj = sphOther.r();

    var sumRad = ri + rj; // Minim distance
    var vctBtw = createVector(pi.x - pj.x, pi.y - pj.y); // Vector created from the distance between them
    var disBtw = vctBtw.mag(); // Magnitude of vctBtw

    if(disBtw > sumRad-0.01) return; // Too to far to collide

    if(disBtw != 0){
      vctBtw.mult((sumRad - disBtw)/disBtw); // Vector of minim distance between the spheres
    }else{
      disBtw = sumRad - 1.0;
      vctBtw = createVector(0, sumRad);
      vctBtw.mult((sumRad - disBtw)/disBtw);
    }

    pi.add( vctBtw.mult( ri / sumRad ) );
    pj.sub( vctBtw.mult( rj / sumRad ) );

    var mi = 1/ri; // Inverse mass
    var mj = 1/rj;

    var vi = v;
    var vj = sphOther.v();

    var vDiff = (vi.sub(vj)); // Velocity differences
    var vNorm = vDiff.dot(vctBtw.normalize()); // vDiff multiplyed by the collision dircetion

    // Sphere intersecting but moving away from each other already
    if (vNorm > 0) return;

    // Collision impulse
    var kE = (-(1.0 + 0.8) * vNorm) / (mi + mj);
    var impulse = vctBtw.mult(kE);

    // change in momentum
    vi = vi.add(impulse.mult( mi ));
    vj = vj.sub(impulse.mult( mj ));

    playSound(layer, 1, (ri + rj)/MAXRAD*2);
  }

  playSound = function(layer, rate, vol){
    if(fCount < 20){
      file[layer-1].play(0, rate, vol);
      fCount++;
    }
  }
};
