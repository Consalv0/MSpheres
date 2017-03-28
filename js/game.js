/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0 */
/* global width, height, RGB, HSB, createVector, createCanvas, ellipseMode, ellipse,
noStroke, line, BLEND, MULTIPLY, rectMode, CENTER, loadSound, keyCode ellipseMode,
rect, RADIUS, random, DIFFERENCE, fill, keyIsDown, colorMode, frameRate, blendMode,
textFont, textSize, text, fill, abs, stroke */

var file = []
var spheres = []
var preview = []

var TRAIL = 50   // Tail Duration in ms
var MAXSPH = 500  // Max number of spheres
var MAXRAD = 18   // Max Sphere radius
var MINRAD = 3    // Min Sphere radius
var radSize
var LAYER = [1, 2, 3, 4, 5]   // Max layers
var sphLayer = 1  // Num layers
var numsounds = LAYER.length  // Define the number of samples

var HALFW
var HALFH

var FRICTION = 10000 // More is less, <1 is none
var fCount = 0
var keyTimer = 0

var point; var pointR
var offset
var shot

// eslint-disable-next-line
function preload() {
  for (var i = 0; i < numsounds; i++) {
    file.push(loadSound('assets/' + (i+1) + '.ogg'))
  }
}

// eslint-disable-next-line
function setup() {
  createCanvas(960, 144).parent('game')
  rectMode(CENTER)
  ellipseMode(RADIUS)

  HALFW = width*0.5
  HALFH = height*0.5
  offset = createVector(0, 0)
  point = createVector(HALFW, HALFH)
  pointR = 3

  for (var i = 5; i > 0; i--) {
    spheres.push(new Sphere(createVector(random(width), random(height)), random(MINRAD, MAXRAD), createVector(random(10), random(10)), spheres.length, random(LAYER)))
  }
  setInterval(soundTimer, 10)
  setInterval(radTimer, 10)
}

// eslint-disable-next-line
function draw() {
  frameRate(60)

  for (let i = preview.length - 1; i >= 0; i--) {
    var prv = preview[i]
    prv.display()
    prv.placement()
  }

  for (let i = spheres.length - 1; i >= 0; i--) {
    var sph = spheres[i]
    sph.movement()
    sph.display()
    sph.collision()
  }

  if (keyIsDown(37) && point.x >= pointR) {
    point.x -= pointR * 0.5
  }
  if (keyIsDown(38) && point.y >= pointR) {
    point.y -= pointR * 0.5
  }
  if (keyIsDown(39) && point.x <= width -pointR) {
    point.x += pointR * 0.5
  }
  if (keyIsDown(40) && point.y <= height -pointR) {
    point.y += pointR * 0.5

    if (keyIsDown(38)) {
      keyTimer++
      if (keyTimer > 100) {
        for (var i = spheres.length; i >= 0; i--) {
          spheres.pop(i)
        }
      }
    }
  }
  if (keyIsDown(32)) {
    if (preview.length <= 0) {
      preview.push(new Sphere(createVector(point.x, point.y), radSize, createVector(0, 0), preview.length, sphLayer))
    }
    shot = createVector(offset.x - point.x, offset.y - point.y)
  }
  colorMode(HSB, 360, 100, 100)
    blendMode(DIFFERENCE)
      fill(360, 1, 100)
        textFont('Open Sans')
        textSize(12)
          text('Spheres: ' + spheres.length, 10, 15)

    blendMode(BLEND)
      fill(abs(sphLayer*360/LAYER.length), 100, 100)
        ellipse(point.x, point.y, pointR, pointR)
      fill(360, 0, 100)
        rect(HALFW, height, keyTimer*width/100, 1)

  colorMode(RGB, 255, 255, 255, 100)
    blendMode(MULTIPLY)
      fill(128, TRAIL)
        rect(HALFW, HALFH, width, height)
}

