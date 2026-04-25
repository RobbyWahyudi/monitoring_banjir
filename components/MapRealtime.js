"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

// Fungsi warna marker
const getColor = (status) => {
  if (status === "bahaya") return "#ef4444"; // red-500
  if (status === "siaga") return "#f59e0b"; // amber-500
  return "#22C55E"; // emerald-500
};

// Create custom icon function
const createCustomIcon = (status) => {
  const color = getColor(status);
  const iconHtml = renderToString(
    <div className="relative flex items-center justify-center">
      <MapPin size={40} color="white" fill={color} strokeWidth={1} className="drop-shadow-lg" />
      <div className="absolute top-2 w-2 h-2 bg-white rounded-full shadow-inner" />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export default function MapRealtime({ data }) {
  useEffect(() => {
    // No longer need default icon fix when using custom icons
  }, []);

  return (
    <MapContainer
      center={[-7.1582, 113.4761]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((item) => {
        if (!item.latitude || !item.longitude) return null;
        return (
          <Marker
            key={item.id_sensor}
            position={[item.latitude, item.longitude]}
            icon={createCustomIcon(item.status)}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-slate-800 text-sm mb-1">{item.nama_sensor}</h3>
                <div className="space-y-1 text-xs">
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-500">Ketinggian:</span>
                    <span className="font-bold text-slate-900">{item.tinggi_air} cm</span>
                  </p>
                  <p className="flex justify-between gap-4 items-center">
                    <span className="text-slate-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      item.status === "normal" ? "bg-emerald-100 text-emerald-700" :
                      item.status === "siaga" ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>
                      {item.status}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
