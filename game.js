import { Enemy } from './Enemy/Enemy.js';
import { Blob_Fish } from './Enemy/Blob_Fish.js';
import { Squid } from './Enemy/Squid.js';
import { Axolotl } from './Enemy/Axolotl.js';
import { Duck } from './Enemy/Duck.js';
import { Serpang } from './Enemy/Serpang.js';
import { Wailord } from './Enemy/Wailord.js';
import { Soap } from './Items/Soap.js';
import { BubbleBlaster } from './Items/BubbleBlaster.js';
import { Sword_Fish } from './Enemy/Sword_Fish.js';
import { Shark } from './Enemy/Shark.js';
import { Neon } from './Enemy/Neon.js';
import { Saw_Shark } from './Enemy/Saw_Shark.js';
import { Sea_Angler } from './Enemy/Sea_Angler.js';
import { CooldownBooster } from './Items/CooldownBooster.js';
import { MultiExp } from './Items/MultiExp.js';
import { Boots } from './Items/Boots.js';
import { BigShot } from './Items/BigShot.js';
import { Sogekin } from './Items/Sogekin.js';
import { Flash } from './Items/Flash.js';
import { One_UP } from './Items/1UP.js';

// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 60;

const TIME_MUL = 5;
const HEALTH_BASE = 15;
const WAVE = 1;
const COOLDOWN_PROJECTILE_BASE = 100;
const SPEED_PROJECTILE_BASE = 10;
const COOLDOWN_ENEMY_BASE = 1;
const DAMAGE_BASE = 1;
const EXP_BASE = 100;
const MONEY_BASE = 0;

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
        this.levelCurrent = 1;
        this.levelBeforeWave = 1;
        this.loadEnemiesConfig();
        // this.setupModal();
        this.enemyCooldown = 0;
        this.item1;
        this.item2;
        this.item3;

        setInterval(() => this.updateTime(), 1000);
    }

    async loadEnemiesConfig() {
        const response = await fetch('Enemies.json');
        this.enemiesConfig = await response.json();
    }

    setupModal() {
        this.modal = document.getElementById('modal');
        this.moneyDisplay = document.getElementById('moneyDisplay');
        this.itemButton1 = document.getElementById('itemButton1');
        this.itemButton2 = document.getElementById('itemButton2');
        this.itemButton3 = document.getElementById('itemButton3');
        this.updateMoneyDisplay();

        this.generateRandomItems();

        console.log(this.item1);

        // Ensure buttons are visible
        this.itemButton1.style.display = 'inline-block';
        this.itemButton2.style.display = 'inline-block';
        this.itemButton3.style.display = 'inline-block';

        //Remove old event listeners
        this.itemButton1.replaceWith(this.itemButton1.cloneNode(true));
        this.itemButton2.replaceWith(this.itemButton2.cloneNode(true));
        this.itemButton3.replaceWith(this.itemButton3.cloneNode(true));

        //Reattach new event listeners
        this.itemButton1 = document.getElementById('itemButton1');
        this.itemButton2 = document.getElementById('itemButton2');
        this.itemButton3 = document.getElementById('itemButton3');

        this.itemButton1.addEventListener('click', () => this.buyItem(this.item1, this.itemButton1));
        this.itemButton2.addEventListener('click', () => this.buyItem(this.item2, this.itemButton2));
        this.itemButton3.addEventListener('click', () => this.buyItem(this.item3, this.itemButton3));
    }

    generateRandomItems() {
        const items = [
            new Soap(),
            new BubbleBlaster(),
            new CooldownBooster(),
            new MultiExp(),
            new Boots(),
            new BigShot(),
            new Sogekin(),
            new Flash(),
            new One_UP()
        ]

        this.item1 = items[Math.floor(Math.random() * items.length)];
        this.item2 = items[Math.floor(Math.random() * items.length)];
        this.item3 = items[Math.floor(Math.random() * items.length)];

        this.itemButton1.textContent = this.DescriptorItem(this.item1);
        this.itemButton2.textContent = this.DescriptorItem(this.item2);
        this.itemButton3.textContent = this.DescriptorItem(this.item3);
    }

    DescriptorItem(item){
        return `${item.constructor.name}: ${item.getDescriptor()} - ${Math.floor(item.getCost() * (1 + (this.waveNumber - 2) * 0.2))}🫧`;
    }

    buyItem(item, button) {
        if(this.player.money < item.getCost() * (1 + (this.waveNumber - 2) * 0.2)) return;

        this.player.healthMax += item.getIncreaseLife();
        this.player.health = this.player.healthMax;

        // if(item instanceof BigShot){
        //     this.player.damage *= item.getIncreaseDamage();
        // }else{
        //     this.player.weapons.push(item.getIncreaseDamage());
        // }

        if(item.getIncreaseDamage() > 0){
            this.player.weapons.push(item.getIncreaseDamage());
        }

        if(item instanceof BigShot){
            this.player.CooldownBooster *= item.getDecreaseCooldown();
        }else if(item.getDecreaseCooldown() > 0){
            this.player.CooldownBooster *= item.getDecreaseCooldown() / 100;
        }

        if(item.getIncreaseExp() > 0){
            this.player.MultiExp *= item.getIncreaseExp();
        }

        if(item.getIncreaseSpeed() > 0 && this.player.speed < 10){
            this.player.speed *= item.getIncreaseSpeed();
        }
        
        this.player.money -= item.getCost() * (1 + (this.waveNumber - 2) * 0.2);
        button.style.display = 'none';
        console.log(`Cost: ${Math.floor(item.getCost() * (1 + (this.waveNumber - 2) * 0.2))}`);
        this.updateMoneyDisplay();
    }

    updateMoneyDisplay() {
        this.moneyDisplay.textContent = `Money: ${this.player.money}🫧`
    }


    initGame() {
        this.player = new PlayerBubble(
            this.canvas.width / 2, 
            this.canvas.height / 2,
            this
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
                this.checkProjectileCollisions();
            }
        }, 1000 / FPS);
    }

    update() {
        // if (!this.isGameRunning) return; // Stop updating if the game is not running

        // Check if player's health is 0 and time is greater than 0
        if (this.player.health <= 0 && this.time > 0) {
            this.isGameRunning = false;

            // Open the game over modal
            const gameOverModal = document.getElementById('gameOverModal');
            gameOverModal.style.display = 'block';

            // Handle game restart
            const restartGameButton = document.getElementById('restartGame');
            restartGameButton.onclick = () => {
                gameOverModal.style.display = 'none';
                this.isGameRunning = true;

                this.waveNumber = 1;
                this.difficulty = 1;
                this.levelCurrent = 1;
                this.levelBeforeWave = 1;
                this.player.money = 0;
                this.player.expNow = 0;
                this.player.expMax = EXP_BASE;
                this.player.health = HEALTH_BASE;
                this.player.healthMax = HEALTH_BASE;
                // Reset or reinitialize game state for new wave
                this.enemies = [];  // Clear existing enemies
                this.projectiles = [];  // Clear existing projectiles
                this.time = this.waveNumber * TIME_MUL;  // Reset timer based on wave number
            }
            return;
        }


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
            if (this.isOutOfBounds(enemy) || enemy.getLife() <= 0) {
                this.enemies.splice(index, 1);
                this.updateExp_Money(enemy);
            }
        });
    }

    checkProjectileCollisions() {
        this.projectiles.forEach((projectile, pIndex) => {
            this.enemies.forEach((enemy, eIndex) => {
                if (this.isColliding(projectile, enemy)) {
                    this.projectiles.splice(pIndex, 1);
                    enemy.life -= DAMAGE_BASE * (1 + this.player.weapons.reduce((a, b) => a + b, 0) / 100);
                }
            });
        });
    }

    updateExp_Money(enemy){
        this.player.expNow += enemy.getExp();
        if(this.player.expNow >= this.player.expMax){
            this.levelCurrent++;
            this.player.expNow = 0;
            this.player.expMax += 50;
        }
        this.player.money += enemy.getExp() * this.player.MultiExp;
    }

    updateTime(){
        this.time--;
        console.log(`Damage : ${DAMAGE_BASE*(1 + this.player.weapons.reduce((a, b) => a + b, 0) / 100)}`);
        if(this.time === 0){

            for(let enemy of this.enemies){
                this.updateExp_Money(enemy);
            }

            this.enemies = [];
            this.render();
            this.waveNumber++;
            this.difficulty++;
            this.player.health = this.player.healthMax;

            // Open the modal
            const modal = document.getElementById('modal');
            modal.style.display = 'block';

            this.isGameRunning = false;
            this.setupModal();

            // Close the modal when the user clicks on the button
            const nextWaveButton = document.getElementById('nextWave');
            nextWaveButton.onclick = () => {
                
                document.getElementById('itemButton1').style.display = 'block';
                document.getElementById('itemButton2').style.display = 'block';
                document.getElementById('itemButton3').style.display = 'block';


                this.player.money = Math.floor(this.player.money);
                modal.style.display = 'none';
                this.isGameRunning = true;


                // Reset or reinitialize game state for new wave
                this.enemies = [];  // Clear existing enemies
                this.projectiles = [];  // Clear existing projectiles
                this.time = this.waveNumber * TIME_MUL;  // Reset timer based on wave number
                this.levelBeforeWave = this.levelCurrent;
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
        if (!this.enemiesConfig) return;
    
        if(this.enemyCooldown > 0){
            this.enemyCooldown--;
            return;
        }
        
        for (const enemyConfig of this.enemiesConfig.enemies) {
            if (this.waveNumber >= enemyConfig.wave) {
                const spawnRate = this.getSpawnRateForWave(enemyConfig.spawnRate);
                if (Math.random() < spawnRate) {
                    let enemy;
                    switch (enemyConfig.name) {
                        case 'Blob_Fish':
                            enemy = new Blob_Fish(this.canvas);
                            this.enemyCooldown = 50 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Squid':
                            enemy = new Squid(this.canvas);
                            this.enemyCooldown = 100 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Axolotl':
                            enemy = new Axolotl(this.canvas);
                            this.enemyCooldown = 150 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Duck':
                            enemy = new Duck(this.canvas);
                            this.enemyCooldown = 160 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Neon':
                            enemy = new Neon(this.canvas);
                            this.enemyCooldown = 150 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Serpang':
                            enemy = new Serpang(this.canvas);
                            this.enemyCooldown = 180 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Sea_Angler':
                            enemy = new Sea_Angler(this.canvas);
                            this.enemyCooldown = 150 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Shark':
                            enemy = new Shark(this.canvas);
                            this.enemyCooldown = 200 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Sword_Fish':
                            enemy = new Sword_Fish(this.canvas);
                            this.enemyCooldown = 200 * COOLDOWN_ENEMY_BASE;
                            break;                        
                        case 'Saw_Shark':
                            enemy = new Saw_Shark(this.canvas);
                            this.enemyCooldown = 200 * COOLDOWN_ENEMY_BASE;
                            break;
                        case 'Wailord':
                            enemy = new Wailord(this.canvas);
                            this.enemyCooldown = 300 * COOLDOWN_ENEMY_BASE;
                            break;
                        default:
                            continue;
                    }
                    this.enemies.push(enemy);
                }
            }
        }
    }

    getSpawnRateForWave(spawnRateConfig) {
        for (const [waveRange, rate] of Object.entries(spawnRateConfig)) {
            const [startWave, endWave] = waveRange.split('-').map(Number);
            if (this.waveNumber >= startWave && this.waveNumber <= endWave) {
                return rate;
            }
        }
        return 0;
    }

    checkCollisions() {
        this.enemies.forEach((enemy, eIndex) => {
            if (this.isColliding(this.player, enemy)) {
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

    findClosestEnemy() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        this.enemies.forEach(enemy => {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        return closestEnemy;
    }
}

class PlayerBubble {

    constructor(x, y, game) {
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
        this.healthMax = HEALTH_BASE;
        this.health = HEALTH_BASE;
        this.expNow = 0;
        this.expMax = EXP_BASE;
        this.money = MONEY_BASE;
        this.projectileCooldown = 0;
        this.game = game;
        this.weapons = [];
        this.CooldownBooster = 1;
        this.MultiExp = 1;
    }

    update(canvas) {
        this.handleMovement(canvas);
        this.projectileCooldown = Math.max(0, this.projectileCooldown - 1);

        if(this.projectileCooldown === 0){
            this.shootProjectile();
        }
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
        const healthWidth = (this.health / this.healthMax) * barWidth;
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
            const closestEnemy = this.game.findClosestEnemy();
            if (closestEnemy) {
                const dx = closestEnemy.x - this.x;
                const dy = closestEnemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const direction = {
                    x: dx / distance,
                    y: dy / distance
                };
                const projectile = new Projectile(this.x, this.y, direction, SPEED_PROJECTILE_BASE, (DAMAGE_BASE * (1 + this.weapons.reduce((a, b) => a + b, 0) / 100)));
                this.game.projectiles.push(projectile);
                this.projectileCooldown = COOLDOWN_PROJECTILE_BASE * this.CooldownBooster;
                console.log(`Cooldown: ${this.projectileCooldown}`);
            }
        }
    }
}

class Projectile {
    constructor(x, y, direction, speed, damage) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = speed;
        this.direction = direction;
        this.damage = damage;
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
        if(this.damage > 0 && this.damage <= 15){
            ctx.fillStyle = 'darkred';
        }else if(this.damage > 15 && this.damage <= 30){
            ctx.fillStyle = 'red';
        }else if(this.damage > 30 && this.damage <= 45){
            ctx.fillStyle = 'orange';
        }else if(this.damage > 45 && this.damage <= 60){
            ctx.fillStyle = 'yellow';
        }else if(this.damage > 60 && this.damage <= 90){
            ctx.fillStyle = 'white';
        }else if(this.damage > 90){
            ctx.fillStyle = 'blue';
        }
        ctx.fill();
    }

    getSpeed() {
        return this.speed;
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
    game = new BubbleSurvivorsGame(canvas, WAVE, 0, 1);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') game.player.shootProjectile();
    });
}

function sleep(ms){
    const start = new Date().getTime();
    while(new Date().getTime() < start + ms);
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