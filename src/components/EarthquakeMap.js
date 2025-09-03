// components/EarthquakeMap.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, Clock, Waves } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to fit map bounds to earthquake data
function FitBounds({ earthquakes }) {
  const map = useMap();
  
  useEffect(() => {
    if (earthquakes.length > 0) {
      const bounds = earthquakes.map(eq => [
        eq.geometry.coordinates[1], // lat
        eq.geometry.coordinates[0]  // lng
      ]);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [earthquakes, map]);
  
  return null;
}

const EarthquakeMap = ({ earthquakes, loading }) => {
  // Get marker color based on magnitude
  const getMarkerColor = (magnitude) => {
    if (magnitude >= 6) return '#ef4444'; // Red - Strong
    if (magnitude >= 5) return '#f97316'; // Orange - Moderate
    if (magnitude >= 3) return '#eab308'; // Yellow - Light
    return '#22c55e'; // Green - Minor
  };

  // Get marker size based on magnitude
  const getMarkerSize = (magnitude) => {
    return Math.max(4, Math.min(20, magnitude * 3));
  };

  // Format time for display
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get relative time
  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  if (loading) {
    return (
      <div className="relative flex-1 flex items-center justify-center" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-6"></div>
            <Waves className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Loading Seismic Data
            </h2>
            <p className="text-slate-400">Fetching real-time earthquake information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1" style={{ height: 'calc(100vh - 220px)' }}>
      {earthquakes.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="bg-slate-700/30 p-6 rounded-full inline-block mb-4">
              <MapPin className="h-16 w-16 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-300">No Earthquakes Found</h3>
            <p className="text-slate-400">Try adjusting your magnitude filter to see more results</p>
          </div>
        </div>
      ) : (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="z-0 rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <FitBounds earthquakes={earthquakes} />
          
          {earthquakes.map((earthquake) => {
            const [lng, lat, depth] = earthquake.geometry.coordinates;
            const { mag, place, time, url } = earthquake.properties;
            
            return (
              <CircleMarker
                key={earthquake.id}
                center={[lat, lng]}
                radius={getMarkerSize(mag)}
                color="rgba(255, 255, 255, 0.8)"
                weight={2}
                fillColor={getMarkerColor(mag)}
                fillOpacity={0.8}
                className="animate-pulse"
              >
                <Popup className="earthquake-popup">
                  <div className="p-4 min-w-72 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: getMarkerColor(mag) }}
                      ></div>
                      <h3 className="font-bold text-xl text-white">
                        Magnitude {mag ? mag.toFixed(1) : 'N/A'}
                      </h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-slate-400">Location:</span>
                          <p className="text-white font-medium">{place || 'Unknown Location'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <div>
                          <span className="text-slate-400">Time:</span>
                          <p className="text-white font-medium">{formatTime(time)}</p>
                          <p className="text-xs text-slate-500">{getRelativeTime(time)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <span className="text-slate-400 text-xs">Depth</span>
                          <p className="text-white font-medium">{depth ? `${depth.toFixed(1)} km` : 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Coordinates</span>
                          <p className="text-white font-medium text-xs">{lat.toFixed(3)}, {lng.toFixed(3)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors duration-200"
                      >
                        View USGS Details
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default EarthquakeMap;