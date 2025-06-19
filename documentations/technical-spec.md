# Seismic Pulse - Technical Specification

## Architecture Overview

Seismic Pulse is a client-side web application built with vanilla JavaScript that visualizes real-time earthquake data. The application follows a modular architecture pattern with clear separation of concerns.

## Directory Structure

```
seismic-pulse/
├── css/
│   └── styles.css              # All application styles
├── js/
│   ├── utils/
│   │   ├── helpers.js          # Utility functions 
│   │   └── canvasExtensions.js # Canvas prototype extensions
│   ├── models/
│   │   └── Particle.js         # Particle class for visual effects
│   ├── services/
│   │   └── dataService.js      # Data fetching and processing
│   ├── visualizations/
│   │   ├── artisticMode.js     # Artistic visualization mode
│   │   └── geographicMode.js   # Geographic visualization mode
│   └── app.js                  # Main application entry point
└── index.html                  # Main HTML file
```

## Technical Implementation Details

### Canvas Rendering

The application uses the HTML5 Canvas API for all visualizations. Key techniques include:

1. **High-DPI Support**:
   - Canvas dimensions are scaled by device pixel ratio for crisp rendering on Retina displays
   - Context scale is adjusted to maintain correct drawing proportions
   - Style dimensions maintain correct CSS layout

2. **Animation Loop**:
   - Uses `requestAnimationFrame` for smooth, performance-optimized animations
   - Properly cancels animation frames when switching modes to prevent memory leaks
   - Maintains a time counter for animation timing

3. **Custom Canvas Extensions**:
   - Implements `roundRect` method on the CanvasRenderingContext2D prototype for drawing rounded rectangles
   - This simplifies tooltip drawing with rounded corners

### Data Handling

1. **Data Fetching**:
   - Primary data source: USGS Earthquake API (`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`)
   - Implements timeout handling (10 seconds) to avoid hanging requests
   - Fallback mechanism to an alternative API endpoint for significant earthquakes (4.5+)
   - Final fallback to generated demo data if both API sources fail

2. **Data Processing**:
   - Normalizes earthquake data into a consistent format
   - Extracts relevant properties like magnitude, location, time, coordinates, and depth
   - Sorts earthquakes by time (newest first) for display priority

3. **Auto-refresh**:
   - Automatically refreshes data every 5 minutes to keep information current
   - Updates statistics panel with the latest information

### Visualization Modes

1. **Artistic Mode**:
   - **Layout**: Orbital arrangement of earthquakes around a central point
   - **Sizing**: Earthquake size based on magnitude (larger = stronger)
   - **Coloring**: Color-coded by magnitude severity
   - **Effects**:
     - Pulsing animations
     - Particle system for additional visual interest
     - Connecting lines between sequential earthquakes
     - Background grid for depth perception
     - Central glow for focal point

2. **Geographic Mode**:
   - **Mapping**: Proper longitude/latitude mapping to a flat map projection
   - **Grid**: Geographic grid with labeled longitude and latitude lines
   - **Features**: Highlighted equator and prime meridian
   - **Earthquakes**: Positioned at actual geographic coordinates
   - **Effects**:
     - Pulsing animation based on magnitude
     - Gradient glow proportional to magnitude
     - Highlighted indicators for hovered earthquakes

### User Interaction

1. **Hover Detection**:
   - Implements precise circular hit detection for earthquake points
   - Uses distance calculation between mouse coordinates and earthquake position
   - Shows detailed information in tooltips when hovering over earthquake points
   - Changes cursor style to indicate interactive elements

2. **Mode Switching**:
   - Uses data attributes to associate buttons with visualization modes
   - Properly resets visualization state when switching modes
   - Updates active button styling

3. **Tooltips**:
   - Dynamically positioned to avoid going off-screen
   - Displays magnitude, location, depth, and date information
   - Color-coded to match earthquake magnitude
   - Connected to earthquake point with a guide line

### Performance Optimization

1. **Particle System Management**:
   - Limits maximum particles to prevent performance degradation
   - Removes dead particles (life <= 0) each frame
   - Creates new particles probabilistically based on magnitude

2. **Rendering Optimizations**:
   - Sets appropriate globalAlpha values and restores context state
   - Uses simple shapes for background elements
   - Implements efficient drawing order to minimize state changes
   - Uses image smoothing for better visual quality

3. **Memory Management**:
   - Properly cleans up resources when switching modes
   - Reuses existing objects where possible
   - Avoids unnecessary object creation in animation loops

## Browser Compatibility

The application is designed to work in modern browsers with the following requirements:

- HTML5 Canvas support
- ES6 JavaScript features (Classes, Arrow Functions, etc.)
- CSS3 features (Flexbox, Gradients, Animations)

## Future Technical Enhancements

1. **Offline Support**:
   - Implement Service Workers for offline functionality
   - Cache earthquake data for offline viewing
   - Store application assets for offline access

2. **Performance**:
   - Implement WebGL rendering for improved performance with large datasets
   - Add level-of-detail rendering for different zoom levels
   - Optimize particle system using instanced rendering

3. **Data**:
   - Add support for historical earthquake data visualization
   - Implement client-side filtering by magnitude, region, time
   - Add additional data sources for earthquake related information

4. **Interaction**:
   - Add touch support for mobile devices
   - Implement zoom and pan functionality for the geographic view
   - Add timeline scrubbing for historical data visualization

5. **Visualization**:
   - Add 3D globe visualization mode using WebGL
   - Implement additional visualization modes (heatmap, timeline)
   - Add depth visualization in 3D space

## Technical Dependencies

The application intentionally has no external JavaScript dependencies, using only vanilla JavaScript, HTML5, and CSS3. This approach:

1. Minimizes load time and initial payload size
2. Removes potential security issues from third-party code
3. Eliminates dependency maintenance overhead
4. Provides maximum control over implementation details
5. Avoids version conflicts and compatibility issues

## Development Tools

The application can be developed with standard web development tools:

- Any modern code editor (VS Code recommended)
- Modern web browser with developer tools
- Local development server (not required but recommended)

## Performance Metrics

The application targets the following performance metrics:

1. **Initial Load**: < 500ms for all assets
2. **Animation Performance**: 60fps on modern desktop browsers
3. **Memory Usage**: < 100MB during normal operation
4. **Data Refresh**: < 1 second for processing new earthquake data
5. **Interaction Responsiveness**: < 16ms response time to user actions
