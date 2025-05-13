const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
let game = setInterval(update, 40);
let score = 0;

const dinoW = 40;
const dinoH = 40;
const dinoM = 1;
let dinoV = 10;
let dinoX = canvas.width / 2 - dinoW / 2;
let dinoY = canvas.height - dinoH;
let dinoJump = false;

const cactusW = 20;
const cactusH = 75;
const cactusV = 10;
let cactusX = [canvas.width];
let cactusY = canvas.height - cactusH;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // cactus movement
    for (let i = 0; i < cactusX.length; i++) {
        cactusX[i] -= cactusV;
    }

    // Append cactus
    if (cactusX[cactusX.length - 1] < canvas.width/2) {
        cactusX.push(canvas.width);
        score++;
    }

    // dino movement
    if (dinoJump) {
        if (dinoV > 0) {
            F = 0.5 * dinoM * dinoV * dinoV;
        } else {
            F = -(0.5 * dinoM * dinoV * dinoV);
        }

        dinoY -= F;
        dinoV -= 1;

        if (dinoY > canvas.height) {
            dinoY = canvas.height;
            dinoJump = false;
            dinoV = 10
        }
    }

    // Hit the ground
    if (dinoY + dinoH >= canvas.height) {
        dinoY = canvas.height - dinoH;
    }

    // Hit the cactus
    if (
        dinoX + dinoW >= cactusX[cactusX.length - 1] &&
        dinoX <= cactusX[cactusX.length - 1] + cactusW &&
        dinoY >= cactusY
    ) {
        clearInterval(game);
    }

    // cactus draw
    for (let i = 0; i < cactusX.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(cactusX[i], cactusY, cactusW, cactusH);
    }

    // Player draw
    ctx.fillStyle = 'yellow';
    ctx.fillRect(dinoX, dinoY, dinoW, dinoH);

    scoreDisplay.innerHTML = 'Score: ' + score;
}

function input(e) {
    if (e.key == 'ArrowUp' || e.keyCode == 32) {
        dinoJump = true;
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