const restTimeMultiplier = 0.5;
const interval = 4;

let second = 0;
let moves = 0;
let move = 0;
let repetitions = 0;
let repetition = 0;
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
    const timeSpentDoingMoves = ((moveTime * moveCount) * reps);
    const timeSpentResting = ((reps - 1) * moveTime * restTimeMultiplier);
    const timeSpentReadySetGo = ((reps - 1) * moveCount * 4);
    const totalMinutes = (timeSpentDoingMoves + timeSpentResting + timeSpentReadySetGo) / 60;
    const minutes = Math.floor(totalMinutes);

    return {
        seconds: Math.round((totalMinutes - minutes) * 60),
        minutes,
    };
}

function paint(special) {
    switch (special) {
        case 'ready':
            domContent.classList.remove('resting');
            domContent.classList.add('ready');
            domIntervalMaximum.innerText = interval;
            break;
        case 'normal':
            domContent.classList.remove('resting');
            domIntervalMaximum.innerText = interval;
            break;
        case 'resting':
            domContent.classList.add('resting');
            domIntervalMaximum.innerText = Math.round(interval * restTimeMultiplier);
            break;
        case 'reset':
            domMoveMaximum.innerText = moves;
            domRepetitionMaximum.innerText = repetitions;
            domIntervalMaximum.innerText = interval;
            break;
        default:
            throw new Error('You should not able to get here.');
    }

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

function updateValues() {
    moves = parseInt(moveInput.value, 10);
    repetitions = parseInt(repetitionInput.value, 10);
}

function reset() {
    move = 0;
    repetition = 0;
    second = 0;
    paint('reset');
}

function startTimer() {
    const restTime = Math.round(interval * restTimeMultiplier);
    const classes = ['ready', 'set', 'go'];
    let classStepper = null;

    const stages = {
        readySetGo: 0,
        rest: 1,
        train: 2,
        end: 3,
    };

    let stage = stages.readySetGo;

    if (intervalTimer !== null) {
        clearInterval(intervalTimer);
    }

    intervalTimer = setInterval(() => {
        switch (stage) {
            case stages.end:
                second += 1;
                paint();
                stopTimer();
                break;
            case stages.readySetGo:
                if (classStepper === null) {
                    paint('ready');
                    classStepper = stepClasses(classes);
                } else {
                    classStepper = classStepper(classes);
                }

                if (classStepper !== null) {
                    break;
                }

                stage = stages.train;
                break;
            case stages.rest:
                second += 1;
                paint();

                if (second >= restTime - 1) {
                    second = 0;
                    stage = stages.readySetGo;
                }
                break;
            case stages.train:
                second += 1;

                if (
                    second >= interval - 2
                    && move + 1 >= moves
                    && repetition >= repetitions - 1
                ) {
                    /* The end stage will paint the last second tick and stop
                     * the timer from ticking. */
                    paint();
                    stage = stages.end;
                    break;
                }

                if (second < interval) {
                    paint();
                    break;
                }

                second = 0;

                if (move + 1 < moves) {
                    move += 1;
                    paint();
                    stage = stages.readySetGo;
                    break;
                }

                if (repetition < repetitions - 1) {
                    repetition += 1;
                    move = 0;
                    stage = stages.rest;
                    paint('resting');
                    break;
                }

                break;
            default:
                throw new Error('You should not get here.');
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
    reset();
    form.style.opacity = 0;
    form.style.pointerEvents = 'none';
    startTimer();
};
