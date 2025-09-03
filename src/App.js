// App.js (updated with map loading fixes)
import React, { useState, useEffect } from 'react';
import Header from './components/headerr';  // Note: your file is headerr.js with double 'r'
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeCard from './components/EarthquakeCard';  // New import
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMagnitude, setSelectedMagnitude] = useState('all');
  const [stats, setStats] = useState({ total: 0, maxMagnitude: 0, recent: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('map');  // New state: 'map' or 'list'

  // Fetch earthquake data from USGS API
  const fetchEarthquakes = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      if (!showRefresh) setLoading(true);
      
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEarthquakes(data.features);
      
      // Calculate statistics
      const total = data.features.length;
      const maxMag = Math.max(...data.features.map(eq => eq.properties.mag || 0));
      const recent = data.features.filter(eq => {
        const now = Date.now();
        const eqTime = eq.properties.time;
        return (now - eqTime) < (6 * 60 * 60 * 1000); // Last 6 hours
      }).length;
      
      setStats({ total, maxMagnitude: maxMag, recent });
      setError(null);
    } catch (err) {
      setError(`Failed to fetch earthquake data: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
    
    // Refresh data every 5 minutes
    const interval = setInterval(() => fetchEarthquakes(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter earthquakes based on selected magnitude
  const filteredEarthquakes = earthquakes.filter(earthquake => {
    const mag = earthquake.properties.mag || 0;
    switch (selectedMagnitude) {
      case 'minor': return mag < 3;
      case 'light': return mag >= 3 && mag < 5;
      case 'moderate': return mag >= 5 && mag < 6;
      case 'strong': return mag >= 6;
      default: return true;
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="bg-red-500/10 p-4 rounded-full inline-block">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Connection Error
          </h2>
          <p className="text-slate-300 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => fetchEarthquakes()} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"> {/* Added flex flex-col */}
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header 
        stats={stats}
        isRefreshing={isRefreshing}
        earthquakes={earthquakes}
        selectedMagnitude={selectedMagnitude}
        setSelectedMagnitude={setSelectedMagnitude}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="flex-1"> {/* Added wrapper for flex-1 content */}
        {viewMode === 'map' ? (
          <EarthquakeMap 
            earthquakes={filteredEarthquakes}
            loading={loading}
            isRefreshing={isRefreshing}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
            {filteredEarthquakes.length === 0 ? (
              <p className="text-center col-span-full text-slate-400">No earthquakes match your filter.</p>
            ) : (
              filteredEarthquakes.map((eq) => (
                <EarthquakeCard key={eq.id} earthquake={eq} />
              ))
            )}
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative backdrop-blur-md bg-slate-800/80 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <span>•</span>
              <span>USGS Earthquake Hazards Program</span>
              <span>•</span>
              <span>Last 24 hours</span>
            </div>
            <div className="text-slate-500 text-xs">
              {isRefreshing ? 'Updating...' : 'Updates every 5 minutes'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}