let state = "start"; // "start" or "game" or "credit"

let pixelFont;

// 크레딧 관련
let creditY = 500;
let creditTexts = [
  "기획",
  "임규빈: 애니메이션 주제, 디자인 요소 기획",
  "오세진: 인터랙션, 손 인식 기획",
  "박지환: 스토리, 레이아웃 기획",
  "",
  "디자인",
  "임규빈: 배경, 나무, 공장",
  "오세진: 물건, 손 커서",
  "박지환: 사람, 새",
  "",
  "개발",
  "임규빈: 배경 이동/페이드, 나무 인터랙션",
  "오세진: 손 인식, 물건 잡기, 손 효과",
  "박지환: 캐릭터/새 움직임, 나무 클릭"
];

let background_move_n = -0;
let background_move = false;

let sence = 1;

// 구름 관련 변수
let img_cloud1,img_cloud2,img_cloud3,img_cloud4,img_cloud5,img_cloud6;
let cloud_move_falme = 0;

// 페이드 아웃 관련 변수
let fade = 0;
let fadeout_on = false;
let fadeon_on = false;

// 하늘 이미지
let img_sky;
let img_sky3;
let img_sky4;
let img_sky5;

// 공장 이미지
let img_factory1;
let img_factory2;

//연기 관련 이미지;
let img_smoke1;
let img_smoke2;
//연기 이동 변수
let smoke_move1 = 0;
let smoke_move2 = 0;
let smoke_move3 = 0;

let img_ground;
let img_ground2;
let img_ground5;

let img_tree_1;
let img_tree_2;
let img_tree_3;
let img_tree_4;

let img_noleaf_tree_1;
let img_noleaf_tree_2;
let img_noleaf_tree_3;

let img_cut_tree_1;
let img_cut_tree_2;

let handPose;
let video;
let hands = [];

let objectX = 300, objectY = 400;
let objectVisible = true;
let isGrabbing = false;
let offsetX = 0, offsetY = 0;

let openHandImg, closedHandImg;
let standImgs = [], walkImgs = [];

let currentAge = 0;
let characterX = 360, characterY = 310;
let isGiven = false;
let frameToggle = false;

// 캐릭터 등장 애니메이션 관련 변수
let characterAppearAnim = false;
let characterAppearFrame = 0;
let characterAppearDuration = 32; // 32프레임(약 1.5초)
let characterAppearDone = false;

function preload() {
  // 반드시 프로젝트 폴더에 PressStart2P-Regular.ttf 파일을 넣으세요.
  pixelFont = loadFont('PressStart2P-Regular.ttf');

  img_sky = loadImage('하늘.png');
  img_sky3 = loadImage('하늘3.png');
  img_sky4 = loadImage('하늘4.png');
  img_sky5 = loadImage('하늘5.png');
  
  img_factory1 = loadImage('공장1.png');
  img_factory2 = loadImage('공장2.png');
  
  img_smoke1 = loadImage('연기1.png');
  img_smoke2 = loadImage('연기2.png');
  
  img_ground = loadImage('땅.png');
  img_ground2 = loadImage('땅2.png');
  img_ground5 = loadImage('땅5.png');
  
  img_cloud1 = loadImage('구름1.png');
  img_cloud2 = loadImage('구름2.png');
  img_cloud3 = loadImage('구름3.png');
  img_cloud4 = loadImage('구름4.png');
  img_cloud5 = loadImage('구름5.png');
  img_cloud6 = loadImage('구름6.png');
  
  img_tree_1 = loadImage('나무1.png');
  img_tree_2 = loadImage('나무2.png');
  img_tree_3 = loadImage('나무3.png');
  img_tree_4 = loadImage('나무4.png');
  
  img_noleaf_tree_1 = loadImage('잎없는나무1.png');
  img_noleaf_tree_2 = loadImage('잎없는나무2.png');
  img_noleaf_tree_3 = loadImage('잎없는나무3.png'); 
  
  img_cut_tree_1 = loadImage('잘린나무1.png');
  
  handPose = ml5.handPose();
  openHandImg = loadImage('openHand.png');
  closedHandImg = loadImage('closedHand.png');

  standImgs[0] = loadImage('child_stand.png');
  walkImgs[0]  = loadImage('child_walk.png');
  //standImgs[1] = loadImage('teen_walk.png');
  //walkImgs[1]  = loadImage('teen_walk2.png');
  standImgs[2] = loadImage('adult_walk.png');
  walkImgs[2] = loadImage('adult_walk2.png');
  standImgs[3] = loadImage('old_walk.png');
  walkImgs[3] = loadImage('old_walk2.png');
}

