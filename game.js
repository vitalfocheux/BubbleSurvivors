// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 60;

// Key game classes
class BubbleSurvivorsGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.score = 0;
        this.difficulty = 1;
        this.initGame();
        this.wave = 1;
    }

    initGame() {
        this.player = new PlayerBubble(
            this.canvas.width / 2, 
            this.canvas.height / 2
        );
        
        this.startGameLoop();
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.update();
            this.render();
            this.spawnEnemies();
            this.checkCollisions();
        }, 1000 / FPS);
    }

    update() {
        this.player.update(this.canvas);
        this.updateProjectiles();
        this.updateEnemies();
    }

    updateProjectiles() {
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            // Remove projectiles out of bounds
            if (this.isOutOfBounds(projectile)) {
                this.projectiles.splice(index, 1);
            }
        });
    }

    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.player.x, this.player.y);
            // Remove enemies out of bounds
            if (this.isOutOfBounds(enemy)) {
                this.enemies.splice(index, 1);
            }
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        this.renderProjectiles();
        this.renderEnemies();
    }

    renderProjectiles() {
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
    }

    renderEnemies() {
        this.enemies.forEach(enemy => enemy.render(this.ctx));
    }

    spawnEnemies() {
        if (Math.random() < 0.02 * this.difficulty) {
            const enemy = new Enemy(this.canvas);
            this.enemies.push(enemy);
        }
    }

    checkCollisions() {
        this.projectiles.forEach((projectile, pIndex) => {
            this.enemies.forEach((enemy, eIndex) => {
                if (this.isColliding(projectile, enemy)) {
                    this.projectiles.splice(pIndex, 1);
                    this.enemies.splice(eIndex, 1);
                    this.score++;
                }
            });
        });
    }

    isColliding(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx*dx + dy*dy) < (obj1.radius + obj2.radius);
    }

    isOutOfBounds(obj) {
        return obj.x < 0 || obj.x > this.canvas.width || 
               obj.y < 0 || obj.y > this.canvas.height;
    }
}

class PlayerBubble {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.speed = 5;
        this.opacity = 0.7 + Math.random() * 0.3;
        this.wobble = {
            x: Math.random() * Math.PI * 2,
            amplitude: Math.random() * 2,
            frequency: 0.05 + Math.random() * 0.1
        };
    }

    update(canvas) {
        this.handleMovement(canvas);
        this.projectileCooldown = Math.max(0, this.projectileCooldown - 1);
    }

    handleMovement(canvas) {
        if (keys.ArrowLeft && this.x > this.radius) this.x -= this.speed;
        if (keys.ArrowRight && this.x < canvas.width - this.radius) this.x += this.speed;
        if (keys.ArrowUp && this.y > this.radius) this.y -= this.speed;
        if (keys.ArrowDown && this.y < canvas.height - this.radius) this.y += this.speed;
    }

    render(ctx) {

        ctx.save(); // Sauvegarder le contexte du canvas
    
        // Création du chemin de base de la bulle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
        // Gradient radial plus complexe
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.2, 
            this.y - this.radius * 0.2, 
            0, 
            this.x, 
            this.y, 
            this.radius
        );
        gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
        gradient.addColorStop(0.7, `rgba(74,144,226,${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(74,144,226,${this.opacity * 0.2})`);
    
        // Application du style de remplissage
        ctx.fillStyle = gradient;
        ctx.fill();
    
        // Reflets lumineux
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        
        // Petit reflet
        ctx.arc(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            this.radius * 0.1, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    
        // Contour avec effet de membrane
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,230,255,${this.opacity * 0.7})`;
        ctx.lineWidth = this.radius * 0.05;
        ctx.stroke();
    
        // Effet de profondeur avec une légère ombre
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.95, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,0,0,${this.opacity * 0.1})`;
        ctx.lineWidth = this.radius * 0.1;
        ctx.stroke();
    
        ctx.restore(); // Restaurer le contexte du canvas
    }

    shootProjectile() {
        if (this.projectileCooldown === 0) {
            const projectile = new Projectile(this.x, this.y);
            game.projectiles.push(projectile);
            this.projectileCooldown = 10;
        }
    }
}

class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 10;
        this.direction = this.calculateDirection();
    }

    calculateDirection() {
        return { 
            x: Math.cos(Math.random() * Math.PI * 2),
            y: Math.sin(Math.random() * Math.PI * 2)
        };
    }

    update() {
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}

class Enemy {
    constructor(canvas) {
        this.canvas = canvas;
        this.radius = 15;
        this.speed = 2;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    update(playerX, playerY) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Game initialization
let game;
function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    game = new BubbleSurvivorsGame(canvas);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') game.player.shootProjectile();
    });
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    initializeGame();

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Initial resize
    resizeCanvas();

    // Resize canvas on window resize
    window.addEventListener('resize', resizeCanvas);
});