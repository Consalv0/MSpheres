float FRICTION = 100000; //More is less, <1 is none
float fCount = 0;

class Sphere {
  PVector p, v;
  float r;
  int id, layer;

  Sphere(PVector position, float radius, PVector velocity, int id, int layer){
    this.p = position;  this.r = radius;
    this.v = velocity; this.id = id; this.layer = layer;
  }

  void placement(){
    //Preview of shotting sphere
    preview.get(0).p.set(mouseX,mouseY);
    preview.get(0).r = rad;

    if(mousePressed){
      stroke(255);
      line(mouseX, mouseY, offset.x, offset.y);
      noStroke();
    }
  }

  void movement(){
    // Suma de vectores
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
    fCount += frameRate;
    p.add(v);
  }

  void collision(){
  // Colisón en ventana
    if(p.x+r > width){
      p.x += -abs(-width+p.x+r);
      v.x *= -1;
      this.playSound(0.5);
    }
    if(p.x-r < 0){
      p.x += abs(p.x-r);
      v.x *= -1;
      this.playSound(1);
    }
    if(p.y+r > height){
      p.y += -abs(-height+p.y+r);
      v.y *= -1;
      this.playSound(2);
    }
    if(p.y-r < 0){
      p.y += abs(p.y-r);
      v.y *= -1;
      this.playSound(3);
    }

    for(int j = id+1; j < spheres.size(); j++){
      Sphere sphThis = spheres.get(id);
      if(j < 1) return;
      Sphere sphOther = spheres.get(j);

      sphThis.sphCollision(sphOther);
    }
  }

  void sphCollision(Sphere sphOther){

    Sphere sphThis = this;

    if(sphThis.layer != sphOther.layer) return;

    PVector pi = sphThis.p; float ri = sphThis.r;
    PVector pj = sphOther.p; float rj = sphOther.r;

    float minimD = ri + rj; //Minim distance
    PVector delta = new PVector(pi.x - pj.x, pi.y - pj.y);

    f++;
    float deltaM = delta.mag(); // Magnitude of delta
    if(deltaM > minimD) return; // Too far between them

    f++;
    if(deltaM != 0.0f){
      delta.mult((minimD - deltaM)/deltaM); // Minim distance to translate between the spheres
    }else{
        deltaM = minimD - 1.0f;
        delta = new PVector(0.0f, minimD);
        delta.mult((minimD - deltaM)/deltaM);
    }

    pi.add(delta.mult(ri/(minimD)));
    pj.sub(delta.mult(rj/(minimD)));

    float mi = 1/ri;
    float mj = 1/rj;
    PVector vi = sphThis.v;
    PVector vj = sphOther.v;

    PVector dv = (vi.sub(vj));
    float dvNormalized = dv.dot(delta.normalize());

    // sphere intersecting but moving away from each other already
    if (dvNormalized > 0.0f) return;

    // collision impulse
    float kE = (-(1.0f + 0.8f) * dvNormalized) / (mi + mj);
    PVector impulse = delta.mult(kE);

    // change in momentum
    vi = vi.add(impulse.x * mi, impulse.y * mi);
    vj = vj.sub(impulse.x * mj, impulse.y * mj);

    sphThis.playSound(1.0);
  }

  void playSound(float rate){
    if(fCount > 200){
      file[this.layer-1].play(rate, this.r/MAXRAD);
      fCount = 0;
    }
  }

  void display() {
    // Mostrar figuras
    noStroke();
    blendMode(BLEND);
    colorMode(HSB);
    ellipseMode(RADIUS);

    fill(abs(layer*360/MAXLAYER), abs(v.y) + abs(v.x)/(2*r/360), 360);
    ellipse(p.x,p.y,r,r);
  }
}