function setup() {
  createCanvas(800, 450); // 고정된 캔버스 크기
  textFont(pixelFont);
  noSmooth(); // 픽셀 느낌 유지
  background(220);
  rectMode(CENTER);
  imageMode(CENTER);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);

  frameRate(20);
}


function draw() {
  if (state === "start") {
    drawStartScreen();
    return;
  }

  if (state === "credit") {
    drawCredit();
    return;
  }

  background_maker();

  // 캐릭터 등장 애니메이션이 필요하면 실행
  if (!characterAppearDone) {
    drawCharacterAppearAnim();
  } else {
    drawCharacter(characterX, characterY, isGiven, currentAge);
  }

  drawHands();

  if (isGiven) {
    characterX += 5;
    if(characterX >= width / 2 && sence == 5){
      isGiven = false;
    }
    if (characterX > width + 50) {
      if(fadeon_on){
        nextCharacter();
      }
      fadeout_on = true;
    }
  }

  if (objectVisible) {
    drawRecyclingBox(objectX, objectY);
  }

  updateHandState();
  updateObjectPosition();

  if (objectVisible && isNearCharacter(objectX, objectY)) {
    objectVisible = false;
    isGiven = true;
  }
  
  if(fadeout_on){
    fadeout();
  }
   
  if(fadeon_on){
    fadeon();
  }

  // 크레딧 전환 조건: 마지막 씬, 캐릭터 멈춤, fade 효과 끝, 오브젝트 없음
  if (!fadeon_on && sence == 5 && characterX == 360) {
    state = "credit";
    creditY = height;
  }
}


function drawStartScreen() {
  background1();

  let mainText = "NATURE";
  let subText = "CLICK TO CONTINUE";
  let explainText = "GRAB AND MOVE THE RED BOX TO THE CHARACTER";

  textAlign(CENTER, CENTER);

  // 제목
  textSize(64);
  stroke(255);
  strokeWeight(12);
  fill(0);
  text(mainText, width / 2, height / 2 - 60);

  strokeWeight(0);
  fill(0);
  text(mainText, width / 2, height / 2 - 60);

  // 서브텍스트 (깜빡이는 버튼 안내)
  if (frameCount % 60 < 30) {
    textSize(24);
    stroke(255);
    strokeWeight(6);
    fill(0);
    text(subText, width / 2, height / 2 + 10);

    strokeWeight(0);
    fill(0);
    text(subText, width / 2, height / 2 + 10);
  }

  // 설명 텍스트는 항상 출력되게 하자
  textSize(18);
  fill(0);
  noStroke();
  text(explainText, width / 2, height / 2 + 50);
}

function drawCredit() {
  background(0, 0, 0, 220);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(32);
  text("CREDIT", width / 2, creditY - 80);

  textSize(20);
  for (let i = 0; i < creditTexts.length; i++) {
    text(creditTexts[i], width / 2, creditY + i * 30);
  }

  // 크레딧이 올라가도록
  if (creditY + creditTexts.length * 30 > 100) {
    creditY -= 1.5;
  } else {
    creditY = 100 - creditTexts.length * 30;
  }
}

function mousePressed(){
  /*if (!fullscreen()) {
    fullscreen(true); // 전체화면 전환
  }*/

  if(state === "start") {
    state = "game";
    characterAppearAnim = true;
    characterAppearFrame = 0;
    characterAppearDone = false;
  } else {
    isGiven = true;
  }
}


function keyPressed() {
  if (state === "start" && (key === ' ' || keyCode === ENTER)) {
    state = "game";
    // 캐릭터 등장 애니메이션 시작
    characterAppearAnim = true;
    characterAppearFrame = 0;
    characterAppearDone = false;
  }

}

