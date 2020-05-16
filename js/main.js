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

function stepClasses(classes) {
    let iterationNbr = 0;

    function loop(list) {
        if (iterationNbr === 0) {
            domContent.classList.add(list[iterationNbr]);
        } else if (iterationNbr !== list.length) {
            domContent.classList.remove(list[iterationNbr - 1]);
            domContent.classList.add(list[iterationNbr]);
        } else {
            domContent.classList.remove(list[iterationNbr - 1]);
            return null;
        }

        iterationNbr += 1;
        return loop;
    }

    return loop(classes);
}

function iterate() {
    second += 1;

    if (second < interval) {
        paint();
        return null;
    }

    second = 0;

    if (rest === false) {
        if (move + 1 < moves) {
            move += 1;
            paint();
            return 'rsg';
        }

        if (repetition < repetitions - 1) {
            rest = true;
            domContent.classList.add('resting');
            paint();
            return null;
        }
    }

    repetition += 1;
    move = 0;
    rest = false;
    domContent.classList.remove('resting');

    if (repetition >= repetitions) {
        stopTimer();
        return null;
    }

    paint();
    return 'rsg';
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
    const classes = ['ready', 'set', 'go'];
    let classStepper = null;
    let stage = 'rsg';

    if (intervalTimer !== null) {
        clearInterval(intervalTimer);
    }

    intervalTimer = setInterval(() => {
        if (stage === 'rsg') {
            stage = null;
            classStepper = stepClasses(classes);
        } else if (typeof classStepper === 'function') {
            classStepper = classStepper(classes);
        } else {
            stage = iterate();
        }
    }, 1000);
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
