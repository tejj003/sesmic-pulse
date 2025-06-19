/**
 * Main application script
 */
(function() {
    // Canvas setup
    const canvas = document.getElementById('visualization');
    const ctx = canvas.getContext('2d');
    
    // App state
    let currentMode = 'artistic';
    let animationId = null;
    let mouseX = 0;
    let mouseY = 0;
    
    // Services and visualizations
    const dataService = new DataService();
    const artisticMode = new ArtisticMode(canvas, ctx);
    const geographicMode = new GeographicMode(canvas, ctx);
    
    /**
     * Set up the canvas with proper pixel ratio handling
     */
    function setupCanvas() {
        // Get device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        
        // Set display size (css pixels)
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        
        // Set actual size in memory (scaled up for retina displays)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        
        // Scale the canvas back down using CSS
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        
        // Scale the drawing context to ensure correct drawing operations
        ctx.scale(dpr, dpr);
        
        // Set better rendering quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }
    
    /**
     * Initialize the application
     */
    function init() {
        // Set up the canvas
        setupCanvas();
        
        // Handle window resize
        window.addEventListener('resize', setupCanvas);
        
        // Set up mouse move tracking
        canvas.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Set up mode switching
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setVisualizationMode(btn.dataset.mode);
            });
        });
        
        // Initial data fetch
        dataService.fetchEarthquakeData().then(() => {
            startAnimation();
        });
        
        // Auto-refresh data every 5 minutes
        setInterval(() => {
            dataService.fetchEarthquakeData();
        }, 300000);
    }
    
    /**
     * Start the animation loop
     */
    function startAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        animate();
    }
    
    /**
     * Animation loop
     */
    function animate() {
        // Get current data
        const earthquakes = dataService.getEarthquakes();
        
        // Draw the current visualization mode
        if (currentMode === 'artistic') {
            artisticMode.draw(earthquakes, mouseX, mouseY);
        } else if (currentMode === 'geographic') {
            geographicMode.draw(earthquakes, mouseX, mouseY);
        }
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    }
    
    /**
     * Set the current visualization mode
     * @param {string} mode - Mode identifier
     */
    function setVisualizationMode(mode) {
        if (mode !== currentMode) {
            // Update mode
            currentMode = mode;
            
            // Update active button
            document.querySelectorAll('.control-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
            
            // Reset visualizations
            artisticMode.reset();
            geographicMode.reset();
        }
    }
    
    // Initialize the application when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();
