import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const Map = ({ data, height = 300 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const center = data.length > 0 ? [data[0].lat, data[0].lng] : [12.9716, 77.5946];

    // Initialize map once
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(center, 10);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers layer group if any
    if (map._markersLayer) {
      map.removeLayer(map._markersLayer);
    }

    const markersLayer = L.layerGroup();
    data.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: createCustomIcon(location.verified ? '#4CAF50' : '#f44336')
      });
      marker.bindPopup(
        `<div class="map-popup">
          <h4>${location.title}</h4>
          <p><strong>Type:</strong> ${location.type}</p>
          <p><strong>Status:</strong> <span class="${location.verified ? 'status-verified' : 'status-pending'}">${location.verified ? 'Verified' : 'Pending'}</span></p>
          <p><strong>Date:</strong> ${location.date}</p>
          <p><strong>Credits:</strong> ${location.credits}</p>
        </div>`
      );
      markersLayer.addLayer(marker);
    });

    markersLayer.addTo(map);
    map._markersLayer = markersLayer;

    // Fit bounds if multiple points
    if (data.length > 1) {
      const bounds = L.latLngBounds(data.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [data]);

  return (
    <div className="map-container" style={{ height: `${height}px` }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default Map;
