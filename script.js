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
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let score = 0;
let food = {};

document.addEventListener("keydown", (event) => {
  if (["p", "P", "з", "З"].includes(event.key)) {
    isPaused = !isPaused;
  }
});

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
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );

  food = newFood;
}

function gameLoop() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (checkCollision()) {
    alert("Гра закінчена! Ваш рахунок: " + score);
    return;
  }

  if (isPaused) {
    ctx.fillStyle = "rgba(255, 80, 80, 0.8)";
    ctx.font = "bold 40px Poppins, Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    canvas.classList.add("paused");
    setTimeout(gameLoop, 150);
    return;
  } else {
    canvas.classList.remove("paused");
  }

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };
  if (head.x < 0) head.x = canvasSize / gridSize - 1;
  if (head.x >= canvasSize / gridSize) head.x = 0;
  if (head.y < 0) head.y = canvasSize / gridSize - 1;
  if (head.y >= canvasSize / gridSize) head.y = 0;

  snake.unshift(head);

  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
  if (didEatFood) {
    score++;
    createFood();
  } else {
    snake.pop();
  }

  // --- Малюємо змійку ---
  snake.forEach((segment, index) => {
    if (index === 0) {
      const gradient = ctx.createRadialGradient(
        segment.x * gridSize + gridSize / 2,
        segment.y * gridSize + gridSize / 2,
        2,
        segment.x * gridSize + gridSize / 2,
        segment.y * gridSize + gridSize / 2,
        gridSize / 1.2
      );
      gradient.addColorStop(0, "#00ffcc");
      gradient.addColorStop(1, "#006644");
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00ffcc";
    } else {
      const gradient = ctx.createLinearGradient(
        segment.x * gridSize,
        segment.y * gridSize,
        segment.x * gridSize + gridSize,
        segment.y * gridSize + gridSize
      );
      gradient.addColorStop(0, "#00cc66");
      gradient.addColorStop(1, "#006633");
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 0;
    }

    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });

  ctx.shadowBlur = 0;

  // --- Малюємо їжу ---
  const pulse = Math.sin(Date.now() / 250) * 3 + gridSize / 1.8;
  const foodGradient = ctx.createRadialGradient(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    2,
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    pulse / 2
  );
  foodGradient.addColorStop(0, "#ff6b6b");
  foodGradient.addColorStop(1, "#8b0000");

  ctx.fillStyle = foodGradient;
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2.2,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 20px Poppins, Arial";
  ctx.textAlign = "left";
  ctx.fillText("Рахунок: " + score, 10, 25);

  gameTimeoutId = setTimeout(gameLoop, 150);
}

createFood();
gameLoop();

document.getElementById("sun").addEventListener("click", () => {
  document.body.classList.add("light-mode");
});
document.getElementById("moon").addEventListener("click", () => {
  document.body.classList.remove("light-mode");
});

document.addEventListener("keydown", changeDirection);

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) > 30) {
    if (absX > absY) {
      if (deltaX > 0 && direction.x !== -1) direction = { x: 1, y: 0 };
      else if (deltaX < 0 && direction.x !== 1) direction = { x: -1, y: 0 };
    } else {
      if (deltaY > 0 && direction.y !== -1) direction = { x: 0, y: 1 };
      else if (deltaY < 0 && direction.y !== 1) direction = { x: 0, y: -1 };
    }
  }
});

function changeDirection(event) {
  if (typeof event.preventDefault === "function") event.preventDefault();

  const keyPressed = event.key;
  const LEFT_KEY = "ArrowLeft";
  const RIGHT_KEY = "ArrowRight";
  const UP_KEY = "ArrowUp";
  const DOWN_KEY = "ArrowDown";

  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  if (keyPressed === LEFT_KEY && !goingRight) direction = { x: -1, y: 0 };
  if (keyPressed === UP_KEY && !goingDown) direction = { x: 0, y: -1 };
  if (keyPressed === RIGHT_KEY && !goingLeft) direction = { x: 1, y: 0 };
  if (keyPressed === DOWN_KEY && !goingUp) direction = { x: 0, y: 1 };
}

canvas.addEventListener("touchstart", handleTouchStart, false);
document.getElementById("restartButton").addEventListener("click", restartGame);

function restartGame() {
  if (gameTimeoutId) clearTimeout(gameTimeoutId);
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  isPaused = false;
  createFood();
  gameLoop();
}