// 캐릭터 등장 픽셀 페이드인 애니메이션
function drawCharacterAppearAnim() {
  let img = standImgs[currentAge];
  let x = characterX;
  let y = characterY;
  let w = 100;
  let h = 100;


  let t = characterAppearFrame / characterAppearDuration;
  // 0에서 1로 점점 증가


  let maxPixel = 18;
  let minPixel = 1;
  let pixelSize = floor(lerp(maxPixel, minPixel, t));


  let pg = createGraphics(w, h);
  pg.noSmooth();
  pg.imageMode(CENTER);
  pg.clear();
  pg.image(img, w/2, h/2, w, h);

  // 캔버스에 픽셀화해서 그리기
  noSmooth();
  for (let py = 0; py < h; py += pixelSize) {
    for (let px = 0; px < w; px += pixelSize) {
      let c = pg.get(px, py);
      fill(c);
      noStroke();
      rect(x - w/2 + px, y - h/2 + py, pixelSize, pixelSize);
    }
  }

  characterAppearFrame++;
  if (characterAppearFrame >= characterAppearDuration) {
    characterAppearDone = true;
  }
}

function drawCharacter(x, y, isGiven, ageIndex) {
  if (!isGiven) {
    image(standImgs[ageIndex], x, y, 100, 100);
  } else {
    if (frameCount % 6 === 0) frameToggle = !frameToggle;
    image(frameToggle ? walkImgs[ageIndex] : standImgs[ageIndex], x, y, 100, 100);
  }
}



function background_maker(){
  switch(sence){
    case 1:
      background1();
      cloud_maker();
      break;
    case 2:
      background2();
      cloud_maker();
      break;  
    case 3:
      background3();
      cloud_maker();
      break;  
    case 4:
      background4();
      break;  
    case 5:
      background5();
      break;
  }
}

function cloud_maker(){
  if(background_move_n < -800){
  }else{
    image(img_cloud1,200 + background_move_n + cloud_move_falme,50,120,90);
    image(img_cloud2,400 + background_move_n + cloud_move_falme,70,150,120);
    image(img_cloud3,600 + background_move_n + cloud_move_falme,50,150,60);
    image(img_cloud4,800 + background_move_n + cloud_move_falme,70,180,120);
    image(img_cloud5,1000 + background_move_n + cloud_move_falme,50,180,120);
    image(img_cloud6,1200 + background_move_n + cloud_move_falme,70,120,80);
  }
  cloud_move_falme += -0.2;
}

function background1(){
  push();
  fill(150,200,255);
  image(img_sky,400 + background_move_n,225,800,450);
  image(img_ground,400 + background_move_n,225,800,450);
  image(img_tree_1,300 + background_move_n,190,150,270);
  image(img_tree_2,400 + background_move_n,170,150,270);
  image(img_tree_3,500 + background_move_n,190,150,270);
  image(img_tree_4,600 + background_move_n,190,150,270);
  image(img_tree_1,700 + background_move_n,190,150,270);
  image(img_tree_3,100 + background_move_n,190,150,270);
  image(img_tree_4,200 + background_move_n,190,150,270);
  image(img_tree_1,300 + background_move_n,190,150,270);

  // 왼쪽 나무들
  image(img_tree_1,100 + background_move_n,200,150,270);
  image(img_tree_2,30 + background_move_n,230,150,270);
  image(img_tree_3,200 + background_move_n,270,150,270);
  image(img_tree_4,80 + background_move_n,300,150,270);
  image(img_tree_1,10 + background_move_n,330,150,270);
  image(img_tree_2,270 + background_move_n,360,150,270);
  image(img_tree_3,150 + background_move_n,390,150,270);
  image(img_tree_4,230 + background_move_n,410,150,270);
  image(img_tree_1,70 + background_move_n,450,150,270);

  // 아래 나무들
  image(img_tree_1,400 + background_move_n,450,150,270);
  image(img_tree_4,500 + background_move_n,450,150,270);
  image(img_tree_1,600 + background_move_n,450,150,270);
  image(img_tree_2,700 + background_move_n,450,150,270);
  pop();
}

