🌍 Earthquake Visualizer

An interactive web app to visualize recent earthquake activity worldwide using the USGS Earthquake API
.

Built with React, Tailwind CSS, and react-leaflet, this app helps geography students (like Casey in our persona) understand seismic activity patterns on a live, interactive map.

🚀 Features

Fetches real-time earthquake data from the USGS API (last 24 hours).

Displays earthquakes on an interactive map using Leaflet.

Markers sized or colored based on magnitude.

Clickable markers show details: location, magnitude, time.

Responsive design (works on desktop & mobile).

Handles errors gracefully (e.g., network issues).

🛠️ Tech Stack

Framework: React

Styling: Tailwind CSS

Mapping: Leaflet via react-leaflet

Data Source: USGS Earthquake API (GeoJSON)

Hosting: CodeSandbox
 / StackBlitz

📦 Installation & Setup

Clone the repo and run locally:

# Clone the repository
git clone https://github.com/your-username/earthquake-visualizer.git
cd earthquake-visualizer

# Install dependencies
npm install

# Run the development server
npm start


The app will be available at http://localhost:3000/.

📊 API Reference

We use the USGS Earthquake GeoJSON feed:

https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson


It provides earthquake data for the last 24 hours, including magnitude, coordinates, and timestamps.

🤖 Working with AI (Level 1 Requirement)

This project was developed with the assistance of ChatGPT (OpenAI GPT-5).

ChatGPT was used to plan the project architecture, suggest best practices for React + Leaflet integration, and draft the README.

Example conversation link: ChatGPT Session

AI guidance covered:

Choosing the right stack (React + Tailwind + react-leaflet).

Structuring data fetching from the USGS API.

Handling state and errors.

Writing clean documentation.

Even where full code wasn’t generated directly, AI support provided clarity and speed in approaching the problem.


🤝 Contributing

Contributions are welcome! Feel free to fork this repo, create a branch, and submit a pull request.

📄 License

This project is open source under the MIT License
.