// eslint-disable-next-line
function keyPressed() {
  radSize = MINRAD

  if (keyCode === 32) {
    offset = createVector(point.x, point.y)
  }
  if (keyIsDown(40) && keyIsDown(38)) {
    if (spheres.length - 1 > -1) {
      spheres.pop(preview.length - 1)
    }
    blendMode(BLEND)
    colorMode(HSB, 360, 100, 100)
    fill(360, 0, 100)
    rect(HALFW, HALFH, width, height)
  }
  if (keyIsDown(39) && keyIsDown(37)) {
    if (sphLayer <= LAYER.length+1) {
      sphLayer++
      if (sphLayer > LAYER.length) {
        sphLayer = 1
      }
    }
    blendMode(BLEND)
      colorMode(HSB, 360, 100, 100)
        fill(abs(sphLayer*360/LAYER.length), 100, 100)
          rect(HALFW, HALFH, width, height)
  }
}

// eslint-disable-next-line
function keyReleased() {
  keyTimer = 0

  if (keyCode === 32) {
    if (preview.length > 0) {
      preview.pop(preview.length)
    }
    if (spheres.length-1 <= MAXSPH) {
      spheres.push(new Sphere(createVector(point.x, point.y), radSize, createVector(shot.x, shot.y), spheres.length, sphLayer))
    }
  }
}

function soundTimer() {
  if (fCount > 0) {
    fCount--
  }
}

function radTimer() {
  if (radSize < MAXRAD && keyIsDown(32)) {
    radSize += 0.1
  } else {
    radSize = MINRAD
  }
}