function background2(){
  push();
  image(img_sky,400 + background_move_n,225,800,450);
  image(img_ground2,400 + background_move_n,225,800,450);

  //밑 나무
  image(img_tree_1,0,450,150,270);
  image(img_tree_1,100,450,150,270);
  image(img_tree_1,200,450,150,270);
  image(img_tree_4,300,450,150,270);
  image(img_tree_1,400,450,150,270);
  image(img_tree_4,500,450,150,270);
  image(img_tree_1,600,450,150,270);
  image(img_tree_2,700,450,150,270);
  image(img_tree_2,800,450,150,270);

  //윗 나무
  image(img_tree_1,0 + background_move_n,190,150,270);
  image(img_tree_1,300 + background_move_n,190,150,270);
  image(img_tree_2,400 + background_move_n,170,150,270);
  image(img_tree_3,500 + background_move_n,190,150,270);
  image(img_tree_4,600 + background_move_n,190,150,270);
  image(img_tree_1,700 + background_move_n,190,150,270);
  image(img_tree_3,100 + background_move_n,190,150,270);
  image(img_tree_4,200 + background_move_n,190,150,270);
  image(img_tree_1,300 + background_move_n,190,150,270);
  image(img_tree_1,800 + background_move_n,190,150,270);

  pop();
}

function background3(){
  push();
  image(img_sky3,400,225,800,450);
  image(img_ground2,400,225,800,450);

  image(img_factory1,130,204,200,200);
  image(img_factory1,600,204,200,200);

  // 윗나무
  image(img_tree_1,0 + background_move_n,190,150,270);
  image(img_cut_tree_1,100 + background_move_n,300,120,120);
  image(img_cut_tree_1,200 + background_move_n,280,120,120);  
  image(img_tree_2,400 + background_move_n,170,150,270);
  image(img_noleaf_tree_3,500 + background_move_n,190,150,270);
  image(img_noleaf_tree_2,600 + background_move_n,190,150,270);
  image(img_noleaf_tree_1,300 + background_move_n,190,150,270);
  image(img_tree_1,800 + background_move_n,190,150,270);

  //아랫나무
  image(img_noleaf_tree_3,0,450,150,270);
  image(img_tree_1,100,450,150,270);
  image(img_noleaf_tree_1,300,430,150,270);
  image(img_noleaf_tree_2,400,450,150,270);
  image(img_tree_4,500,450,150,270);
  image(img_noleaf_tree_3,600,450,150,270);
  image(img_cut_tree_1,700 + background_move_n,430,120,120);  
  image(img_tree_2,800,450,150,270);

  pop();
}

function background4(){
  push();
  image(img_sky4,400,225,800,450);
  image(img_ground2,400,225,800,450);

  image(img_factory1,130,204,200,200);
  image(img_factory1,600,204,200,200);
  making_smoke(370,110);
  image(img_factory2,370,183,150,150);

  // 윗나무
  image(img_noleaf_tree_3,0 + background_move_n,190,150,270);
  image(img_cut_tree_1,100 + background_move_n,300,120,120);
  image(img_cut_tree_1,200 + background_move_n,280,120,120);  
  image(img_noleaf_tree_3,500 + background_move_n,190,150,270);
  image(img_noleaf_tree_2,600 + background_move_n,190,150,270);
  image(img_noleaf_tree_1,300 + background_move_n,190,150,270);
  image(img_noleaf_tree_1,800 + background_move_n,190,150,270);

  //아랫나무
  image(img_noleaf_tree_3,0,450,150,270);
  image(img_noleaf_tree_3,100,450,150,270);
  image(img_noleaf_tree_1,300,430,150,270);
  image(img_noleaf_tree_2,400,450,150,270);
  image(img_noleaf_tree_3,600,450,150,270);
  image(img_cut_tree_1,700 + background_move_n,430,120,120);  
  image(img_noleaf_tree_2,800,450,150,270);

  pop();
}

function making_smoke(x_position,y_position){
  push();
  // 길쭉한 공장 연기 움직임
  image(img_smoke1 ,x_position - smoke_move1,y_position - smoke_move1,60,60);
  smoke_move1 += 0.1;
  if(smoke_move1 >= 120){
    smoke_move1 = -6;
  }
  image(img_smoke2 ,x_position - 40 - smoke_move2,y_position - 40 - smoke_move2,60,60);
  smoke_move2 += 0.1;
  if(smoke_move2 >= 80){
    smoke_move2 = -46;
  }
  image(img_smoke1 ,x_position - 80 - smoke_move3,y_position - 80 - smoke_move3,60,60);
  smoke_move3 += 0.1;
  if(smoke_move3 >= 50){
    smoke_move3 = -86;
  }
  pop();
}

