let sound, sound2;
let fft;
let amp;
let currentSound;
let volumeSlider;
let speedSlider;
let positionButtons = [];

function preload() {
  sound = loadSound('sample.mp3');
  sound2 = loadSound('sample2.mp3');
}

function setup() {
  createCanvas(640, 640, WEBGL);
  fft = new p5.FFT();
  amp = new p5.Amplitude();

  currentSound = sound;

  // Play button
  let playButton = createButton('Play');
  playButton.position(10, 10);
  playButton.mousePressed(() => {
    if (!currentSound.isPlaying()) {
      currentSound.play();
    }
  });

  // Stop button
  let stopButton = createButton('Stop');
  stopButton.position(70, 10);
  stopButton.mousePressed(() => {
    if (currentSound.isPlaying()) {
      currentSound.stop();
    }
  });

  // Volume slider
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(10, 50);
  volumeSlider.style('width', '100px');

  // Speed slider
  speedSlider = createSlider(0.5, 2, 1, 0.1);
  speedSlider.position(10, 90);
  speedSlider.style('width', '100px');

  // Position buttons
  let positions = ['0%', '25%', '50%', '75%', '100%'];
  for (let i = 0; i < positions.length; i++) {
    let button = createButton(positions[i]);
    button.position(10 + i * 50, 130);
    button.mousePressed(() => {
      if (currentSound.isPlaying()) {
        currentSound.jump((i / 4) * currentSound.duration());
      }
    });
    positionButtons.push(button);
  }

  // Sound selection buttons
  let soundButton = createButton('Play Sample');
  soundButton.position(10, 170);
  soundButton.mousePressed(() => {
    if (currentSound.isPlaying()) {
      currentSound.stop();
    }
    currentSound = sound;
    currentSound.play();
  });

  let sound2Button = createButton('Play Sample 2');
  sound2Button.position(120, 170);
  sound2Button.mousePressed(() => {
    if (currentSound.isPlaying()) {
      currentSound.stop();
    }
    currentSound = sound2;
    currentSound.play();
  });
}

function draw() {
  background(30);

  // Update volume and speed
  currentSound.setVolume(volumeSlider.value());
  currentSound.rate(speedSlider.value());

  // Get FFT and amplitude analysis
  let waveData = fft.waveform();
  let level = amp.getLevel();

  // Draw 3D shape (cube) that changes size with sound level
  push();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  let boxSize = map(level, 0, 1, 50, 300);
  normalMaterial();
  box(boxSize);
  pop();

  // Draw waveform
  push();
  translate(-width / 2, -height / 2, 0);
  stroke(255);
  noFill();
  beginShape();
  for (let i = 0; i < waveData.length; i++) {
    let x = map(i, 0, waveData.length, 0, width);
    let y = map(waveData[i], -1, 1, height / 2, -height / 2);
    vertex(x, y);
  }
  endShape();
  pop();

  // Draw random circles based on sound level
  for (let i = 0; i < 10; i++) {
    let radius = map(level, 0, 1, 5, 50);
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let z = random(-200, 200);

    push();
    translate(x, y, z);
    noStroke();
    fill(random(255), random(255), random(255));
    sphere(radius);
    pop();
  }
}
