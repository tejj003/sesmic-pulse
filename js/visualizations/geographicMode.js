/**
 * Geographic visualization mode
 */
class GeographicMode {
    /**
     * Initialize geographic visualization
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.time = 0;
        this.hoveredEarthquake = null;
    }
    
    /**
     * Draw the geographic visualization
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
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        this.ctx.fillStyle = '#0c0c0c';
        this.ctx.fillRect(0, 0, actualWidth, actualHeight);
        
        // Calculate map dimensions and position
        const centerX = actualWidth / 2;
        const centerY = actualHeight / 2;
        const mapWidth = Math.min(actualWidth * 0.8, 800);
        const mapHeight = mapWidth * 0.5;
        
        // Reset hovered earthquake
        this.hoveredEarthquake = null;
        
        // Draw map components
        this._drawMapBackground(centerX, centerY, mapWidth, mapHeight);
        this._drawGridLines(centerX, centerY, mapWidth, mapHeight);
        this._drawEquatorAndMeridian(centerX, centerY, mapWidth, mapHeight);
        
        // Draw earthquake points
        this._drawEarthquakes(earthquakes, centerX, centerY, mapWidth, mapHeight, mouseX, mouseY);
        
        // Draw tooltip if hovering over earthquake
        if (this.hoveredEarthquake) {
            this._drawTooltip(actualWidth);
        }
        
        // Set cursor style
        this.canvas.style.cursor = this.hoveredEarthquake ? 'pointer' : 'default';
    }
    
    /**
     * Draw map background and border
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} width - Map width
     * @param {number} height - Map height
     */
    _drawMapBackground(centerX, centerY, width, height) {
        // Draw map border
        this.ctx.strokeStyle = 'rgba(140, 160, 200, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.rect(centerX - width/2, centerY - height/2, width, height);
        this.ctx.stroke();
        
        // Draw ocean fill
        this.ctx.fillStyle = 'rgba(20, 40, 80, 0.1)';
        this.ctx.fillRect(centerX - width/2, centerY - height/2, width, height);
    }
    
