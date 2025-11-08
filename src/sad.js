const title = document.getElementById('title');

const eyesArea = document.querySelector('.eyes');
const upcovers = document.querySelectorAll('.eye-cover-up');
const downcovers = document.querySelectorAll('.eye-cover-down');
const pupils = document.querySelectorAll('.eye-pupil');
const tears  = document.querySelectorAll('.eye-tear');

/* ===========================
   테마별로 만질만한 값 모음
   =========================== */

// 눈 기본 위치 (동공 기준 위치)
const baseLeftPercent = 25;
const baseTopPercent = 14;

// 동공 이미지들 (테마 바꿀 때 여기 경로만 수정하면 됨)
const defaultPupilSrc = './image/sad/pupil_blue.svg';
const failPupilSrc    = './image/sad/fail_pupil.svg';
const successPupilSrc = './image/sad/pupil_blue.svg';

// 눈꺼풀 위치 값
const openUp   = '-100%';
const openDown = '-100%';
const closePos = '0%';

const squint1 = '-5%';
const squint2 = '-20%';
const squint3 = '-30%';

// 동공 랜덤 움직임 범위 (퍼센트)
const maxOffsetXPercent = 12;
const maxOffsetYPercent = 7; 


// =============================
// 동공 랜덤 이동
// =============================
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
let blinkTimer = null;

// =============================
// 눈꺼풀 제어
// =============================
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

  if (blinkTimer) {
    clearTimeout(blinkTimer);
    blinkTimer = null;
  }

  blinkTimer = setTimeout(() => {
    // 게임이 이미 끝났으면(성공/실패) 다시 열지 말기
    if (!gameStarted) {
      blinkTimer = null;
      return;
    }
    openEyes();
    isBlinking = false;
    blinkTimer = null;
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

// =============================
// 랜덤 행동
// =============================
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
  if (blinkTimer) { 
    clearTimeout(blinkTimer);
    blinkTimer = null;
  }
}


// =============================
// 게임 초기화
// =============================
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
    title.src = './image/sad/blue_title.svg';
  }
  tears.forEach(tear => {
    tear.style.display = 'none';
  });
  downcovers.forEach(el => {
    el.style.display = 'block';
  });

  // ✅ 처음 시작 & 리셋할 때는 무조건 눈 뜨고 시작
  openEyes();

  // 동공 이미지/위치/스케일 원래대로
  pupils.forEach(pupil => {
    pupil.src = defaultPupilSrc;
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top  = `${baseTopPercent}%`;
    pupil.style.transformOrigin = '50% 50%';
  });

  // 2초 뒤 게임 행동 시작
  gameStartTimer = setTimeout(() => {
    gameStarted = true;
    scheduleNextBehavior();
  }, 2000);
}

// =============================
// 성공시
// =============================
function handleWin() {
  if (!gameStarted) return;

  gameStarted = false;
  stopBehaviors();

  // 동공은 성공 버전 이미지로 바꾸고 중앙에 두기 (원하면 유지)
  pupils.forEach(pupil => {
    pupil.src = successPupilSrc;
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top  = `${baseTopPercent}%`;
    pupil.style.transform = 'scale(1)';   // 크기 기본
    pupil.style.transformOrigin = '50% 50%';
  });

  // 윗눈꺼풀은 완전히 올라간 상태 유지
  setUpcoverTop(openUp);

  // 아랫눈꺼풀만 완전히 위로 올려서 눈의 아래 절반을 덮기
  setDowncoverBottom(closePos);

  // 성공 눈물 보이게
  tears.forEach(tear => {
    tear.style.display = 'block';
  });

  if (title) {
    title.src = './image/sad/success_title.svg';
  }

  waitingForRestart = true;
}


// =============================
// 실패시
// =============================
function handleFail() {
  if (!gameStarted) return;

  gameStarted = false;
  stopBehaviors();

  // 모든 동공을 실패 이미지로
  pupils.forEach(pupil => {
    pupil.src = failPupilSrc;
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top  = `${baseTopPercent}%`;
  });

  if (title) {
    title.src = './image/sad/fail_title.svg';
  }

  waitingForRestart = true;

  if (tryAgainTimer) {
    clearTimeout(tryAgainTimer);
  }

  tryAgainTimer = setTimeout(() => {
    if (!waitingForRestart) return;
    if (title) {
      title.src = './image/sad/tryagain_title.svg';
    }
  }, 2000);
}

// =============================
// 입력 핸들러
// =============================
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

// =============================
// 이벤트 연결 + 시작
// =============================
if (eyesArea) {
  eyesArea.addEventListener('click', handleEyeTap);
  eyesArea.addEventListener('touchend', handleEyeTap);
}

if (title) {
  title.addEventListener('click', handleTitleTap);
  title.addEventListener('touchend', handleTitleTap);
}

initGame();
