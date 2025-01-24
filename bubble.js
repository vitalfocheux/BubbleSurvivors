document.addEventListener('DOMContentLoaded', (e) => {
    const canvas = document.getElementById('bubbleCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Bubble {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 100;
            this.radius = 30 + Math.random() * 50;
            this.speedY = 1 + Math.random() * 3;
            this.speedX = (Math.random() - 0.5) * 2;
            this.opacity = 0.7 + Math.random() * 0.3;
            this.wobble = {
                x: Math.random() * Math.PI * 2,
                amplitude: Math.random() * 2,
                frequency: 0.05 + Math.random() * 0.1
            };
        }

        draw() {
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
            // ctx.setLineDash([this.radius * 0.1, this.radius * 0.1]); // Effet de membrane ondulée
            ctx.stroke();
        
            // Effet de profondeur avec une légère ombre
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.95, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,0,0,${this.opacity * 0.1})`;
            ctx.lineWidth = this.radius * 0.1;
            ctx.stroke();
        
            ctx.restore(); // Restaurer le contexte du canvas
        }

        update() {
            // Wobble effect
            this.wobble.x += this.wobble.frequency;
            this.x += Math.sin(this.wobble.x) * this.wobble.amplitude;
            
            // Movement
            this.y -= this.speedY;
            this.x += this.speedX;
            
            // Slight horizontal drift
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
        }

        isPopped(clickX, clickY) {
            return Math.hypot(clickX - this.x, clickY - this.y) < this.radius;
        }
    }

    let bubbles = [];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn bubbles
        if (bubbles.length < 6 && Math.random() < 0.05) {
            bubbles.push(new Bubble());
        }

        // Update and draw bubbles
        bubbles = bubbles.filter(bubble => {
            bubble.update();
            bubble.draw();
            return bubble.y + bubble.radius > 0;
        });

        requestAnimationFrame(animate);
    }

    // Popping mechanism
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        bubbles = bubbles.filter(bubble => !bubble.isPopped(clickX, clickY));
    });

    // Resize handling
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    animate();
});