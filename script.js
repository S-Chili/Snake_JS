let backgroundColor = "beige";

// Знаходимо наш <canvas> елемент за id
const canvas = document.getElementById("gameCanvas");

// Отримуємо "контекст малювання" 2D
const ctx = canvas.getContext("2d");

// Розміри нашого полотна
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
    isPaused = !isPaused; // Змінюємо стан на протилежний
  }
});

// Створюємо початкову змійку. Вона складається з одного сегмента.
let snake = [{ x: 10, y: 10 }];

// Задаємо початковий напрямок руху (вправо)
let direction = { x: 1, y: 0 };

let score = 0; // Початковий рахунок

// Координати їжі
let food = {};

function checkCollision() {
  // Починаємо перевірку з другого сегмента (індекс 1), бо голова (індекс 0) завжди буде співпадати
  for (let i = 1; i < snake.length; i++) {
    // Якщо координати голови збігаються з координатами іншого сегмента
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false; // Повертаємо false, якщо зіткнення немає
}

// Функція для генерації випадкових координат їжі
function createFood() {
  let newFood;
  // Цикл do-while буде виконуватись доти, доки ми не знайдемо вільне місце
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvasSize / gridSize)),
      y: Math.floor(Math.random() * (canvasSize / gridSize)),
    };
  } while (isSnake(newFood));

  food = newFood;
}

// Нова функція для перевірки, чи є клітинка частиною змійки
function isSnake(point) {
  // some() перевіряє, чи хоча б один елемент масиву відповідає умові
  return snake.some(
    (segment) => segment.x === point.x && segment.y === point.y
  );
}

// Це наш ігровий цикл
function gameLoop() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Додаємо зображення сонця та місяця на сторінку (не на canvas)
  // Додай в index.html, наприклад, після canvas
  // <img id="sun" src="sun.png" style="width: 50px; cursor: pointer;">
  // <img id="moon" src="moon.png" style="width: 50px; cursor: pointer;">

  if (checkCollision()) {
    alert("Гра закінчена! Ваш рахунок: " + score);
    return; // Зупиняємо виконання функції gameLoop()
  }
  if (isPaused) {
    // Малюємо напис "ПАУЗА"
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);

    // Якщо на паузі, просто зупиняємо цикл і чекаємо
    setTimeout(gameLoop, 150);
    return;
  }

  // 2. Створюємо нову голову змійки на основі поточного напрямку
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Перевірка на вихід за межі поля
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

  // 3. Додаємо нову голову на початок масиву
  snake.unshift(head);

  // Перевірка на зіткнення з їжею
  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;

  if (didEatFood) {
    // Змійка з'їла їжу!
    // Ми не будемо викликати snake.pop(), щоб змійка росла
    // Або ми могли б додати очки
    score++;
    createFood(); // Створюємо нову їжу
  } else {
    // Якщо змійка нічого не їла, видаляємо останній сегмент
    snake.pop();
  }

  // 5. Малюємо кожен сегмент змійки
  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });

  // Малюємо їжу
  ctx.fillStyle = "red"; // Колір іконки
  ctx.font = `900 ${gridSize}px 'Font Awesome 6 Free'`; // Розмір і шрифт
  ctx.fillText("\uf5d2", food.x * gridSize, food.y * gridSize + gridSize - 2);
  // Малюємо рахунок
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Рахунок: " + score, 10, 20); // Координати тексту

  // Викликаємо наступний кадр з затримкою 150 мілісекунд (0.15 секунди)
  setTimeout(gameLoop, 150);
}

// Запускаємо гру
createFood();
gameLoop();

// Додаємо JavaScript для обробки кліків
document.getElementById("sun").addEventListener("click", () => {
  backgroundColor = "beige";
  updateBackground();
});

document.getElementById("moon").addEventListener("click", () => {
  backgroundColor = "gray"; // Змінюємо на сірий
  updateBackground();
});

// Додаємо слухача подій для клавіатури
document.addEventListener("keydown", changeDirection);

// Ця функція буде змінювати напрямок руху змійки
function changeDirection(event) {
  const keyPressed = event.key;
  const LEFT_KEY = "ArrowLeft";
  const RIGHT_KEY = "ArrowRight";
  const UP_KEY = "ArrowUp";
  const DOWN_KEY = "ArrowDown";

  // Запобігаємо зворотному руху (наприклад, не можна йти вліво, якщо вже рухаєшся вправо)
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

// A function to reset the game state
function restartGame() {
  // Reset all game variables to their initial state
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  isPaused = false;
  // Create new food
  createFood();
  // Restart the game loop
  gameLoop();
}

// ... existing code

// Find the restart button and add a click event listener
document.getElementById("restartButton").addEventListener("click", () => {
  restartGame();
});

// We also need to change the game-over condition to call restartGame()
if (checkCollision()) {
  alert("Гра закінчена! Ваш рахунок: " + score);
  // Don't just return, show a restart button or call the restart function
  // For now, let's keep it simple and just have the alert.
  // The player can click the button we just added.
}
