let standImg, walkImg;
let characterX = 40;
let characterY = 120;
let isGiven = false;
let frameToggle = false;

function preload() {
  standImg = loadImage('child stand.png'); // 스탠딩 이미지 파일명
  walkImg = loadImage('child walk.png');   // 걷기 이미지 파일명
}

function setup() {
  createCanvas(480, 240);
  frameRate(20);
}

function draw() {
  background(220);

  drawCharacter(characterX, characterY, isGiven);

  // 예시: 물건 받으면 오른쪽으로 이동
  if (isGiven) {
    characterX += 2;
  }
}

// "캐릭터 그리기" 함수 정의
function drawCharacter(x, y, isGiven) {
  if (!isGiven) {
    image(standImg, x, y);
  } else {
    if (frameCount % 6 == 0) frameToggle = !frameToggle; // 6프레임마다 교체
    image(frameToggle ? walkImg : standImg, x, y);
  }
}

// 마우스 클릭 시 물건을 받은 것으로 처리
function mousePressed() {
  if (!isGiven) {
    isGiven = true;
  }
}