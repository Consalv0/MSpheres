/* eslint space-infix-ops: 0, space-before-function-paren: 0, indent: 0, no-trailing-spaces: 0 */
/* global width, height, RGB, HSB, createVector, createCanvas, ellipseMode, ellipse, noStroke,
 line, BLEND, MULTIPLY, rectMode, CENTER, loadSound, keyCode ellipseMode, rect, RADIUS, random,
 fill, keyIsDown, colorMode, frameRate, blendMode, textFont, textSize, text, fill, abs, stroke,
 strokeWeight, loadFont, SCREEN, keyIsPressed */

var file = []
var spheres = []
var preview = []

var TRAIL = 50   // Tail Duration in ms
var MAXSPH = 500  // Max number of spheres
var MAXRAD = 18   // Max Sphere radius
var MINRAD = 3    // Min Sphere radius
var LAYER = [1, 2, 3, 4, 5]   // Max layers
var FRICTION = 10000 // More is less, <1 is none
var numsounds = LAYER.length  // Define the number of samples
var pointR = 3 // Radius of the preview sphere

var HALFW
var HALFH
var sphLayer
var radSize

var sCount = 0
var keyTimer = 0
var msgCount = 0
var inactivity = 9000

var domsg = false
var active = true
var inactive = false

var point
var offset
var shot
var msgInteractivity
var msgInactivity

var UbuntuMono

// eslint-disable-next-line
function preload() {
  for (let i = 0; i < numsounds; i++) {
    file.push(loadSound('assets/' + (i+1) + '.ogg'))
  }
  UbuntuMono = loadFont('assets/UbuntuMono-Regular.ttf')
}

// eslint-disable-next-line
function setup() {
  // createCanvas($(window).width(), $(window).height()).parent('game')
  createCanvas(960, 144).parent('game')
  rectMode(CENTER)
  ellipseMode(RADIUS)
  strokeWeight(2)

  sphLayer = random(LAYER)  // Starting layer
  HALFW = width *0.5
  HALFH = height *0.5
  offset = createVector(0, 0)
  point = createVector(HALFW, HALFH)

  for (let i = 5; i > 0; i--) {
    spheres.push(new Sphere(createVector(random(width), random(height)), random(MINRAD, MAXRAD),
     createVector(random(10), random(10)), spheres.length, random(LAYER)))
  }
  setInterval(soundTimer, 10)
  setInterval(radTimer, 10)
  setInterval(msgDisplay, 60000)
}

// eslint-disable-next-line
function draw() {
  frameRate(60)

  msgCount++
  if (active) {
    if (inactivity > 0) inactivity--
    if (inactivity <= 0) isInactive()
  }

  for (let i = 0; i < preview.length; i++) {
     var prv = preview[i]
     prv.display()
     prv.placement()
  }

  for (let i = 0; i < spheres.length; i++) {
    var sph = spheres[i]
    sph.movement()
    sph.display()
    sph.collision()
  }

  if (keyIsDown(37) && point.x >= pointR) {
    inactivity += inactivity*0.007+inactivity < 9000 ? Math.floor(inactivity*0.007) : 0
    point.x -= pointR * 0.5
  }
  if (keyIsDown(38) && point.y >= pointR) {
    inactivity += inactivity*0.007+inactivity < 9000 ? Math.floor(inactivity*0.007) : 0
    point.y -= pointR * 0.5
  }
  if (keyIsDown(39) && point.x <= width -pointR) {
    inactivity += inactivity*0.007+inactivity < 9000 ? Math.floor(inactivity*0.007) : 0
    point.x += pointR * 0.5
  }
  if (keyIsDown(40) && point.y <= height -pointR) {
    inactivity += inactivity*0.007+inactivity < 9000 ? Math.floor(inactivity*0.007) : 0
    point.y += pointR * 0.5

    if (keyIsDown(38)) {
      keyTimer++
      if (keyTimer > 100) {
        for (let i = spheres.length; i >= 0; i--) {
          spheres.pop(i)
        }
      }
    }
  }
  if (keyIsDown(32)) {
    inactivity += inactivity*0.007+inactivity < 9000 ? Math.floor(inactivity*0.007) : 0
    if (preview.length <= 0) {
      preview.push(new Sphere(createVector(point.x, point.y), radSize,
       createVector(0, 0), preview.length, sphLayer))
    }
    shot = createVector(offset.x - point.x, offset.y - point.y)
  }

  colorMode(HSB, 360, 100, 100)
    blendMode(SCREEN)
      fill(100, 94, 92)
        textFont(UbuntuMono)
        textSize(12)
          text(spheres.length, 10, 15)
        textSize(12)
          if (domsg && active) text(msgInteractivity, 10, height-15)
          if (domsg && inactive) text(msgInactivity, 10, height-15)

  blendMode(BLEND)
    fill(abs(sphLayer*360/LAYER.length), 100, 100)
      ellipse(point.x, point.y, pointR, pointR)
    fill(360, 0, 100)
      rect(HALFW, height, keyTimer*width/100, 1)
    fill(0, 100, 100)
      rect(HALFW, 1, (9000-inactivity)*width/9000, 2)

  colorMode(RGB, 255, 255, 255, 100)
    blendMode(MULTIPLY)
      fill(128, TRAIL)
        rect(HALFW, HALFH, width, height)

  domsg = msgCount > 680 ? false : domsg
  msgCount = msgCount > 680 ? 0 : msgCount
}

