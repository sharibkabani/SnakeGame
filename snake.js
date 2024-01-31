//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

// snake
var snakeX = blockSize * 10;
var snakeY = blockSize * 10;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

// food
var foodX;
var foodY;

// scores
var score = 0;
var highScore = 0;

// sounds
var eatSound = new Audio("Mario Coin Sound - Sound Effect (HD).mp3");
var gameOverSound = new Audio("Super Mario Bros. - Game Over Sound Effect.mp3"); 

// game over condition
var gameOver = false;

window.onload = function() {
    highScore = parseInt(localStorage.getItem("highScore")) || 0;
    document.getElementById("highScoreSpan").innerHTML = highScore;

    board = document.getElementById("board");
    board.height = blockSize * rows;
    board.width = blockSize * cols;
    context = board.getContext("2d"); 

    placeFood();
    document.addEventListener("keyup", changeDirection); 

    setInterval(update, 1000 / 10); 
}

function update() {
    if (gameOver) {
        if (score > highScore) {
            highScore = score;
            document.getElementById("highScoreSpan").innerHTML = highScore;

            localStorage.setItem("highScore", highScore);
        }
        resetGame();
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        score++;
        document.getElementById("scoreSpan").innerHTML = score;
        eatSound.play();
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "cyan";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // game over conditions
    if (snakeX < 0 || snakeX > (cols * blockSize) || snakeY < 0 || snakeY > (rows * blockSize)) {
        gameOverSound.play();
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOverSound.play();
            gameOver = true;
        }
    }
    
}

function resetGame() {
    score = 0;
    document.getElementById("scoreSpan").innerHTML = score;

    gameOver = false;

    snakeBody = [];
    snakeX = blockSize * 10;
    snakeY = blockSize * 10;
    velocityX = 0;
    velocityY = 0;

    placeFood();

    if (snakeX < 0 || snakeX > (cols * blockSize) || snakeY < 0 || snakeY > (rows * blockSize)) {
        gameOverSound.play();
        gameOver = true;
        resetGame();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOverSound.play();
            gameOver = true;
            resetGame();
        }
    }

    startMessage.style.display = "block";
}

function changeDirection(event) {
    if (event.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;

    } else if (event.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;

    } else if (event.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;

    } else if (event.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;

    }
}

function placeFood() {
    while (true) {
        foodX = Math.floor(Math.random() * rows) * blockSize;
        foodY = Math.floor(Math.random() * cols) * blockSize;

        let overlap = snakeBody.some(part => part[0] === foodX && part[1] === foodY);

        if (!overlap) break; // If the food doesn't overlap with the snake's body, break the loop
    }

}
