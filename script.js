let backgroundColor = "beige";
let lastTap = 0;
let startX = 0;
let startY = 0;
let gameTimeoutId;
const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const canvasSize = 600;
const gridSize = 20;

let isPaused = false;

document.addEventListener("keydown", (event) => {
  if (
    event.key === "p" ||
    event.key === "P" ||
    event.key === "з" ||
    event.key === "З"
  ) {
    isPaused = !isPaused;
  }
});

let snake = [{ x: 10, y: 10 }];

let direction = { x: 1, y: 0 };

let score = 0;

let food = {};

function handleTouchStart(event) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  if (tapLength < 300 && tapLength > 0) {
    isPaused = !isPaused;
  }

  lastTap = currentTime;
  const firstTouch = event.touches[0];
  startX = firstTouch.clientX;
  startY = firstTouch.clientY;
}

function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function createFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)),
      y: Math.floor(Math.random() * (canvasSize / gridSize)),
    };
  } while (isSnake(newFood));

  food = newFood;
}

function isSnake(point) {
  return snake.some(
    (segment) => segment.x === point.x && segment.y === point.y
  );
}

function gameLoop() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (checkCollision()) {
    alert("Гра закінчена! Ваш рахунок: " + score);
    return;
  }
  if (isPaused) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);

    setTimeout(gameLoop, 150);
    return;
  }

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (head.x < 0) {
    head.x = canvasSize / gridSize - 1;
  }
  if (head.x >= canvasSize / gridSize) {
    head.x = 0;
  }
  if (head.y < 0) {
    head.y = canvasSize / gridSize - 1;
  }
  if (head.y >= canvasSize / gridSize) {
    head.y = 0;
  }

  snake.unshift(head);

  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;

  if (didEatFood) {
    score++;
    createFood();
  } else {
    snake.pop();
  }

  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });

  ctx.fillStyle = "red";
  ctx.font = `900 ${gridSize}px 'Font Awesome 6 Free'`;
  ctx.fillText("\uf5d2", food.x * gridSize, food.y * gridSize + gridSize - 2);
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText("Рахунок: " + score, 10, 20);

  gameTimeoutId = setTimeout(gameLoop, 150);
}

createFood();
gameLoop();

document.getElementById("sun").addEventListener("click", () => {
  backgroundColor = "beige";
});

document.getElementById("moon").addEventListener("click", () => {
  backgroundColor = "gray";
});

document.getElementById("arrowUp").addEventListener("touchend", (event) => {
  event.preventDefault();
  changeDirection({ key: "ArrowUp" });
});

document.getElementById("arrowDown").addEventListener("touchend", (event) => {
  event.preventDefault();
  changeDirection({ key: "ArrowDown" });
});

document.getElementById("arrowLeft").addEventListener("touchend", (event) => {
  event.preventDefault();
  changeDirection({ key: "ArrowLeft" });
});

document.getElementById("arrowRight").addEventListener("touchend", (event) => {
  event.preventDefault();
  changeDirection({ key: "ArrowRight" });
});

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  const keyPressed = event.key;
  const LEFT_KEY = "ArrowLeft";
  const RIGHT_KEY = "ArrowRight";
  const UP_KEY = "ArrowUp";
  const DOWN_KEY = "ArrowDown";

  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    direction = { x: -1, y: 0 };
  }
  if (keyPressed === UP_KEY && !goingDown) {
    direction = { x: 0, y: -1 };
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    direction = { x: 1, y: 0 };
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    direction = { x: 0, y: 1 };
  }
}

canvas.addEventListener("touchstart", handleTouchStart, false);

function restartGame() {
  if (gameTimeoutId) {
    clearTimeout(gameTimeoutId);
  }
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  isPaused = false;
  createFood();
  gameLoop();
}

document.getElementById("restartButton").addEventListener("click", () => {
  restartGame();
});

if (checkCollision()) {
  alert("Гра закінчена! Ваш рахунок: " + score);
  restartGame();
}
