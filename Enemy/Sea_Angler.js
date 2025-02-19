import { Enemy } from './Enemy.js';

export class Sea_Angler extends Enemy {
    constructor(canvas){
        super(canvas, 15, 0.9, 20, 12, 25); // Call super constructor first
        if(super.getShiny()){
            super.setExp(14);
            super.setDamage(6);
            super.setLife(20);
        }
        this.images = [];
        this.loadSquidSprite();
        this.frameIndex = 0; // Index of the current frame
        this.frameWidth = 32; // Width of each frame
        this.frameHeight = 32; // Height of each frame
        this.frameCounter = 0; // Counter to control frame rate
        this.framesPerSprite = 16; // Number of game frames per sprite frame
    }

    loadSquidSprite() {
        const numFrames = 16;
        for (let i = 0; i < numFrames; i++) {
            const img = new Image();
            img.src = `assets/sprites/sea_angler/sea_angler_${i}.png`;
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
            const scaleFactor = 2; // Scale factor to enlarge the image
            const dWidth = this.radius * 2 * scaleFactor;
            const dHeight = this.radius * 2 * scaleFactor;

            ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        } else {
            image.onload = () => {
                const sx = 0;
                const sy = 0;
                const sWidth = this.frameWidth;
                const sHeight = this.frameHeight;
                const dx = this.x - this.radius;
                const dy = this.y - this.radius;
                const scaleFactor = 2; // Scale factor to enlarge the image
                const dWidth = this.radius * 2 * scaleFactor;
                const dHeight = this.radius * 2 * scaleFactor;

                ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            };
        }
    }
}