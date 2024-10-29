const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let score = 0;
let gameSpeed = 3;
let isGameOver = false;

const boat = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 70,
  width: 40,
  height: 60,
  speed: 5,
  moveLeft: false,
  moveRight: false,
};

const obstacles = [];

function createObstacle() {
  const width = Math.floor(Math.random() * 60) + 40;
  const x = Math.floor(Math.random() * (canvas.width - width));
  const obstacle = {
    x: x,
    y: -20,
    width: width,
    height: 20,
    speed: gameSpeed,
  };
  obstacles.push(obstacle);
}

function drawBoat() {
  ctx.fillStyle = "red";
  ctx.fillRect(boat.x, boat.y, boat.width, boat.height);
}

function drawObstacles() {
  ctx.fillStyle = "brown";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function moveBoat() {
  if (boat.moveLeft && boat.x > 0) boat.x -= boat.speed;
  if (boat.moveRight && boat.x + boat.width < canvas.width) boat.x += boat.speed;
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacle.speed;
  });
}

function checkCollisions() {
  obstacles.forEach((obstacle) => {
    if (
      boat.x < obstacle.x + obstacle.width &&
      boat.x + boat.width > obstacle.x &&
      boat.y < obstacle.y + obstacle.height &&
      boat.y + boat.height > obstacle.y
    ) {
      isGameOver = true;
    }
  });
}

function updateScore() {
  score += 1;
  document.getElementById("score").innerText = score;
}

function update() {
  if (isGameOver) {
    alert("Game Over! Pontuação final: " + score);
    document.location.reload();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoat();
  drawObstacles();

  moveBoat();
  moveObstacles();

  obstacles.forEach((obstacle, index) => {
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      updateScore();
      createObstacle();
    }
  });

  checkCollisions();

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") boat.moveLeft = true;
  if (e.key === "ArrowRight") boat.moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") boat.moveLeft = false;
  if (e.key === "ArrowRight") boat.moveRight = false;
});

createObstacle();
update();
