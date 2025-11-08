const title = document.getElementById('title');

const eyesArea = document.querySelector('.eyes');
const upcovers = document.querySelectorAll('.eye-cover-up');
const downcovers = document.querySelectorAll('.eye-cover-down');
const pupils = document.querySelectorAll('.eye-pupil');
const whites = document.querySelectorAll('.eye-white');

/* ===========================
   테마별로 만질만한 값 모음
   =========================== */

// 눈 기본 위치 (동공 기준 위치)
const baseLeftPercent = 25;
const baseTopPercent = 14;

// 동공 이미지들 (테마 바꿀 때 여기 경로만 수정하면 됨)
const defaultPupilSrc = './image/crazy/pupil_green.svg';
const failPupilSrc    = './image/crazy/fail_right_pupil.svg';
const successPupilSrc = './image/crazy/success_pupil.svg';

// 실패 시 왼쪽 동공 축소 비율 (1보다 작게)
const failLeftPupilScale = 0.6;
// 흰자 이미지들 (👁 실패 시 바뀔 부분)
const defaultWhiteSrc = './image/crazy/white_shape.svg';
const failWhiteSrc    = './image/crazy/fail_shape.svg';

const successDanceOffsetX = 10;  
const successDanceOffsetY = 6;   
const successDanceMinDelay = 80;  
const successDanceMaxDelay = 200;
// 성공 시 동공 크기
const successPupilScale = 0.7;   // scale 값 (0.7배)

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
let successDanceTimer = null;

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

// =============================
// 랜덤 행동
// =============================
const behaviors = [
  () => blink(),
  () => slowBlink(),
  () => lookSide(),
  () => lookSide(),
  () => squint(),
  () => squintt(),
  () => squinttt()
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

// =============================
// 게임 초기화
// =============================
function initGame() {
  stopBehaviors();
  stopSuccessDance();
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
    title.src = './image/crazy/title_green.svg';
  }
whites.forEach(white => {
  white.src = defaultWhiteSrc;
});

  // 아랫눈꺼풀 다시 보이게 (혹시 숨겼던 게 있다면)
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
    pupil.style.transform = 'scale(1)';  
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
  stopSuccessDance(); 

  pupils.forEach(pupil => {
    pupil.src = successPupilSrc;
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top  = `${baseTopPercent}%`;
    pupil.style.transform = `scale(${successPupilScale})`;
    pupil.style.transformOrigin = '50% 50%';
  });

  if (title) {
    title.src = './image/crazy/success_title.svg';
  }

  waitingForRestart = true;

  startSuccessDance();
}

// =============================
// 성공 상태에서 눈동자 랜덤으로 돌아다니기
// =============================
function startSuccessDance() {
  // 혹시 이전 타이머가 남아 있으면 정리
  if (successDanceTimer) {
    clearTimeout(successDanceTimer);
    successDanceTimer = null;
  }

  function step() {
    // 더 이상 성공 상태가 아니면 중지
    if (!waitingForRestart) {
      successDanceTimer = null;
      return;
    }

    pupils.forEach((pupil, i) => {
      // 각 눈의 기준 위치는 baseLeftPercent / baseTopPercent
      const randX = (Math.random() * 2 - 1) * successDanceOffsetX;
      const randY = (Math.random() * 2 - 1) * successDanceOffsetY;

      pupil.style.left = `${baseLeftPercent + randX}%`;
      pupil.style.top  = `${baseTopPercent  + randY}%`;
    });

    const delay =
      successDanceMinDelay +
      Math.random() * (successDanceMaxDelay - successDanceMinDelay);

    successDanceTimer = setTimeout(step, delay);
  }

  step();
}

function stopSuccessDance() {
  if (successDanceTimer) {
    clearTimeout(successDanceTimer);
    successDanceTimer = null;
  }
}

// =============================
// 실패시
// =============================
function handleFail() {
  if (!gameStarted) return;

  gameStarted = false;
  stopBehaviors();
  stopSuccessDance();
  // 동공 실패 이미지 + 위치
  pupils.forEach(pupil => {
    pupil.src = failPupilSrc;
    pupil.style.left = `${baseLeftPercent}%`;
    pupil.style.top  = `${baseTopPercent}%`;
    pupil.style.transform = 'scale(1)';
  });

  // 👇 실패하면 흰자도 fail_shape 로 변경
  whites.forEach(white => {
    white.src = failWhiteSrc;
  });

  // 왼쪽 동공만 작게
  const leftPupil = pupils[0];
  if (leftPupil) {
    leftPupil.style.transform = `scale(${failLeftPupilScale})`;
    leftPupil.style.transformOrigin = '50% 50%';
  }

  if (title) {
    title.src = './image/crazy/fail_title.svg';
  }

  waitingForRestart = true;

  if (tryAgainTimer) {
    clearTimeout(tryAgainTimer);
  }

  tryAgainTimer = setTimeout(() => {
    if (!waitingForRestart) return;
    if (title) {
      title.src = './image/crazy/tryagain_title.svg';
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
