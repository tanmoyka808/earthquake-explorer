import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [timeframe, setTimeframe] = useState("all_day");
  const [minMag, setMinMag] = useState(0);

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timeframe}.geojson`;
    const res = await fetch(url);
    const data = await res.json();
    setEarthquakes(data.features);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* Controls */}
      <div
        style={{
          padding: "10px",
          background: "white",
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        }}
      >
        <label>
          Timeframe:{" "}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="all_hour">Past Hour</option>
            <option value="all_day">Past Day</option>
            <option value="all_week">Past Week</option>
          </select>
        </label>
        <br />
        <label>
          Min Magnitude:{" "}
          <input
            type="number"
            value={minMag}
            step="0.1"
            onChange={(e) => setMinMag(parseFloat(e.target.value))}
          />
        </label>
        <br />
        <button onClick={fetchData}>Update</button>
      </div>

      {/* Map */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      > <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
    
        {earthquakes
          .filter((f) => f.properties.mag >= minMag)
          .map((eq) => {
            const [lon, lat, depth] = eq.geometry.coordinates;
            const mag = eq.properties.mag;
            const color = depth > 100 ? "red" : depth > 50 ? "orange" : "green";

            return (
              <CircleMarker
                key={eq.id}
                center={[lat, lon]}
                radius={mag * 2}
                pathOptions={{
                  fillColor: color,
                  color: "#000",
                  weight: 1,
                  fillOpacity: 0.7
                }}
              >
                <Popup>
                  <b>{eq.properties.place}</b>
                  <br />
                  Magnitude: {mag}
                  <br />
                  Depth: {depth} km
                  <br />
                  Time: {new Date(eq.properties.time).toLocaleString()}
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
