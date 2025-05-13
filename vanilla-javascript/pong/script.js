const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
let game = setInterval(update, 1);
let score = [0, 0];

const player1W = 20;
const player1H = 100;
const player1V = 10;
let player1X = 0;
let player1Y = canvas.height / 2 - player1H / 2

const player2W = player1W;
const player2H = player1H;
const player2V = 10;
let player2X = canvas.width - player2W;
let player2Y = canvas.height / 2 - player2H / 2

const ballR = 20;
const ballV = 1;
let ballX = canvas.width / 2
let ballY = canvas.height / 2
let ballDX = ballV;
let ballDY = ballV;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball movement
    ballX += ballDX;
    ballY += ballDY;
    
    // Change ball direction when hit the board side and
    // append score when ball hit the left side or the right side of board
    if (ballY + ballR > canvas.height) ballDY = -ballV;
    if (ballY - ballR < 0) ballDY = ballV;
    if (ballX + ballR > canvas.width) {
        ballDX = -ballV;
        score[0]++;
    }
    if (ballX - ballR < 0) {
        ballDX = ballV;
        score[1]++;
    }

    // Player1 collision
    if (ballX - ballR < player1X + player1W && 
        ballY + ballR < player1Y + player1H &&
        ballY - ballR > player1Y) {
        ballDX = ballV;
    }

    // Player2 collision
    if (ballX + ballR > player2X &&
        ballY + ballR > player2Y &&
        ballY - ballR < player2Y + player2H) {
        ballDX = -ballV;
    }

    // Keep player on the board
    if (player1Y < 0) player1Y = 0;
    if (player1Y + player1H > canvas.height) player1Y = canvas.height - player1H;
    if (player2Y < 0) player2Y = 0;
    if (player2Y + player2H > canvas.height) player2Y = canvas.height - player2H;
    
    // Player draw
    ctx.fillRect(player1X, player1Y, player1W, player1H);
    ctx.fillRect(player2X, player2Y, player2W, player2H);
    
    // Ball draw
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballR, 0, 2 * Math.PI);
    ctx.fill();

    // Winner check
    if (score[0] == 10) {
        scoreDisplay.innerHTML = 'PLAYER 1 WIN!';
        clearInterval(game);
    } else if (score[1] == 10) {
        scoreDisplay.innerHTML = 'PLAYER 2 WIN!';
        clearInterval(game);
    } else {
        scoreDisplay.innerHTML = `${score[0]} : ${score[1]}`;
    }

}

function input(e) {
    // Player1 movement
    if (e.key == 'w') player1Y -= player1V;
    if (e.key == 's') player1Y += player1V;

    // Player2 movement
    if (e.key == 'ArrowUp') player2Y -= player2V;
    if (e.key == 'ArrowDown') player2Y += player2V;

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