/**
 * Artistic visualization mode
 */
class ArtisticMode {
    /**
     * Initialize artistic visualization
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.time = 0;
        this.hoveredEarthquake = null;
    }
    
    /**
     * Draw the artistic visualization
     * @param {Array} earthquakes - Array of earthquake data
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     */
    draw(earthquakes, mouseX, mouseY) {
        // Increment time for animations
        this.time++;
        
        // Get dimensions accounting for device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        const actualWidth = this.canvas.width / dpr;
        const actualHeight = this.canvas.height / dpr;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, actualWidth, actualHeight);
        this.ctx.fillStyle = '#0c0c0c';
        this.ctx.fillRect(0, 0, actualWidth, actualHeight);
        
        // Center point
        const centerX = actualWidth / 2;
        const centerY = actualHeight / 2;
        
        // Reset hovered earthquake
        this.hoveredEarthquake = null;
        
        // Draw background grid
        this._drawGrid(actualWidth, actualHeight);
        
        // Draw central glow
        this._drawCentralGlow(centerX, centerY, actualWidth, actualHeight);
        
        // Draw earthquakes
        this._drawEarthquakes(earthquakes, centerX, centerY, actualWidth, actualHeight, mouseX, mouseY);
        
        // Draw particles
        this._drawParticles();
        
        // Draw tooltip if hovering over earthquake
        if (this.hoveredEarthquake) {
            this._drawTooltip(actualWidth);
        }
        
        // Set cursor style
        this.canvas.style.cursor = this.hoveredEarthquake ? 'pointer' : 'default';
        
        // Limit particles for performance
        if (this.particles.length > 80) {
            this.particles.splice(0, this.particles.length - 80);
        }
    }
    
    /**
     * Draw background grid
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    _drawGrid(width, height) {
        this.ctx.strokeStyle = 'rgba(50, 70, 100, 0.15)';
        this.ctx.lineWidth = 0.5;
        const gridSize = 50;
        
        for (let x = 0; x < width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw central glow effect
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    _drawCentralGlow(centerX, centerY, width, height) {
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0, 
            centerX, centerY, Math.min(width, height) * 0.4
        );
        gradient.addColorStop(0, 'rgba(30, 60, 100, 0.2)');
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
    }
    
    /**
     * Draw earthquakes and connecting lines
     * @param {Array} earthquakes - Array of earthquake data
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     */
    _drawEarthquakes(earthquakes, centerX, centerY, width, height, mouseX, mouseY) {
        // Calculate positions for all earthquakes
        const positions = earthquakes.map((eq, index) => {
            const angle = (this.time * 0.0008 + index * 0.2) % (Math.PI * 2);
            const radius = Math.min(width, height) * 0.25 + eq.magnitude * 8;
            return {
                eq,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                angle,
                radius
            };
        });
        
        // Draw connecting lines first (for proper layering)
        this._drawConnectingLines(positions);
        
        // Draw earthquake points and check for hover
        positions.forEach(pos => {
            const size = pos.eq.magnitude * 2 + 3;
            
            // Check if mouse is hovering
            const distance = Math.sqrt(Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2));
            const isHovered = distance < size * 2;
            
            if (isHovered) {
                this.hoveredEarthquake = pos;
            }
            
            // Draw earthquake circle
            this._drawEarthquakeCircle(pos, size, isHovered);
            
            // Add particles occasionally
            if (Math.random() < 0.02 * (pos.eq.magnitude / 5)) {
                this.particles.push(new Particle(pos.x, pos.y, pos.eq.magnitude));
            }
        });
    }
    
    /**
     * Draw connecting lines between earthquakes
     * @param {Array} positions - Array of earthquake positions
     */
    _drawConnectingLines(positions) {
        this.ctx.strokeStyle = 'rgba(100, 180, 220, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < positions.length - 1; i++) {
            const current = positions[i];
            const next = positions[i + 1];
            
            this.ctx.beginPath();
            this.ctx.moveTo(current.x, current.y);
            this.ctx.lineTo(next.x, next.y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw a single earthquake circle
     * @param {Object} pos - Earthquake position data
     * @param {number} size - Circle size
     * @param {boolean} isHovered - Whether the earthquake is being hovered
     */
    _drawEarthquakeCircle(pos, size, isHovered) {
        const color = getMagnitudeColor(pos.eq.magnitude);
        
        // Draw outer glow
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, size * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw main circle
        this.ctx.globalAlpha = isHovered ? 1 : 0.9;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, isHovered ? size * 1.3 : size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw highlight
        this.ctx.fillStyle = 'white';
        this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reset alpha
        this.ctx.globalAlpha = 1;
    }
    
    /**
     * Draw all particles
     */
    _drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);
            
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * Draw tooltip for hovered earthquake
     * @param {number} width - Canvas width
     */
    _drawTooltip(width) {
        const { eq, x, y } = this.hoveredEarthquake;
        
        // Tooltip dimensions
        const tooltipWidth = 180;
        const tooltipHeight = 90;
        
        // Position above dot
        let tooltipX = x - tooltipWidth / 2;
        let tooltipY = y - tooltipHeight - 10;
        
        // Adjust if needed
        if (tooltipY < 10) tooltipY = y + 10;
        if (tooltipX < 10) tooltipX = 10;
        if (tooltipX + tooltipWidth > width - 10) {
            tooltipX = width - tooltipWidth - 10;
        }
        
        // Draw background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Draw border
        this.ctx.strokeStyle = getMagnitudeColor(eq.magnitude);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Simplify text content
        const shortLoc = eq.location.length > 20 ? eq.location.substring(0, 17) + "..." : eq.location;
        
        // Draw text
        this.ctx.font = "bold 14px Arial";
        this.ctx.fillStyle = getMagnitudeColor(eq.magnitude);
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Magnitude: ${eq.magnitude.toFixed(1)}`, tooltipX + 10, tooltipY + 20);
        
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText(`Location: ${shortLoc}`, tooltipX + 10, tooltipY + 40);
        this.ctx.fillText(`Depth: ${eq.depth.toFixed(1)} km`, tooltipX + 10, tooltipY + 60);
        this.ctx.fillText(eq.time.toLocaleDateString(), tooltipX + 10, tooltipY + 75);
        
        // Draw connecting line
        this.ctx.beginPath();
        this.ctx.strokeStyle = getMagnitudeColor(eq.magnitude);
        this.ctx.lineWidth = 1;
        
        if (tooltipY > y) {
            this.ctx.moveTo(x, y + 3);
            this.ctx.lineTo(x, tooltipY);
        } else {
            this.ctx.moveTo(x, y - 3);
            this.ctx.lineTo(x, tooltipY + tooltipHeight);
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Reset visualization state
     */
    reset() {
        this.particles = [];
        this.time = 0;
        this.hoveredEarthquake = null;
    }
}
