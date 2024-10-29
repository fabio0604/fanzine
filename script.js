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
  moveLeft: false,
  moveRight: false,
};

// Lista de obstáculos, tiros de canhão do inimigo e tiros do barco
const obstacles = [];
const cannonballs = [];
const boatShots = [];

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
    hit: false,
  };
  obstacles.push(obstacle);

  // Dispara tiros de canhão do obstáculo em intervalos aleatórios
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

// Função para desenhar o barco
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

// Função para desenhar obstáculos
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "#5A3D31"; // Marrom dos obstáculos
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height - 5, 8, 5);
    ctx.fillRect(obstacle.x + obstacle.width - 13, obstacle.y + obstacle.height - 5, 8, 5);
  });
}

// Função para desenhar e movimentar os tiros de canhão do barco
function drawBoatShots() {
  ctx.fillStyle = "#FF0000"; // Cor dos tiros do barco
  boatShots.forEach((shot, index) => {
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2);
    ctx.fill();
    shot.y -= shot.speed; // Move o tiro para cima

    // Remove o tiro se sair da tela
    if (shot.y < 0) {
      boatShots.splice(index, 1);
    }
  });
}

// Função para desenhar e movimentar os tiros de canhão inimigos
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

// Função para detectar colisões e criar explosões
function detectCollisions() {
  obstacles.forEach((obstacle, obsIndex) => {
    if (
      boat.x < obstacle.x + obstacle.width &&
      boat.x + boat.width > obstacle.x &&
      boat.y < obstacle.y + obstacle.height &&
      boat.y + boat.height > obstacle.y
    ) {
      isGameOver = true;
    }

    // Verifica colisão dos tiros do barco com obstáculos
    boatShots.forEach((shot, shotIndex) => {
      if (
        shot.x > obstacle.x &&
        shot.x < obstacle.x + obstacle.width &&
        shot.y > obstacle.y &&
        shot.y < obstacle.y + obstacle.height
      ) {
        // Explosão
        obstacles.splice(obsIndex, 1); // Remove o obstáculo
        boatShots.splice(shotIndex, 1); // Remove o tiro
        score += 10; // Aumenta o placar
      }
    });
  });

  // Verifica colisão das bolas de canhão inimigas com o barco
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

// Movimenta o barco
function moveBoat() {
  if (boat.moveUp && boat.y > 0) boat.y -= boat.speed;
  if (boat.moveDown && boat.y + boat.height < canvas.height) boat.y += boat.speed;
  if (boat.moveLeft && boat.x > 0) boat.x -= boat.speed;
  if (boat.moveRight && boat.x + boat.width < canvas.width) boat.x += boat.speed;
}

// Movimenta os obstáculos
function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacle.speed;
  });
}

// Atualiza a pontuação
function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

// Função de atualização do jogo
function update() {
  if (isGameOver) {
    alert("Game Over! Pontuação final: " + score);
    document.location.reload();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoat(); // Desenha o barco
  drawObstacles(); // Desenha os obstáculos
  drawCannonballs(); // Desenha os tiros de canhão inimigos
  drawBoatShots(); // Desenha os tiros do barco
  detectCollisions(); // Verifica colisões

  moveBoat(); // Movimenta o barco
  moveObstacles(); // Movimenta os obstáculos

  obstacles.forEach((obstacle, index) => {
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score += 1; // Aumenta a pontuação para cada obstáculo evitado
      updateScore();
      createObstacle();
    }
  });

  requestAnimationFrame(update); // Loop do jogo
}

// Controle de movimento do barco com teclas
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") boat.moveUp = true;
  if (e.key === "ArrowDown") boat.moveDown = true;
  if (e.key === "ArrowLeft") boat.moveLeft = true;
  if (e.key === "ArrowRight") boat.moveRight = true;
  if (e.key === " ") { // Barra de espaço para disparar
    boatShots.push({
      x: boat.x + boat.width / 2,
      y: boat.y,
      radius: 4,
      speed: 7,
    });
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") boat.moveUp = false;
  if (e.key === "ArrowDown") boat.moveDown = false;
  if (e.key === "ArrowLeft") boat.moveLeft = false;
  if (e.key === "ArrowRight") boat.moveRight = false;
});
