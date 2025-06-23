const playBoard = document.querySelector(".play-board");
let gameOver = false;
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score : ${highScore}`;
scoreElement.innerText = `Score : ${score}`;
let foodX = 13;
let foodY = 10;
let snakeX = 5;
let snakeY = 10;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];
let setIntervalId;

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press any key to play again.");
  location.reload();
};

const changeDirection = (event) => {
  if (event.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (event.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (event.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (event.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((control) => {
    control.addEventListener("click", () => changeDirection({ key: control.dataset.key }));
})

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  snakeX += velocityX;
  snakeY += velocityY;

  //   Check if the snake ate the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score : ${score}`;
    highScoreElement.innerText = `High Score : ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Move forward the values of the elements in the snake body by 1
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
    // clearInterval(initGame);
  }
  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a div for each part of the snake body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
