import processing.sound.*;

AudioDevice device;
SoundFile[] file;
int sample[] = {0,0,0};

ArrayList<Sphere> spheres;
ArrayList<Sphere> preview;

int MAXNUM = 1500;  //Max number of spheres
int MAXRAD = 100;   //Max Sphere radius
int MINRAD = 5;     //Min Sphere radius
int MAXLAYER = 5;   //Max layers
int sphLayer = 1;   //Num layers
int numsounds = MAXLAYER;  // Define the number of samples
float vol = MINRAD/MAXRAD;

float t, TRAIL = 10; //In ms

int f = 0;
float HALFW;
float HALFH;

PVector offset = new PVector();
PVector shot = new PVector();

void setup(){
  //fullScreen();
  size(960,144);

  HALFW = width*0.5f;
  HALFH = height*0.5f;

  spheres = new ArrayList<Sphere>();
  preview = new ArrayList<Sphere>();

  // Create a Sound renderer and an array of empty soundfiles
  device = new AudioDevice(this, 48000, 32);
  file = new SoundFile[numsounds];

  // Load 5 soundfiles from a folder in a for loop. By naming the files 1., 2., 3., n.aif it is easy to iterate
  // through the folder and load all files in one line of code.
  for (int i = 0; i < numsounds; i++){
    file[i] = new SoundFile(this, (i+1) + ".ogg");
  }
}


void draw(){
  frameRate(200);
  println(", fps: " + frameRate + ", Esferas: " + spheres.size() + ", Capa: " + sphLayer);

  for (int i = preview.size()-1; i >= 0; i--){
    Sphere prv = preview.get(0);
    prv.display();
    prv.placement();
  }

  for (int i = spheres.size()-1; i >= 0; i--){
    Sphere sph = spheres.get(i);
    sph.display();
    sph.collision();
    sph.movement();
  }

  blendMode(MULTIPLY);
  fill(150, TRAIL);
  rect(0, 0, width, height);

  print("Acciones: " + f);
  f = 0;
}

void mouseWheel(MouseEvent event){
  float e = event.getCount();
  if(rad + e <= MAXRAD && rad + e >= MINRAD){
    rad += e;
    vol = rad/MAXRAD;
  }
  if(preview.size()-1 >= 0){
  Sphere prv = preview.get(0);
  prv.placement();
  prv.display();
  }
}

void mouseDragged(){
  shot.set(offset.x - mouseX, offset.y - mouseY);
}

void mousePressed(){
  if(mouseButton == LEFT){
    preview.add(new Sphere(new PVector(mouseX, mouseY), 0, new PVector(0, 0), preview.size(), 0));

    offset.set(mouseX, mouseY);
    shot.set(offset.x - mouseX + random(-0.1, 0.1), offset.y - mouseY + random(-0.1, 0.1));
  }
}

float rad = MINRAD;
void mouseReleased(){

  if(mouseButton == LEFT && preview.size()-1 > 0){
    preview.remove(preview.size()-1);
  }
  if(mouseButton == LEFT && spheres.size()-1 <= MAXNUM){
    spheres.add(new Sphere(new PVector(mouseX, mouseY), rad, new PVector(shot.x, shot.y), spheres.size(), sphLayer));
  }
  if(mouseButton == RIGHT && spheres.size()-1 > -1){
    spheres.remove(spheres.size()-1);
  }
  if(mouseButton == CENTER){
    for(int i = spheres.size()-1; i>=0; i--){
      spheres.remove(i);
    }
  }
}

void keyReleased() {
  if((keyCode == 38 || keyCode == 39) && sphLayer < MAXLAYER){
    sphLayer++;
  }
  if((keyCode == 40 || keyCode == 37) && sphLayer > 1){
    sphLayer--;
  }

}void keyPressed() {
  switch(key){
  case 'a':file[0].play(0.5, vol);break;
  case 's':file[0].play(1.0, vol);break;
  case 'd':file[0].play(2.0, vol);break;
  case 'f':file[0].play(3.0, vol);break;
  case 'g':file[1].play(0.5, vol);break;
  case 'h':file[1].play(1.0, vol);break;
  case 'j':file[1].play(2.0, vol);break;
  case 'k':file[1].play(3.0, vol);break;
  case 'l':file[2].play(0.5, vol);break;
  case 'ö':file[2].play(1.0, vol);break;
  case 'ä':file[2].play(2.0, vol);break;
  case 'q':file[2].play(3.0, vol);break;
  case 'w':file[3].play(0.5, vol);break;
  case 'e':file[3].play(1.0, vol);break;
  case 'r':file[3].play(2.0, vol);break;
  case 't':file[3].play(3.0, vol);break;
  case 'z':file[4].play(0.5, vol);break;
  case 'u':file[4].play(1.0, vol);break;
  case 'i':file[4].play(2.0, vol);break;
  case 'o':file[4].play(3.0, vol);break;
  }
}