function background5(){
  push();
  fill(0,0,255);
  image(img_sky5,400 + background_move_n,225,800,450);
  image(img_ground5,400 + background_move_n,225,800,450);
  //공장
  image(img_factory1,130,204,200,200);
  image(img_factory1,600,204,200,200);
  making_smoke(370,110);
  image(img_factory2,370,183,150,150);
  // 나무
  image(img_cut_tree_1,200 + background_move_n,400,100,100);
  image(img_cut_tree_1,400 + background_move_n,280,100,100);
  image(img_cut_tree_1,500 + background_move_n,400,100,100);
  image(img_cut_tree_1,700 + background_move_n,280,100,100);
  image(img_cut_tree_1,600 + background_move_n,400,100,100);
  image(img_cut_tree_1,500 + background_move_n,280,100,100);
  image(img_cut_tree_1,600 + background_move_n,280,100,100);
  image(img_cut_tree_1,700 + background_move_n,400,100,100);
  image(img_cut_tree_1,550 + background_move_n,340,100,100);
  image(img_cut_tree_1,650 + background_move_n,340,100,100);
  image(img_cut_tree_1,750 + background_move_n,340,100,100);
  pop();
}

function fadeout(){
  push();
  fade += 4;
  fill(0,0,0,fade);
  strokeWeight(0);
  rect(400,225,800,450);
  if(fade >= 255){
    fadeout_on = false;
    fadeon_on = true;
  }
  pop();
}

function fadeon(){
  push();
  fade -= 4;
  fill(0,0,0,fade);
  strokeWeight(0);
  rect(400,225,800,450);
  if(fade <= 0){
    fadeon_on = false;
  }
  pop();
}

function drawCharacter(x, y, isGiven, ageIndex) {
  if (!isGiven) {
    image(standImgs[ageIndex], x, y, 100, 100);
  } else {
    if (frameCount % 6 === 0) frameToggle = !frameToggle;
    image(frameToggle ? walkImgs[ageIndex] : standImgs[ageIndex], x, y, 100, 100);
  }
}

function drawRecyclingBox(x, y) {
  push();
  noStroke();
  const dotSize = 6;
  fill(250,0,0);
  for (let i = -3; i <= 3; i++) {
    for (let j = -2; j <= 2; j++) {
      rect(x + i * dotSize, y + j * dotSize, dotSize, dotSize);
    }
  }
  pop();
}

function drawHands() {
  for (let hand of hands) {
    let indexTip = hand.keypoints.find(k => k.name === "index_finger_tip");
    if (indexTip) {
      imageMode(CENTER);
      image(isGrabbing ? closedHandImg : openHandImg, indexTip.x, indexTip.y, 60, 60);
    }
  }
}

function updateHandState() {
  for (let hand of hands) {
    let thumbTip = hand.keypoints.find(k => k.name === "thumb_tip");
    let indexTip = hand.keypoints.find(k => k.name === "index_finger_tip");

    if (thumbTip && indexTip) {
      let d = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
      if (d < 40) {
        if (!isGrabbing && objectVisible && isNearObject(indexTip.x, indexTip.y)) {
          isGrabbing = true;
          offsetX = objectX - indexTip.x;
          offsetY = objectY - indexTip.y;
        }
      } else {
        isGrabbing = false;
      }
    }
  }
}

function updateObjectPosition() {
  if (!isGrabbing || !objectVisible) return;

  let hand = hands[0];
  if (!hand) return;

  let indexTip = hand.keypoints.find(k => k.name === "index_finger_tip");
  if (indexTip) {
    objectX = indexTip.x + offsetX;
    objectY = indexTip.y + offsetY;
  }
}

function nextCharacter() {
  sence += 1;
  switch(sence){
    case 1:
      currentAge = 0;
      break;
    case 2:
    case 3:
      currentAge = 1;
      break;
    case 4:
      currentAge = 2;
      break;
    case 5:
      currentAge = 3;
      break;
  }
  characterX = 40;
  isGiven = false;
  objectVisible = true;
  objectX = 300;
  objectY = 400;
}

function isNearObject(x, y) {
  return dist(x, y, objectX, objectY) < 50;
}

function isNearCharacter(x, y) {
  return dist(x, y, characterX, characterY) < 50;
}

function gotHands(results) {
  hands = results;
}

