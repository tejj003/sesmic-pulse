/**
 * Particle class for creating visual effects
 */
class Particle {
    /**
     * Create a new particle
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} magnitude - Earthquake magnitude
     */
    constructor(x, y, magnitude) {
        this.x = x;
        this.y = y;
        this.magnitude = magnitude;
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = getMagnitudeColor(magnitude);
    }

    /**
     * Update particle position and properties
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.995;
    }

    /**
     * Draw particle on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
