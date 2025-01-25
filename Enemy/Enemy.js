export class Enemy{
    constructor(canvas, radius, speed) {
        if(new.target === Enemy){
            throw new TypeError("Cannot construct Enemy instances directly");
        }
        this.canvas = canvas;
        this.radius = radius;
        this.speed = speed;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.exp = 0;
    }

    update(playerX, playerY) {
        throw new Error("Method 'update()' must be implemented.");
    }

    render(ctx) {
        throw new Error("Method 'render()' must be implemented.");
    }

    getExp() {
        return this.exp;
    }
}