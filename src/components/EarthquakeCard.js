// src/components/EarthquakeCard.js
import React from 'react';
import { MapPin, Clock, Waves } from 'lucide-react';

const EarthquakeCard = ({ earthquake }) => {
  const { mag, place, time, url } = earthquake.properties;
  const [lng, lat, depth] = earthquake.geometry.coordinates;

  // Reuse your existing helper functions
  const getMarkerColor = (magnitude) => {
    if (magnitude >= 6) return 'bg-red-500';
    if (magnitude >= 5) return 'bg-orange-500';
    if (magnitude >= 3) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-4 h-4 rounded-full shadow-sm ${getMarkerColor(mag)}`}></div>
        <h3 className="font-bold text-lg text-white">
          Magnitude {mag ? mag.toFixed(1) : 'N/A'}
        </h3>
      </div>
      <div className="space-y-2 text-sm text-slate-300">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-slate-400">Location:</span>
            <p className="text-white font-medium">{place || 'Unknown'}</p>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 text-xs">Depth:</span>
            <p className="text-white font-medium">{depth ? `${depth.toFixed(1)} km` : 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs">Coords:</span>
            <p className="text-white font-medium text-xs">{lat.toFixed(3)}, {lng.toFixed(3)}</p>
          </div>
        </div>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm font-medium transition-colors duration-200 w-full justify-center"
        >
          View Details
          <Waves className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};

export default EarthquakeCard;