    /**
     * Draw grid lines
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} width - Map width
     * @param {number} height - Map height
     */
    _drawGridLines(centerX, centerY, width, height) {
        this.ctx.strokeStyle = 'rgba(100, 120, 180, 0.3)';
        this.ctx.lineWidth = 0.8;
        
        // Draw longitude lines
        for (let lon = -180; lon <= 180; lon += 30) {
            const x = centerX + (lon * width / 360);
            this.ctx.beginPath();
            this.ctx.moveTo(x, centerY - height/2);
            this.ctx.lineTo(x, centerY + height/2);
            this.ctx.stroke();
            
            // Add longitude labels
            if (lon !== 0) {
                this.ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${Math.abs(lon)}°${lon < 0 ? 'W' : 'E'}`, x, centerY + height/2 + 15);
            }
        }
        
        // Draw latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            const y = centerY + (lat * height / 180);
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - width/2, y);
            this.ctx.lineTo(centerX + width/2, y);
            this.ctx.stroke();
            
            // Add latitude labels
            if (lat !== 0) {
                this.ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'right';
                this.ctx.fillText(`${Math.abs(lat)}°${lat < 0 ? 'S' : 'N'}`, centerX - width/2 - 5, y + 4);
            }
        }
    }
    
    /**
     * Draw equator and prime meridian
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} width - Map width
     * @param {number} height - Map height
     */
    _drawEquatorAndMeridian(centerX, centerY, width, height) {
        this.ctx.strokeStyle = 'rgba(120, 180, 255, 0.8)';
        this.ctx.lineWidth = 1.5;
        
        // Equator
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - width/2, centerY);
        this.ctx.lineTo(centerX + width/2, centerY);
        this.ctx.stroke();
        
        // Prime meridian
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - height/2);
        this.ctx.lineTo(centerX, centerY + height/2);
        this.ctx.stroke();
        
        // Add labels
        this.ctx.fillStyle = 'rgba(180, 220, 255, 0.9)';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Equator', centerX + width/2 + 40, centerY + 4);
        this.ctx.fillText('Prime Meridian', centerX, centerY - height/2 - 10);
    }
    
    /**
     * Draw earthquake points
     * @param {Array} earthquakes - Array of earthquake data
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} width - Map width
     * @param {number} height - Map height
     * @param {number} mouseX - Mouse X coordinate
     * @param {number} mouseY - Mouse Y coordinate
     */
    _drawEarthquakes(earthquakes, centerX, centerY, width, height, mouseX, mouseY) {
        earthquakes.forEach(eq => {
            // Convert coordinates
            const longitude = eq.coordinates[0];
            const latitude = eq.coordinates[1];
            
            // Calculate position on map
            const x = centerX + (longitude * width / 360);
            const y = centerY - (latitude * height / 180); // Flip latitude
            
            // Check if point is within map bounds
            if (x >= centerX - width/2 && x <= centerX + width/2 && 
                y >= centerY - height/2 && y <= centerY + height/2) {
                
                const size = eq.magnitude * 2.5 + 2;
                
                // Check if mouse is hovering over this earthquake
                const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
                const isHovered = distance < size * 2;
                
                if (isHovered) {
                    this.hoveredEarthquake = { eq, x, y };
                }
                
                // Add pulsing effect
                const pulse = Math.sin(this.time * 0.02 + eq.magnitude) * 0.3 + 0.7;
                
                // Draw earthquake point
                this.ctx.save();
                
                // Outer glow
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * (isHovered ? 3 : 2));
                gradient.addColorStop(0, getMagnitudeColor(eq.magnitude));
                gradient.addColorStop(1, 'transparent');
                this.ctx.globalAlpha = (isHovered ? 0.6 : 0.4) * pulse;
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * (isHovered ? 3 : 2), 0, Math.PI * 2);
                this.ctx.fill();
                
                // Core
                this.ctx.globalAlpha = 0.9 * pulse;
                this.ctx.fillStyle = getMagnitudeColor(eq.magnitude);
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * (isHovered ? 1.5 : 1), 0, Math.PI * 2);
                this.ctx.fill();
                
                // Inner dot
                this.ctx.globalAlpha = 0.7;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        });
    }
    
    /**
     * Draw tooltip for hovered earthquake
     * @param {number} width - Canvas width
     */
    _drawTooltip(width) {
        const { eq, x, y } = this.hoveredEarthquake;
        
        // Tooltip dimensions
        const tooltipWidth = 200;
        const tooltipHeight = 100;
        const padding = 10;
        
        // Position above earthquake dot
        let tooltipX = x - tooltipWidth / 2;
        let tooltipY = y - tooltipHeight - 10;
        
        // Adjust if needed
        if (tooltipY < 10) {
            tooltipY = y + 10;
        }
        
        // Keep in bounds
        if (tooltipX < 10) tooltipX = 10;
        if (tooltipX + tooltipWidth > width - 10) {
            tooltipX = width - tooltipWidth - 10;
        }
        
        // Draw background
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        this.ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Draw border
        this.ctx.strokeStyle = getMagnitudeColor(eq.magnitude);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Prepare text content
        const shortLoc = eq.location.length > 25 ? eq.location.substring(0, 22) + "..." : eq.location;
        const shortDate = eq.time.toLocaleDateString();
        
        // Draw text
        this.ctx.font = "bold 14px Arial";
        this.ctx.fillStyle = getMagnitudeColor(eq.magnitude);
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Magnitude: ${eq.magnitude.toFixed(1)}`, tooltipX + padding, tooltipY + padding + 12);
        
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText(`Location: ${shortLoc}`, tooltipX + padding, tooltipY + padding + 35);
        this.ctx.fillText(`Depth: ${eq.depth.toFixed(1)} km`, tooltipX + padding, tooltipY + padding + 55);
        this.ctx.fillText(`Date: ${shortDate}`, tooltipX + padding, tooltipY + padding + 75);
        
        // Draw connecting line
        this.ctx.beginPath();
        this.ctx.strokeStyle = getMagnitudeColor(eq.magnitude);
        this.ctx.lineWidth = 1.5;
        
        if (tooltipY > y) {
            // Line from point to tooltip (tooltip is below)
            this.ctx.moveTo(x, y + 5);
            this.ctx.lineTo(x, tooltipY);
        } else {
            // Line from point to tooltip (tooltip is above)
            this.ctx.moveTo(x, y - 5);
            this.ctx.lineTo(x, tooltipY + tooltipHeight);
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Reset visualization state
     */
    reset() {
        this.time = 0;
        this.hoveredEarthquake = null;
    }
}
