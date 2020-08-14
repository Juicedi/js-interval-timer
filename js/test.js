function showForm() { }

function hideForm() { }

function PaintData(id, current, max) {
    this.id = id;
    this.current = current;
    this.max = max;
}

function getMax(id) {
    return document.getElementById(`${id}--input`).value;
}

function paint(paintDataArray) {
    paintDataArray.forEach((paintData) => {
        const current = document.getElementById(`${paintData.id}--current`);
        const max = document.getElementById(`${paintData.id}--max`);
        current.innerText = paintData.current;
        max.innerText = paintData.max;
    });
}

function Ticker(ids) {
    const states = {
        initial: 0,
        running: 1,
        resting: 2,
        readySetGo: 3,
        end: 4,
    };

    let state = states.initial;
    let seconds = 0;
    let moves = 0;
    let repetitions = 0;
    let timerId = null;

    function tick() {
        seconds += 1;

        switch (state) {
            case states.end:
                clearInterval(timerId);
                break;
            case states.resting:
                repetitions += 1;
                break;
            case states.readySetGo:
                break;
            case states.running:
                moves += 1;
                break;
            default:
                throw new Error('TICK: You should not get here');
        }

        const tickData = [];
        tickData.push(ids.seconds, seconds);
        tickData.push(ids.seconds, seconds, getMax(ids.seconds) / 2);
        paint(tickData);
    }

    this.start = function start() {
        timerId = setInterval(tick, 1000);
    };
}

function submitForm(ids, ticker) {
    const initialData = [];
    initialData.push(new PaintData(ids.seconds, 0, getMax(ids.seconds)));
    initialData.push(new PaintData(ids.moves, 0, getMax(ids.moves)));
    initialData.push(new PaintData(ids.repetitions, 0, getMax(ids.repetitions)));
    paint(initialData);
    hideForm();
    ticker.start();
}

(function main() {
    const ids = {
        seconds: 'seconds',
        moves: 'moves',
        repetitions: 'repetitions',
    };

    const ticker = new Ticker(ids);
    document.getElementById('button--submit').onclick = () => submitForm(ids, ticker);

    showForm();
}());
