// components/headerr.js
import React from "react";
import { Globe, Activity, TrendingUp, Clock, Map, List } from "lucide-react";

const Headerr = ({
  stats,
  isRefreshing,
  earthquakes,
  selectedMagnitude,
  setSelectedMagnitude,
  viewMode,
  setViewMode,
}) => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="bg-white/20 p-3 rounded-full shadow-md">
              <Globe className="h-7 w-7 text-white" />
            </div>
            {isRefreshing && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">
              Earthquake Visualizer
            </h1>
            <p className="text-sm text-white/80">
              Real-time seismic activity monitoring
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 rounded-2xl p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-emerald-300" />
              <div>
                <p className="text-xs text-white/70">Total Events</p>
                <p className="font-bold text-xl">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-red-300" />
              <div>
                <p className="text-xs text-white/70">Max Magnitude</p>
                <p className="font-bold text-xl">{stats.maxMagnitude.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-300" />
              <div>
                <p className="text-xs text-white/70">Last 6 Hours</p>
                <p className="font-bold text-xl">{stats.recent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Magnitude:</label>
            <select
              value={selectedMagnitude}
              onChange={(e) => setSelectedMagnitude(e.target.value)}
              className="bg-white/20 text-white rounded-lg px-4 py-2 text-sm font-medium border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              <option value="all">All ({earthquakes.length})</option>
              <option value="minor">Minor (&lt; 3.0)</option>
              <option value="light">Light (3.0 - 4.9)</option>
              <option value="moderate">Moderate (5.0 - 5.9)</option>
              <option value="strong">Strong (6.0+)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/20 transition`}
            >
              <Map className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/30' : 'bg-white/10'} hover:bg-white/20 transition`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span>Minor</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span>Light</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Strong</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headerr;