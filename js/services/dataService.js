/**
 * Data service for fetching and processing earthquake data
 */
class DataService {
    constructor() {
        this.earthquakes = [];
        this.isLoading = false;
        this.loadingElement = document.getElementById('loading');
    }

    /**
     * Fetch earthquake data from USGS API
     * @returns {Promise<Array>} - Array of earthquake data
     */
    async fetchEarthquakeData() {
        this.isLoading = true;
        this.loadingElement.style.display = 'block';
        
        try {
            // Try to fetch live data with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                throw new Error('No earthquake data available');
            }
            
            this.earthquakes = data.features.map(this._processEarthquakeFeature);

            // Sort by time (newest first)
            this.earthquakes.sort((a, b) => b.time - a.time);
            
            console.log(`Loaded ${this.earthquakes.length} earthquakes from live data`);
            updateStatistics(this.earthquakes);
            
            this.isLoading = false;
            this.loadingElement.style.display = 'none';
            
            return this.earthquakes;
            
        } catch (error) {
            console.error('Error fetching earthquake data:', error);
            return await this._tryAlternativeSource(error);
        }
    }
    
    /**
     * Try alternative data sources if primary source fails
     * @param {Error} error - The error from primary source
     * @returns {Promise<Array>} - Array of earthquake data
     */
    async _tryAlternativeSource(error) {
        try {
            const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson');
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                this.earthquakes = data.features.map(this._processEarthquakeFeature);
                
                this.earthquakes.sort((a, b) => b.time - a.time);
                console.log(`Loaded ${this.earthquakes.length} significant earthquakes (4.5+) from live data`);
                updateStatistics(this.earthquakes);
                
                this.isLoading = false;
                this.loadingElement.style.display = 'none';
                
                return this.earthquakes;
            } else {
                throw new Error('No data from alternative endpoint');
            }
        } catch (altError) {
            console.error('Alternative API also failed:', altError);
            // Only use demo data as last resort
            return this._generateDemoData();
        }
    }
    
    /**
     * Process a feature from the USGS GeoJSON
     * @param {Object} feature - GeoJSON feature
     * @returns {Object} - Processed earthquake object
     */
    _processEarthquakeFeature(feature) {
        return {
            magnitude: feature.properties.mag || 0,
            location: feature.properties.place || 'Unknown',
            time: new Date(feature.properties.time),
            coordinates: feature.geometry.coordinates,
            depth: feature.geometry.coordinates[2] || 0,
            type: feature.properties.type,
            status: feature.properties.status,
            tsunami: feature.properties.tsunami,
            sig: feature.properties.sig // significance
        };
    }
    
    /**
     * Generate demo data when APIs fail
     * @returns {Array} - Array of demo earthquake data
     */
    _generateDemoData() {
        console.warn('Using demo data due to API failure');
        const demoLocations = [
            'San Francisco Bay area, California',
            'Tokyo, Japan',
            'Ring of Fire, Pacific Ocean',
            'Chile Coast',
            'Indonesia',
            'Alaska Peninsula',
            'Mediterranean Sea',
            'New Zealand'
        ];
        
        this.earthquakes = [];
        
        for (let i = 0; i < 30; i++) {
            this.earthquakes.push({
                magnitude: Math.random() * 5 + 2, // 2.0 to 7.0
                location: demoLocations[Math.floor(Math.random() * demoLocations.length)],
                time: new Date(Date.now() - Math.random() * 86400000),
                coordinates: [
                    (Math.random() - 0.5) * 360,
                    (Math.random() - 0.5) * 180,
                    Math.random() * 100
                ],
                depth: Math.random() * 100,
                type: 'earthquake',
                status: 'demo',
                tsunami: 0,
                sig: Math.random() * 1000
            });
        }
        
        updateStatistics(this.earthquakes);
        showNotification('Using demo data - Live API unavailable', 'warning');
        
        this.isLoading = false;
        this.loadingElement.style.display = 'none';
        
        return this.earthquakes;
    }
    
    /**
     * Get the current earthquake data
     * @returns {Array} - Array of earthquake data
     */
    getEarthquakes() {
        return this.earthquakes;
    }
}