function Sphere(position, radius, velocity, id, layer) {
  var p = position; var r = radius; var playSound
  var v = velocity; var sphCollision

  this.layer = function() {
    return layer
  }
  this.p = function() {
    return p
  }
  this.r = function() {
    return r
  }
  this.v = function() {
    return v
  }

  this.placement = function() {
    // Preview of shotting sphere
    p.set(point.x, point.y)
    r = radSize

    if (keyIsDown(32)) {
      stroke(255)
        line(point.x, point.y, offset.x, offset.y)
      noStroke()
    }
  }

  this.movement = function() {
    // Movement of Sphere
    if (v.x > r) {
      v.normalize(); v.mult(r)
    } else if (v.x < -r) { v.normalize(); v.mult(r) }
    if (v.y > r) {
      v.normalize(); v.mult(r)
    } else if (v.y < -r) { v.normalize(); v.mult(r) }

    if (FRICTION > 1) {
      if (v.x > 0) { v.x -= abs(v.x) / FRICTION }
      if (v.x < 0) { v.x += abs(v.x) / FRICTION }
      if (v.y > 0) { v.y -= abs(v.y) / FRICTION }
      if (v.y < 0) { v.y += abs(v.y) / FRICTION }
    }
    p.add(v)
  }

  this.display = function() {
    // Display of Sphere
    noStroke()
    blendMode(BLEND)
      colorMode(HSB, 360, 100, 100)
        fill(abs(layer *360 / LAYER.length), (abs(v.y) + abs(v.x)) *100 / (r *2) +25, 100)
          ellipse(p.x, p.y, r, r)
  }

  this.collision = function() {
    // Collision in canvas
    if (p.x + r > width) {
      p.x += -abs(-width +p.x +r)
      v.x *= -1
      playSound(layer, 0.5, r /MAXRAD)
    }
    if (p.x - r < 0) {
      p.x += abs(p.x -r)
      v.x *= -1
      playSound(layer, 1, r /MAXRAD)
    }
    if (p.y + r > height) {
      p.y += -abs(-height +p.y +r)
      v.y *= -1
      playSound(layer, 1.5, r /MAXRAD)
    }
    if (p.y - r < 0) {
      p.y += abs(p.y -r)
      v.y *= -1
      playSound(layer, 2, r /MAXRAD)
    }
    /* Draw vector axis
    stroke(0, 100, 100)
      line(p.x, p.y, v.x * 10 + p.x, p.y)
    stroke(200, 100, 100)
      line(p.x, p.y, p.x, v.y * 10 + p.y)
    noStroke()
    */
    for (let j = id + 1; j < spheres.length; j++) { // Select all spheres pairs without repeating
      let sphOther = spheres[j]
      // print(id + " y " + j);
      sphCollision(sphOther)
    }
  }
  sphCollision = function (sphOther) {
    if (layer !== sphOther.layer()) return

    let pi = p; let pj = sphOther.p()
    let ri = r; let rj = sphOther.r()

    let sumRad = ri + rj // Minim distance
    let vctBtw = createVector(pi.x - pj.x, pi.y - pj.y) // Vector created from the distance between them
    let disBtw = vctBtw.mag() // Magnitude of vctBtw

    if (disBtw > sumRad * ri * 0.6) return // Minim distance to display web

    colorMode(HSB, 360, 100, 100)
      stroke(layer *72, (abs(v.y) + abs(v.x)) *100 /sumRad +10, 100) // ((x1)/x2*2 + (x3 + x4)/x1-0.5)/1.5
        blendMode(BLEND)
          line(pi.x, pi.y, pj.x, pj.y)
    noStroke()

    if (disBtw > sumRad-0.01) return // Too to far to collide

    // let mdBtw
    if (disBtw !== 0) {
    //  mdBtw = vctBtw.mult((sumRad - disBtw) /disBtw) // Vector of the minim distance between the spheres
    } else {
      disBtw = sumRad - 1.0
      vctBtw = createVector(0, sumRad)
    //  mdBtw = vctBtw.mult((sumRad - disBtw)/disBtw)
    }

    pi.add(vctBtw) // pi.add( vctBtw.mult( ri / sumRad ) );
    pj.sub(vctBtw) // pj.add( vctBtw.mult( rj / sumRad ) );

    let vi = v
    let vj = sphOther.v()

    let dirBtw = vctBtw.normalize() // Direction of the collision vector

    let viM = vi.mag() // Magnitude of velocities
    let vjM = vi.mag()

    vi.set(dirBtw.mult(-viM)) // Change direction of the Spheres
    vj.set(dirBtw.mult(-vjM))

    // TODO Fix Collion when velocities are in the same direction
    // let vk = createVector(vi.x+vj.x, vi.y+vj.y); // Save sum velocities before collision
    let vik = createVector(vi.x, vi.y) // Save velocities before collision
    let vjk = createVector(vj.x, vj.y)

    vi.set(vjk.sub(vik)) // Invert directions
    vj.set(vik.sub(vjk))

    // TODO Make velocity proportional to the spheres rad
    // vi.mult(rj*2 / sumRad); // Make velocity proportional to the spheres rad
    // vj.mult(ri*2 / sumRad);

    /* OLD COLLISION
    let vDiff = createVector(abs(vi.x-vj.x), abs(vi.y-vj.y)); // Velocity differences
    print(vDiff.x, vDiff.y);
    let vNorm = vDiff.dot(mdBtw.normalize()); // vDiff multiplyed by the collision dircetion

    // Sphere intersecting but moving away from each other already
    if (vNorm > 0) return;

    // Elastic collision impulse
    let kE = (-(1.0 + 0.99) * vNorm) / (mi + mj);
    let impulse = mdBtw.mult(kE);

    // Change it's momentum
    vi = vi.add(impulse.mult( mi ));
    vj = vj.sub(impulse.mult( mj ));
    */

    ellipse(p.x, p.y, sumRad *0.7, sumRad *0.7)

    playSound(layer, ri / sumRad *2, (ri + rj) /MAXRAD *2)
  }

  playSound = function (layer, rate, vol) {
    if (fCount < 20) {
      file[layer-1].play(0, rate, vol)
      fCount++
    }
  }
}
