/**
 * Global helper functions and utilities
 */

/**
 * Get color based on earthquake magnitude
 * @param {number} magnitude - Earthquake magnitude value
 * @returns {string} - Color code for the magnitude
 */
function getMagnitudeColor(magnitude) {
    if (magnitude < 2.5) return '#90EE90';
    if (magnitude < 4.5) return '#FFD700';
    if (magnitude < 6.0) return '#FFA500';
    if (magnitude < 7.0) return '#FF6347';
    return '#FF0000';
}

/**
 * Update the statistics panel with current earthquake data
 * @param {Array} earthquakes - Array of earthquake objects
 */
function updateStatistics(earthquakes) {
    const totalCount = earthquakes.length;
    const strongestMag = Math.max(...earthquakes.map(eq => eq.magnitude)).toFixed(1);
    const latestEq = [...earthquakes].sort((a, b) => b.time - a.time)[0];
    const latestLocation = latestEq ? latestEq.location : 'Unknown';
    
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('strongestMag').textContent = strongestMag;
    document.getElementById('latestLocation').textContent = latestLocation;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
}

/**
 * Show a temporary notification message
 * @param {string} message - Message to display
 * @param {string} type - Message type (e.g., 'warning', 'info')
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'warning' ? 'rgba(255, 100, 0, 0.8)' : 'rgba(0, 100, 255, 0.8)'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
}
