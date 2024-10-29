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

// Lista de obstáculos
const obstacles = [];

// Função para criar um novo obstáculo
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

// Função para desenhar o barco com detalhes em pixel art
function drawBoat() {
  // Base do barco
  ctx.fillStyle = "#8B4513"; // Marrom
  ctx.fillRect(boat.x, boat.y + 20, boat.width, boat.height - 20);

  // Detalhes do casco do barco
  ctx.fillStyle = "#D2B48C"; // Bege
  ctx.fillRect(boat.x + 10, boat.y + 40, boat.width - 20, 10);

  // Mastro
  ctx.fillStyle = "#000000"; // Preto
  ctx.fillRect(boat.x + boat.width / 2 - 2, boat.y, 4, 20);

  // Vela
  ctx.fillStyle = "#FFFFFF"; // Branco
  ctx.beginPath();
  ctx.moveTo(boat.x + boat.width / 2, boat.y); // topo do mastro
  ctx.lineTo(boat.x + boat.width / 2 + 10, boat.y + 20); // canto direito
  ctx.lineTo(boat.x + boat.width / 2, boat.y + 20); // base do mastro
  ctx.fill();
}

// Função para desenhar obstáculos em pixel art
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    // Cor aleatória para o obstáculo
    ctx.fillStyle = `rgb(${Math.random() * 100 + 100}, ${Math.random() * 100 + 50}, ${Math.random() * 50})`;
    // Blocos para criar um padrão de madeira pixelado
    for (let i = 0; i < obstacle.width; i += 10) {
      for (let j = 0; j < obstacle.height; j += 10) {
        ctx.fillRect(obstacle.x + i, obstacle.y + j, 8, 8);
      }
    }
  });
}

// Movimenta o barco com as teclas de seta
function moveBoat() {
  if (boat.moveLeft && boat.x > 0) boat.x -= boat.speed;
  if (boat.moveRight && boat.x + boat.width < canvas.width) boat.x += boat.speed;
}

// Movimenta os obstáculos para baixo
function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacle.speed;
  });
}

// Verifica colisões entre o barco e os obstáculos
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

// Atualiza a pontuação
function updateScore() {
  score += 1;
  document.getElementById("score").innerText = score;
}

// Função de atualização do jogo
function update() {
  if (isGameOver) {
    alert("Game Over! Pontuação final: " + score);
    document.location.reload();
    return;
  }

  // Limpa o canvas antes de redesenhar
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoat(); // Desenha o barco
  drawObstacles(); // Desenha os obstáculos

  moveBoat(); // Movimenta o barco
  moveObstacles(); // Movimenta os obstáculos

  // Remove obstáculos que saíram da tela e cria novos
  obstacles.forEach((obstacle, index) => {
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      updateScore();
      createObstacle();
    }
  });

  checkCollisions(); // Verifica colisões

  requestAnimationFrame(update); // Loop do jogo
}

// Controle de movimento do barco com teclas
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") boat.moveLeft = true;
  if (e.key === "ArrowRight") boat.moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") boat.moveLeft = false;
  if (e.key === "ArrowRight") boat.moveRight = false;
});

// Inicia o jogo
createObstacle();
update();
