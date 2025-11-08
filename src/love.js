const title = document.getElementById('title');

const eyesArea = document.querySelector('.eyes');
const upcovers = document.querySelectorAll('.eye-cover-up');
const downcovers = document.querySelectorAll('.eye-cover-down');
const pupils = document.querySelectorAll('.eye-pupil');
const cheeks = document.querySelectorAll('.eye-cheek');

console.log('upcovers:', upcovers.length, 'downcovers:', downcovers.length, 'pupils:', pupils.length);

const openUp = '-100%';
const openDown = '-100%';
const closePos = '0%';

const squint1 = '-30%';
const squint2 = '-50%';
const squint3 = '-80%';

const baseLeftPercent = 25;
const baseTopPercent = 14;

// 동공 이미지들
const defaultPupilSrc = './image/love/pupil_pink.svg';
const successPupilSrc = './image/love/falling_pupil_pink.svg';

// 랜덤으로 움직일 수 있는 범위(퍼센트)
const maxOffsetXPercent = 12; // 좌우 ±12%
const maxOffsetYPercent = 7;  // 상하 ±7%

function lookSide() {
  const randX = (Math.random() * 2 - 1) * maxOffsetXPercent;
  const randY = (Math.random() * 2 - 1) * maxOffsetYPercent;

  pupils.forEach(pupil => {
    pupil.style.left = `${baseLeftPercent + randX}%`;
    pupil.style.top  = `${baseTopPercent + randY}%`;
  });
}

let gameStarted = false;
let isBlinking = false;
let waitingForRestart = false;

let behaviorTimer = null;
let gameStartTimer = null;
let tryAgainTimer = null;

function setUpcoverTop(value) {
  upcovers.forEach(el => {
    el.style.top = value;
  });
}

function setDowncoverBottom(value) {
  downcovers.forEach(el => {
    el.style.bottom = value;
  });
}

function openEyes() {
  setUpcoverTop(openUp);
  setDowncoverBottom(openDown);
  isBlinking = false;
}

function closeEyes() {
  setUpcoverTop(closePos);
  setDowncoverBottom(closePos);
  isBlinking = true;
}

// d: 눈을 감고 있는 시간(ms)
function blink(d = 80) {
  closeEyes();
  setTimeout(() => {
    openEyes();
    isBlinking = false;
  }, d);
}

function slowBlink() {
  blink(300);
}

function squint() {
  setUpcoverTop(squint1);
  setDowncoverBottom(squint1);
  isBlinking = false;
  setTimeout(openEyes, 500);
}

function squintt() {
  setUpcoverTop(squint2);
  setDowncoverBottom(squint2);
  isBlinking = false;
  setTimeout(openEyes, 500);
}

function squinttt() {
  setUpcoverTop(squint3);
  setDowncoverBottom(squint3);
  isBlinking = false;
  setTimeout(openEyes, 400);
}

const behaviors = [
  () => blink(),
  () => slowBlink(),
  () => lookSide(),
  () => lookSide(),
  () => squint(),
  () => squintt()
];

function scheduleNextBehavior() {
  if (!gameStarted) return;

  const randomIndex = Math.floor(Math.random() * behaviors.length);
  const behavior = behaviors[randomIndex];
  behavior();

  const min = 300;
  const max = 900;
  const nextTime = Math.random() * (max - min) + min;

  behaviorTimer = setTimeout(scheduleNextBehavior, nextTime);
}

function stopBehaviors() {
  if (behaviorTimer) {
    clearTimeout(behaviorTimer);
    behaviorTimer = null;
  }
}

// 게임 초기화
function initGame() {
  stopBehaviors();
  if (gameStartTimer) {
    clearTimeout(gameStartTimer);
    gameStartTimer = null;
  }

  if (tryAgainTimer) {
    clearTimeout(tryAgainTimer);
    tryAgainTimer = null;
  }

  gameStarted = false;
  isBlinking = false;
  waitingForRestart = false;

  if (title) {
    title.src = './image/love/love_title.svg';
  }

  // 치크 숨기기
  cheeks.forEach(ch => {
    ch.style.display = 'none';
  });

  downcovers.forEach(el => {
    el.style.display = 'block';
  });
  openEyes();

  // 동공 이미지/위치 원래대로
  pupils.forEach(pupil => {
    pupil.src = defaultPupilSrc;
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top  = `${baseTopPercent}%`;
  });

  gameStartTimer = setTimeout(() => {
    gameStarted = true;
    scheduleNextBehavior();
  }, 2000);
}

// 성공시
function handleWin() {
  if (!gameStarted) return;

  gameStarted = false;
  stopBehaviors();

  // 동공 이미지 성공 버전으로 변경
  pupils.forEach(pupil => {
    pupil.src = successPupilSrc;
  });

  pupils.forEach(pupil => {
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top = `${baseTopPercent}%`;
  });
  
  if (title) {
    title.src = './image/love/success_title.svg';
  }

  waitingForRestart = true;
}

// 실패시
function handleFail() {
  if (!gameStarted) return;

  gameStarted = false;
  stopBehaviors();

  if (title) {
    title.src = './image/love/fail_title.svg';
  }

  // 윗꺼풀 닫고 아랫꺼풀은 열린 상태 유지
  setUpcoverTop(closePos);
  setDowncoverBottom(openDown);

  // 동공 중앙 정렬
  pupils.forEach(pupil => {
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top = `${baseTopPercent}%`;
  });

  // 치크 보이기
  cheeks.forEach(ch => {
    ch.style.display = 'block';
  });

  waitingForRestart = true;

  if (tryAgainTimer) {
    clearTimeout(tryAgainTimer);
  }

  tryAgainTimer = setTimeout(() => {
    if (!waitingForRestart) return;
    if (title) {
      title.src = './image/love/tryagain_title.svg';
    }
  }, 2000);
}

function handleEyeTap(e) {
  if (e) e.preventDefault();

  if (!gameStarted && !waitingForRestart) {
    if (gameStartTimer) {
      clearTimeout(gameStartTimer);
      gameStartTimer = null;
    }
    gameStarted = true;
    scheduleNextBehavior();
    return;
  }

  if (!gameStarted) return;

  if (isBlinking) {
    handleWin();
  } else {
    handleFail();
  }
}

function handleTitleTap(e) {
  if (e) e.preventDefault();

  if (!waitingForRestart) return;

  initGame();
}

if (eyesArea) {
  eyesArea.addEventListener('click', handleEyeTap);
  eyesArea.addEventListener('touchend', handleEyeTap);
}

if (title) {
  title.addEventListener('click', handleTitleTap);
  title.addEventListener('touchend', handleTitleTap);
}

initGame();
