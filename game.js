import { Enemy } from './Enemy/Enemy.js';
import { Blob_Fish } from './Enemy/Blob_Fish.js';

// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 60;

const TIME_MUL = 5;

// Key game classes
class BubbleSurvivorsGame {
    constructor(canvas, waveNumber, score, difficulty) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.score = score;
        this.difficulty = difficulty;
        this.initGame();
        this.waveNumber = waveNumber;
        this.time = this.waveNumber * TIME_MUL;
        this.isGameRunning = true;

        setInterval(() => this.updateTime(), 1000);
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
            if(this.isGameRunning){
                this.update();
                this.render();
                this.spawnEnemies();
                this.checkCollisions();
            }
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

    updateTime(){
        this.time--;
        if(this.time === 0){

            for(let enemy of this.enemies){
                this.player.expNow += enemy.getExp();
                this.player.money += enemy.getExp();
            }

            this.enemies = [];
            this.render();
            this.waveNumber++;
            this.difficulty++;
            
            console.log(this.waveNumber);

            // Open the modal
            const modal = document.getElementById('modal');
            modal.style.display = 'block';

            this.isGameRunning = false;

            // Close the modal when the user clicks on the button
            const nextWaveButton = document.getElementById('nextWave');
            nextWaveButton.onclick = () => {
                modal.style.display = 'none';
                this.isGameRunning = true;

                // Reset or reinitialize game state for new wave
                this.enemies = [];  // Clear existing enemies
                this.projectiles = [];  // Clear existing projectiles
                this.time = this.waveNumber * TIME_MUL;  // Reset timer based on wave number
            }
        }
    }

    

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        this.renderProjectiles();
        this.renderEnemies();
        this.renderWaveNumber();
    }

    renderProjectiles() {
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
    }

    renderEnemies() {
        this.enemies.forEach(enemy => enemy.render(this.ctx));
    }

    renderWaveNumber() {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Vague ${this.waveNumber}`, this.canvas.width / 2, 40);
        this.ctx.fillText(`Temps restant: ${this.time}`, this.canvas.width / 2, 70);
    }

    spawnEnemies() {
        if (Math.random() < 0.02 * this.difficulty) {
            const enemy = new Blob_Fish(this.canvas, 15, 2);
            this.enemies.push(enemy);
        }
    }

    checkCollisions() {
        this.enemies.forEach((enemy, eIndex) => {
            if (this.isColliding(this.player, enemy)) {
                this.enemies.splice(eIndex, 1);
                this.player.health -= enemy.getDamage();
            }
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
        this.healthMax = 100;
        this.health = this.healthMax;
        this.expNow = 0;
        this.expMax = 100;
        this.money = 0;
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

        // Dessiner la barre d'expérience
        this.renderExperienceBar(ctx);

        this.renderHealthBar(ctx);
    
        ctx.restore(); // Restaurer le contexte du canvas
    }

    renderExperienceBar(ctx) {
        const barWidth = 100;
        const barHeight = 20;
        const barX = 10; // Position X en haut à gauche
        const barY = 30; // Position Y en haut à gauche

        // Dessiner la barre de fond (grise)
        ctx.fillStyle = 'grey';
        ctx.fillRect(barX, (barY - 10), barWidth, barHeight);

        // Dessiner la barre d'expérience (verte)
        const expWidth = (this.expNow / this.expMax) * barWidth;
        ctx.fillStyle = 'green';
        ctx.fillRect(barX, (barY - 10), expWidth, barHeight);

        // Dessiner le texte de l'expérience
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.expNow} / ${this.expMax} XP`, barX + barWidth / 2, (barY - 10) + barHeight / 2);

        // Dessiner le nombre de money au-dessus de la barre d'expérience
        ctx.fillText(`Money: ${this.money}`, barX + barWidth / 2, (barY) - barHeight);
    }


    renderHealthBar(ctx) {
        const barWidth = 100;
        const barHeight = 20;
        const barX = 10; // Position X en haut à gauche
        const barY = 45; // Position Y en haut à gauche

        // Dessiner la barre de fond (grise)
        ctx.fillStyle = 'grey';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Dessiner la barre de vie (rouge)
        const healthWidth = (this.health / 100) * barWidth;
        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        // Dessiner le texte de la vie
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.health} / ${this.healthMax} HP`, barX + barWidth / 2, barY + barHeight / 2);
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

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Game initialization
let game;
function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    game = new BubbleSurvivorsGame(canvas, 1, 0, 1);

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