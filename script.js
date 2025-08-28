// Знаходимо наш <canvas> елемент за id
const canvas = document.getElementById("gameCanvas");

// Отримуємо "контекст малювання" 2D
const ctx = canvas.getContext("2d");

// Розміри нашого полотна
const canvasSize = 600;
const gridSize = 20;

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
  food = {
    // Генеруємо випадкове число від 0 до (кількість_клітинок - 1)
    x: Math.floor(Math.random() * (canvasSize / gridSize)),
    y: Math.floor(Math.random() * (canvasSize / gridSize)),
  };
}

// Це наш ігровий цикл
function gameLoop() {
  if (checkCollision()) {
    alert("Гра закінчена! Ваш рахунок: " + score);
    return; // Зупиняємо виконання функції gameLoop()
  }
  // 1. Очищаємо екран
  ctx.clearRect(0, 0, canvasSize, canvasSize);

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
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

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
