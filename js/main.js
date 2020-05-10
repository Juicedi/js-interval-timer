const interval = 30;
let second = 0;

let moves = 0;
let move = 0;

let repetitions = 0;
let repetition = 0;

let rest = false;
let intervalTimer = null;

const form = document.getElementById('timer-settings');
const domTotalTime = document.getElementById('total-time');
const domContent = document.getElementById('content');

const domIntervalCounter = document.getElementById('interval__counter');
const domIntervalMaximum = document.getElementById('interval__maximum');

const moveInput = document.getElementById('move__input');
const domMoveCounter = document.getElementById('move__counter');
const domMoveMaximum = document.getElementById('move__maximum');

const repetitionInput = document.getElementById('repetition__input');
const domRepetitionCounter = document.getElementById('repetition__counter');
const domRepetitionMaximum = document.getElementById('repetition__maximum');

function calculateTotalWorkoutTime(moveCount, reps, moveTime) {
  const totalSeconds = (moveTime * moveCount) * reps + (reps * moveTime);
  const totalMinutes = (totalSeconds / 60);
  const minutes = Math.floor(totalMinutes);

  return {
    seconds: (totalMinutes - minutes) * 60,
    minutes,
  };
}

function paint() {
  domMoveCounter.innerText = move + 1;
  domRepetitionCounter.innerText = repetition + 1;
  domIntervalCounter.innerText = second + 1;
}

function stopTimer() {
  clearInterval(intervalTimer);
  form.style.opacity = 1;
  form.style.pointerEvents = 'all';
}

// TODO: ready.. set.. go! kun move tai rest loppu
function iterate() {
  second += 1;

  if (second < interval) {
    paint();
    return;
  }

  second = 0;

  if (rest === false) {
    if (move + 1 < moves) {
      move += 1;
      paint();
      return;
    }

    if (repetition < repetitions - 1) {
      rest = true;
      domContent.classList.add('resting');
      paint();
      return;
    }
  }

  repetition += 1;
  move = 0;
  rest = false;
  domContent.classList.remove('resting');

  if (repetition >= repetitions) {
    stopTimer();
    return;
  }

  paint();
}

function updateValues() {
  moves = parseInt(moveInput.value, 10);
  repetitions = parseInt(repetitionInput.value, 10);
}

function submit() {
  move = 0;
  repetition = 0;
  second = 0;
  domMoveMaximum.innerText = moves;
  domRepetitionMaximum.innerText = repetitions;
  domIntervalMaximum.innerText = interval;
  paint();
  form.style.opacity = 0;
  form.style.pointerEvents = 'none';
}

function startTimer() {
  if (intervalTimer !== null) {
    clearInterval(intervalTimer);
  }

  intervalTimer = setInterval(iterate, 1000);
}

function zeroPad(value) {
  return value > 9 ? value : `0${value}`;
}

function onInputChange() {
  updateValues();
  const times = calculateTotalWorkoutTime(moves, repetitions, interval);
  domTotalTime.innerText = `${zeroPad(times.minutes)}:${zeroPad(times.seconds)}`;
}

moveInput.onkeyup = onInputChange;
repetitionInput.onkeyup = onInputChange;

form.onsubmit = (e) => {
  e.preventDefault();
  submit();
  startTimer();
};