function msgDisplay() {
  msgInteractivity = txtInteractivity[Math.floor(random(0, txtInteractivity.length))]
  msgInactivity = txtInactivity[Math.floor(random(0, txtInactivity.length))]
  domsg = true
  msgCount = 0
}
// eslint-disable-next-line
function keyPressed() {
  active = true
  inactive = false
  radSize = MINRAD

  if (keyCode === 32) {
    offset = createVector(point.x, point.y)
  }
  if (keyIsDown(40) && keyIsDown(38)) {
    if (spheres.length -1 > -1) {
      spheres.pop(preview.length -1)
    }
    blendMode(BLEND)
    colorMode(HSB, 360, 100, 100)
    fill(360, 0, 100)
    rect(HALFW, HALFH, width, height)
  }
  if (keyIsDown(39) && keyIsDown(37)) {
    if (sphLayer <= LAYER.length +1) {
      sphLayer++
      if (sphLayer > LAYER.length) {
        sphLayer = 1
      }
    }
    blendMode(BLEND)
      colorMode(HSB, 360, 100, 100)
        fill(abs(sphLayer *360 /LAYER.length), 100, 100)
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
      spheres.push(new Sphere(createVector(point.x, point.y), radSize,
       createVector(shot.x, shot.y), spheres.length, sphLayer))
    }
  }
}

