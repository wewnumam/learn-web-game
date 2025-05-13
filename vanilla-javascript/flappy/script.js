const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
let game = setInterval(update, 40);
let score = 0;

const flappyW = 40;
const flappyH = 40;
const flappyG = 3;
const flappyV = 20;
let flappyX = canvas.width / 2 - flappyW / 2;
let flappyY = canvas.height / 2 - flappyH / 2;
let flappyFlap = false;

const pipeW = 60;
const pipeH = canvas.height;
const pipeV = 4;
let pipeX = [canvas.width];
let pipeY = 0;

const pipeHoleH = canvas.height / 4;
const pipeHoleRandom = getRandomInt(canvas.height - pipeHoleH);
let pipeHoleTop = [pipeHoleRandom];
let pipeHoleBottom = [pipeHoleRandom + pipeHoleH];

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pipe movement
    for (let i = 0; i < pipeX.length; i++) {
        pipeX[i] -= pipeV;
    }

    // Append pipe
    if (pipeX[pipeX.length - 1] < canvas.width/2) {
        pipeX.push(canvas.width);

        const pipeHoleRandom = getRandomInt(canvas.height - pipeHoleH);
        pipeHoleTop.push(pipeHoleRandom);
        pipeHoleBottom.push(pipeHoleRandom + pipeHoleH);

        score++;
    }

    // Flappy movement
    if (flappyFlap) {
        flappyY -= flappyV;
        flappyFlap = false;
    } else {
        flappyY += flappyG;
    }

    // Hit the ground
    if (flappyY + flappyH > canvas.height) {
        clearInterval(game);
    }

    // Hit the pipe
    for (let i = 0; i < pipeX.length; i++) {
        if ((
            flappyX + flappyW > pipeX[i] &&
            flappyX + flappyW < pipeX[i] + pipeW
        ) && (
            flappyY < pipeHoleTop[i] ||
            flappyY + flappyH > pipeHoleBottom[i]
        )) {
            clearInterval(game);
        }
    }

    // Pipe draw
    for (let i = 0; i < pipeX.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipeX[i], pipeY, pipeW, pipeH);

        ctx.fillStyle = 'white';
        ctx.fillRect(pipeX[i], pipeHoleTop[i], pipeW, pipeHoleH);
    }

    // Player draw
    ctx.fillStyle = 'yellow';
    ctx.fillRect(flappyX, flappyY, flappyW, flappyH);

    scoreDisplay.innerHTML = 'Score: ' + score;
}

function input(e) {
    if (e.key == 'ArrowUp' || e.keyCode == 32) {
        flappyFlap = true;
    }

    switch (e.key) {
        case 'Escape':
            clearInterval(game);
            break;
        case 'q':
            clearInterval(game);
            break;
    }
}

document.addEventListener('keydown', input);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}