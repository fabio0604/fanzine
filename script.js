const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let score = 0;
let gameSpeed = 3;
let isGameOver = false;

const boat = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 100,
  width: 40,
  height: 60,
  speed: 5,
  moveUp: false,
  moveDown: false,
};

// Lista de obstáculos e tiros de canhão
const obstacles = [];
const cannonballs = [];

// Função para criar um novo obstáculo
function createObstacle() {
  const width = Math.floor(Math.random() * 60) + 40;
  const x = Math.floor(Math.random() * (canvas.width - width));
  const obstacle = {
    x: x,
    y: -20,
    width: width,
    height: 30,
    speed: gameSpeed,
  };
  obstacles.push(obstacle);

  // Dispara tiros de canhão em intervalos aleatórios
  setInterval(() => {
    if (!isGameOver) {
      cannonballs.push({
        x: obstacle.x + obstacle.width / 2,
        y: obstacle.y + obstacle.height,
        radius: 5,
        speed: 4,
      });
    }
  }, Math.floor(Math.random() * 2000) + 1000); // Intervalo de 1 a 3 segundos
}

// Função para desenhar o barco com nova perspectiva
function drawBoat() {
  // Casco do barco
  ctx.fillStyle = "#8B4513"; // Marrom
  ctx.fillRect(boat.x, boat.y, boat.width, boat.height);

  // Deck do barco
  ctx.fillStyle = "#D2B48C"; // Bege
  ctx.fillRect(boat.x + 10, boat.y + 10, boat.width - 20, boat.height - 40);

  // Mastro e vela frontal
  ctx.fillStyle = "#333333"; // Cor do mastro
  ctx.fillRect(boat.x + boat.width / 2 - 2, boat.y - 10, 4, 15);
  ctx.fillStyle = "#FFFFFF"; // Vela
  ctx.beginPath();
  ctx.moveTo(boat.x + boat.width / 2, boat.y - 10); // topo do mastro
  ctx.lineTo(boat.x + boat.width / 2 - 15, boat.y + 10); // canto esquerdo da vela
  ctx.lineTo(boat.x + boat.width / 2 + 15, boat.y + 10); // canto direito da vela
  ctx.fill();
}

// Função para desenhar obstáculos em pixel art
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "#5A3D31"; // Marrom dos obstáculos
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Canhões no obstáculo (pequenos retângulos pretos)
    ctx.fillStyle = "#000000";
    ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height - 5, 8, 5);
    ctx.fillRect(obstacle.x + obstacle.width - 13, obstacle.y + obstacle.height - 5, 8, 5);
  });
}

// Função para desenhar e movimentar os tiros de canhão
function drawCannonballs() {
  ctx.fillStyle = "#333333"; // Cor das bolas de canhão
  cannonballs.forEach((cannonball, index) => {
    ctx.beginPath();
    ctx.arc(cannonball.x, cannonball.y, cannonball.radius, 0, Math.PI * 2);
    ctx.fill();
    cannonball.y += cannonball.speed; // Move a bola de canhão para baixo

    // Remove a bola de canhão se sair da tela
    if (cannonball.y > canvas.height) {
      cannonballs.splice(index, 1);
    }
  });
}

// Movimenta o barco para cima e para baixo
function moveBoat() {
  if (boat.moveUp && boat.y > 0) boat.y -= boat.speed;
  if (boat.moveDown && boat.y + boat.height < canvas.height) boat.y += boat.speed;
}

// Movimenta os obstáculos para baixo
function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacle.speed;
  });
}

// Verifica colisões entre o barco e os obstáculos ou bolas de canhão
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

  cannonballs.forEach((cannonball) => {
    if (
      boat.x < cannonball.x + cannonball.radius &&
      boat.x + boat.width > cannonball.x - cannonball.radius &&
      boat.y < cannonball.y + cannonball.radius &&
      boat.y + boat.height > cannonball.y - cannonball.radius
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
  drawCannonballs(); // Desenha os tiros de canhão

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
  if (e.key === "ArrowUp") boat.moveUp = true;
  if (e.key === "ArrowDown") boat.moveDown = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") boat.moveUp = false;
  if (e.key === "ArrowDown") boat.moveDown = false;
});

// Inicia o jogo
createObstacle();
update();
