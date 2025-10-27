//눈 깜빡일때
const leftcover1  = document.getElementById('leftcover1');
const leftcover2 = document.getElementById('leftcover2');
const rightcover1  = document.getElementById('rightcover1');
const rightcover2 = document.getElementById('rightcover2');

const open1 = '-60px';
const open2 = '110px';
const close1 = '0px';
const close2 = '50px';

let isClosed = false; 
function openEyes(){
  leftcover1.style.top  = open1;
  leftcover2.style.top = open2;
  rightcover1.style.top  = open1;
  rightcover2.style.top = open2;
  isClosed = false;
}

function closeEyes(){
  leftcover1.style.top  = close1;
  leftcover2.style.top = close2;
  rightcover1.style.top  = close1;
  rightcover2.style.top = close2;
  isClosed = true;
}

function blink(d=80){
  closeEyes();
  setTimeout(openEyes, d);
}
function slowBlink(){
  blink(200);
}
openEyes();

//가늘게 뜨기
const squint1 = '-20px';
const squint2 = '80px';

function squint(){
  leftcover1.style.top  = squint1;
  leftcover2.style.top = squint2;
  rightcover1.style.top  = squint1;
  rightcover2.style.top = squint2;
  
  setTimeout(openEyes, 500);
}
const squint3 = '-10px';
const squint4 = '60px';

function squintt(){
  leftcover1.style.top  = squint3;
  leftcover2.style.top = squint4;
  rightcover1.style.top  = squint3;
  rightcover2.style.top = squint4;
  
  setTimeout(openEyes, 500);
}



//눈동자 왔다갔다
const leftpupil  = document.getElementById('leftpupil');
const rightpupil = document.getElementById('rightpupil');

let direction = 1;
const moveDistance = 30;

function lookSide(){
  const x = direction * moveDistance;
  leftpupil.style.left  = `calc(50% + ${x}px)`;
  rightpupil.style.left = `calc(50% + ${x}px)`;
  direction *= -1;
}

function randomLook(){
  lookSide();

    const min = 200;
    const max = 800;
  const nextTime = Math.random() * (max - min) + min;

  setTimeout(randomLook, nextTime);
}

//행동 변수 모음
const behaviors = [
  () => blink(),
  () => slowBlink(),
  () => lookSide(),
  () => squint(),
  () => squintt()
];


//게임 실행
const lip = document.getElementById('lip');
const buttonElement = document.getElementById('button');

let gameStarted = false;
let gameOver = false;
let behaviorTimer = null;

let behaviorMin = 800;
let behaviorMax = 2500;

function randomBehavior(){
  const index = Math.floor(Math.random() * behaviors.length);
  behaviors[index]();

  const delay = Math.random() * (behaviorMax - behaviorMin) + behaviorMin;
  behaviorTimer = setTimeout(randomBehavior, delay);
}

function button(){ 
  if (!gameStarted){
    startGame();
  } else {
    checkHit();
  }
}

function startGame(){
  gameStarted = true;
  gameOver = false;

  behaviorMin = 150;
  behaviorMax = 500;

  buttonElement.textContent = '깜빡!';
  buttonElement.style.backgroundColor = 'cyan';
  buttonElement.style.color = 'black';
  randomBehavior();
}

function checkHit(){
  if (gameOver) return;

  if (isClosed){
    endGame(true);
  } else {
    endGame(false);
  }
}

function endGame(success){
  gameOver = true;
  clearTimeout(behaviorTimer);
  behaviorTimer = null;

  behaviorMin = 800;
  behaviorMax = 2500;
  openEyes();

  buttonElement.textContent = success ? 'SUCCESS' : 'FAIL';
  buttonElement.style.backgroundColor = success ? 'green' : 'crimson';
  lip.textContent = success ? '💋' : '👅';

  setTimeout(() => {
    buttonElement.textContent = 'START';
    buttonElement.style.backgroundColor = 'darkred';
    buttonElement.style.color = 'white';
    gameStarted = false;
    gameOver = false;
    lip.textContent = 'v';

  }, 1200);
}

buttonElement.ontouchstart = () => {
  button();
};
