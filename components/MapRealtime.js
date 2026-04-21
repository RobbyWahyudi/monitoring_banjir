"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Fix icon default error
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "/marker-icon-2x.png",
//   iconUrl: "/marker-icon.png",
//   shadowUrl: "/marker-shadow.png",
// });

// Fungsi warna marker
const getColor = (status) => {
  if (status === "bahaya") return "red";
  if (status === "siaga") return "orange";
  return "green";
};

export default function MapRealtime({ data }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={[-7.25, 112.75]}
      zoom={13}
      style={{ height: "500px" }}
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
          >
            <Popup>
              <b>{item.nama_sensor}</b>
              <br />
              Tinggi Air: {item.tinggi_air} cm
              <br />
              Status:{" "}
              <span style={{ color: getColor(item.status) }}>
                {item.status}
              </span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