function soundTimer() {
  if (sCount > 0) {
    sCount--
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

  this.layer = function() { return layer }
  this.p = function() { return p }
  this.r = function() { return r }
  this.v = function() { return v }

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
    // Limit the speed of the spheres by it's size
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
      colorMode(HSB, 360, 1, 1, 1)
        fill(layer *72, (abs(v.y) + abs(v.x)) /(r +r) +0.25, 1, 1)
          ellipse(p.x, p.y, r, r)
  }

  this.collision = function() {
    // Collision in canvas
    if (p.x + r > width) {
      p.x += -abs(-width +p.x +r)
      v.x *= -1
      playSound(layer, 1, r /MAXRAD)
    }
    if (p.x - r < 0) {
      p.x += abs(p.x -r)
      v.x *= -1
      playSound(layer, 2, r /MAXRAD)
    }
    if (p.y + r > height) {
      p.y += -abs(-height +p.y +r)
      v.y *= -1
      playSound(layer, 3, r /MAXRAD)
    }
    if (p.y - r < 0) {
      p.y += abs(p.y -r)
      v.y *= -1
      playSound(layer, 4, r /MAXRAD)
    }
    /* Draw vector axis
    stroke(0, 100, 100)
      line(p.x, p.y, v.x * 10 + p.x, p.y)
    stroke(200, 100, 100)
      line(p.x, p.y, p.x, v.y * 10 + p.y)
    noStroke()
    */

    // print('Esfera ' + id + ':')
    for (let j = id + 1; j < spheres.length; j++) { // Select all spheres pairs without repeating
      let sphOther = spheres[j]

      // print(id + ' y ' + j)
      sphCollision(sphOther)
    }
  }
  sphCollision = function (sphOther) {
    // print(id + ', ' + sphOther.id)
    if (layer !== sphOther.layer()) return

    let pi = p; let pj = sphOther.p()
    let ri = r; let rj = sphOther.r()

    let sumRad = ri +rj // Minim distance
    let vctBtw = createVector(pi.x -pj.x, pi.y -pj.y) // Vector created from the distance between them
    let disBtw = vctBtw.mag() // Magnitude of vctBtw

    let webDist = sumRad *8
    if (disBtw > webDist) return // Minim distance to display web

    stroke(layer *72, (abs(v.y) +abs(v.x)) /sumRad +0.1, 1, (webDist -disBtw) /webDist)
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
    pj.sub(vctBtw) // pj.sub( vctBtw.mult( rj / sumRad ) );

    let vi = v
    let vj = sphOther.v()

    let dirBtw = vctBtw.normalize() // Direction of the collision vector

    // TODO Fix Collision Speed (Investigate momentum)
    let vik = createVector(vi.x, vi.y) // Save velocities before collision
    let vjk = createVector(vj.x, vj.y)

    vi.set(vik.add(vjk)) // Compare velocities
    vj.set(vjk.add(vik))

    let viM = vi.mag() // Save new magnitudes
    let vjM = vj.mag()

    vi.set(dirBtw.mult(viM)) // Invert directions
    vj.set(dirBtw.mult(-vjM))

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

    playSound(layer, ri /sumRad *2, ri /MAXRAD)
  }

  playSound = function (layer, rate, vol) {
    if (sCount < 20) {
      file[layer-1].play(0, rate)
      file[layer-1].setVolume(vol)
      sCount++
    }
  }
}

function isInactive() {
    active = false
    inactive = true

    for (let i = spheres.length; i >= 0; i--) {
      spheres.pop(i)
    }
}

let txtInactivity = [
  '¿Hay alguien?',
  '¿Sigues ahí?',
  'Hum, parece que ya no hay nadie...',
  'Tururu?',
  'Parece que no hay nadie...',
  'Oye, ¿Sigues ahí?',
  '¿Alo?',
  'Parece que estoy sola de nuevo...'
]

let txtInteractivity = [
  'Puedes mover las flechas para mover el puntero.',
  'Si aprietas las flechas arriba y abajo puedes eliminar esferas.',
  '¿Haz intentado presionar todas las teclas al mismo tiempo?',
  '¡Suelta la barra espaciadora para lanzar la esfera!',
  'Si aprietas las flechas laterales cabias la capa.',
  '¿Haz notado que el punto que controlas cambia de color?',
  '¿Y si intentas hacer que suene bien?',
  'Hum, no suena mal...',
  'Me gusta como suena C:',
  'Esa esfera parece que no chocó bien..., tendré que checar mi código.',
  '¿Vienes aquí amenudo?',
  '¿Ya viste el horario?, parece interesante',
  'Ya, deja jugar a los demás',
  '¿Si le sabes?',
  'Jajaja, ¿a eso le llamas música?',
  'Prueba con algo más sencillo',
  'Woa, parecen mini telarañas',
  '¿Alo polsia?',
  '¿Y que tan grande se ve la esfera?',
  'Hum...',
  ':C',
  'C:',
  '¿Qué tal?',
  '...',
  '¿Haz intentado mantener la barra espaciadora abajo?',
  'Pst: Me agradas',
  'Pst: ¿Te gusta hora de aventura?',
  'Plop, plip, plop',
  'Buena idea, suena mejor así'
]
