const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const eatSfx = new Audio('eat.wav');
const hitSfx = new Audio('hit.wav');

const scoreDisplay = document.querySelector('#score span');
const btnControlContainer = document.getElementById('btnControlContainer');
const btnEnter = document.getElementById('btnEnter');
const btnReload = document.getElementById('btnReload');
btnControlContainer.style.display = 'none';
btnReload.style.display = 'none';

// Game loop
let game = setInterval(update, 100);
let isGameStart = false;

const snakeW = 20;
const snakeH = 20;
const snakeV = 20;
let snakeX = 0;
let snakeY = 0;
let snakeDX = snakeV;
let snakeDY = 0;
let tailX = [];
let tailY = [];

const appleW = 20;
const appleH = 20;
let appleX = 0;
let appleY = 0;

let score = 0;
let boardX = [];
let boardY = [];
for (let i = 0; i < canvas.width; i += appleW) boardX.push(i);
for (let i = 0; i < canvas.height; i += appleW) boardY.push(i);

function start() {
    // Prevent overriding call
    if (!isGameStart) {
        // Show control button in mobile screen
        function screenWidthChecker(mediaScreenWidth) {
            if (mediaScreenWidth.matches) {
                btnControlContainer.style.display = 'grid';
            }
        }
        const mediaScreenWidth = window.matchMedia("(max-width: 600px)");
        screenWidthChecker(mediaScreenWidth);
        mediaScreenWidth.addListener(screenWidthChecker);

        btnEnter.style.display = 'none';
        btnReload.style.display = 'none';
    }
    isGameStart = true;
}

function update() {
    if (isGameStart) {
        // Play screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake();
        draw();
    } else {
        // Start screen
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "34px 'Press Start 2P'";
        ctx.strokeStyle = '#FF2222';
        ctx.fillStyle = '#FFFFFF';
        ctx.lineWidth = 0.75;
        ctx.textAlign = "center";
        let msg = "Press ENTER to start!"
        ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
    }
}

function snake() {
    // Snake movement, manipulate by input()
    snakeX += snakeDX;
    snakeY += snakeDY;

    // Stay on the board
    if (snakeX > canvas.width) snakeX = 0;
    if (snakeX < 0) snakeX = canvas.width;
    if (snakeY > canvas.height) snakeY = 0;
    if (snakeY < 0) snakeY = canvas.height;

    // Snake eats apple
    if (snakeX == appleX && snakeY == appleY) {
        eatSfx.play();
        score++;
        appleX = boardX[Math.floor(Math.random() * boardX.length)];
        appleY = boardY[Math.floor(Math.random() * boardY.length)];
    }

    // Tail
    tailX.unshift(snakeX);
    tailY.unshift(snakeY);
    if (tailX.length > score) {
        tailX.pop();
        tailY.pop();
    }

    // Snake bites his tail
    for (let i = 0; i < score; i++) {
        if (i > 2 && snakeX == tailX[i] && snakeY == tailY[i]) {
            gameOver();
            break;
        }
    }
}

function gameOver() {
    hitSfx.play();
    clearInterval(game);
    score += ' GAME OVER';
    btnControlContainer.style.display = 'none';
    btnReload.style.display = 'block';
}

function draw() {
    // Draw snake
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(snakeX, snakeY, snakeW, snakeH);

    // Draw tail
    for (let i = 0; i < tailX.length; i++) {
        if (i > 0) {
            ctx.fillStyle = '#3A5BA0';
        } else {
            ctx.fillStyle = '#FFA500';
        }
        ctx.fillRect(tailX[i], tailY[i], snakeW, snakeH);
    }

    // Draw apple
    ctx.fillStyle = '#990000';
    ctx.fillRect(appleX, appleY, appleW, appleH);

    // Draw score
    scoreDisplay.innerHTML = score;
}

function input(e) {
    if (e.key == 'ArrowLeft' || e.key == 'a') turnLeft();
    else if (e.key == 'ArrowRight' || e.key == 'd') turnRight();
    else if (e.key == 'ArrowUp' || e.key == 'w') turnUp();
    else if (e.key == 'ArrowDown' || e.key == 's') turnDown();

    if (e.key == 'Enter') start();
    if (e.key == 'Escape') gameOver();
    if (e.key == 'q') gameOver();
}

function turnLeft() {
    if (snakeDX == 0) snakeDX = -snakeV;
    snakeDY = 0;
}

function turnRight() {
    if (snakeDX == 0) snakeDX = snakeV;
    snakeDY = 0;
}

function turnUp() {
    snakeDX = 0;
    if (snakeDY == 0) snakeDY = -snakeV;
}

function turnDown() {
    snakeDX = 0;
    if (snakeDY == 0) snakeDY = snakeV;
}

document.addEventListener('keydown', input);