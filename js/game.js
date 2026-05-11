const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 100,
    y: 100,
    size: 64
};

function drawPlayer(){
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();
