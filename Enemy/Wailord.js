import { Enemy } from './Enemy.js';

const SCALE_FACTOR = 5;

export class Wailord extends Enemy {
    constructor(canvas){
        super(canvas, 15, 0.5, 100, 25, 500); // Call super constructor first
        if(super.getShiny()){
            super.setExp(20);
            super.setDamage(10);
            super.setLife(30);
        }
        this.images = [];
        this.loadSprite();
        this.frameIndex = 0; // Index of the current frame
        this.frameWidth = 100; // Width of each frame
        this.frameHeight = 80; // Height of each frame
        this.frameCounter = 0; // Counter to control frame rate
        this.framesPerSprite = 5; // Number of game frames per sprite frame
    }

    loadSprite() {
        const numFrames = 111;
        for (let i = 0; i < numFrames; i++) {
            const img = new Image();
            img.src = super.getShiny() ? `assets/sprites/wailord/wailord_shiny/${i}.png` : `assets/sprites/wailord/wailord/${i}.png`;
            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
            };
            this.images.push(img);
        }
    }

    update(playerX, playerY) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;

        // Update frame index for animation
        this.frameCounter++;
        if (this.frameCounter >= this.framesPerSprite) {
            this.frameCounter = 0;
            this.frameIndex = (this.frameIndex + 1) % this.images.length;
        }
    }

    render(ctx) {
        const image = this.images[this.frameIndex];
        if (image.complete && image.naturalWidth !== 0) {
            // Define the source rectangle (sx, sy, sWidth, sHeight)
            const sx = 0;
            const sy = 0;
            const sWidth = this.frameWidth;
            const sHeight = this.frameHeight;

            // Define the destination rectangle (dx, dy, dWidth, dHeight)
            const dx = this.x - this.radius;
            const dy = this.y - this.radius;
            const dWidth = this.radius * 2 * SCALE_FACTOR;
            const dHeight = this.radius * 2 * SCALE_FACTOR;

            ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        } else {
            image.onload = () => {
                const sx = 0;
                const sy = 0;
                const sWidth = this.frameWidth;
                const sHeight = this.frameHeight;
                const dx = this.x - this.radius;
                const dy = this.y - this.radius;
                const dWidth = this.radius * 2 * SCALE_FACTOR;
                const dHeight = this.radius * 2 * SCALE_FACTOR;

                ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            };
        }
    }
}