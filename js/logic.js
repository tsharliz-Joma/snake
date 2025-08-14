const playBoard = document.querySelector(".play-board");
const foodEl = document.createElement("div");
foodEl.className = "food";
playBoard.appendChild(foodEl);
const snakeEls = [];
let gameOver = false;
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const restartButton = document.querySelector(".restart");

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
  playBoard.classList.add("flash");
  setTimeout(() => {
    alert(`Game Over! Press any key to play again`);
    location.reload();
  }, 200);
};

const changeDirection = (event) => {
  const key = event.key || event?.dataset?.key || event?.target?.dataset?.key;
  if (key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((control) => {
  control.addEventListener("click", (e) => changeDirection(e));
});

restartButton?.addEventListener("click", () => location.reload());

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const particlePulse = (x, y) => {
  const p = document.createElement("div");
  p.style.gridArea = `${y} / ${x}`;
  p.style.borderRadius = "50%";
  p.style.pointerEvents = "none";
  p.style.boxShadow = "0 0 16px var(--food), 0 0 36px var(--food-soft)";
  p.style.animation = "pulse 600ms ease-out 1";
  playBoard.appendChild(p);
  setTimeout(() => p.remove(), 600);
};

const initGame = () => {
  if (gameOver) return handleGameOver();

  // let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
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
    particlePulse(foodX, foodY);
  }

  // Shift the body forward
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  // Wall collision
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  // 1) Update food position (keeps its CSS animation running)
  foodEl.style.gridArea = `${foodY} / ${foodX}`;

  // 2) Ensure we have the right number of snake segment nodes
  while (snakeEls.length < snakeBody.length) {
    const seg = document.createElement("div");
    seg.className = "head";
    playBoard.appendChild(seg);
    snakeEls.push(seg);
  }

  while (snakeEls.length > snakeBody.length) {
    playBoard.removeChild(snakeEls.pop());
  }
  // 3) Position each segment
  snakeEls.forEach((seg, i) => {
    const [sx, sy] = snakeBody[i];
    seg.style.gridArea = `${sy} / ${sx}`;
  });

  // Self collision check
  for (let i = 1; i < snakeBody.length; i++) {
    if (
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
      break;
    }
  }

  // for (let i = 0; i < snakeBody.length; i++) {
  //   // Adding a div for each part of the snake body
  //   htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
  //   if (
  //     i !== 0 &&
  //     snakeBody[0][1] === snakeBody[i][1] &&
  //     snakeBody[0][0] === snakeBody[i][0]
  //   ) {
  //     gameOver = true;
  //   }
  // }
  // playBoard.innerHTML = htmlMarkup;
};

function setAppHeight() {
  const appHeight = window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${appHeight}px`);
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
window.addEventListener("resize", setAppHeight);
setAppHeight();
document.addEventListener("keydown", changeDirection);
