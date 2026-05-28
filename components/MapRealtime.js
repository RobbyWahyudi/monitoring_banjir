"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { MapPinHouse, MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

// Create custom icon function
const createCustomIcon = (status) => {
  const color = "#3b82f6"; // blue-500
  const iconHtml = renderToString(
    <div className="relative flex items-center justify-center">
      <MapPinHouse
        size={36}
        color="white"
        fill={color}
        strokeWidth={1}
        className="drop-shadow-lg"
      />
      <div className="absolute top-2 w-2 h-2 bg-white rounded-full shadow-inner" />
    </div>,
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker-icon bg-transparent border-none",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Create rawan icon function
const createRawanIcon = (tingkat) => {
  const isSangatRawan = tingkat === "sangat rawan";
  const coreColorClass = isSangatRawan ? "bg-rose-500" : "bg-amber-400";
  const haloColorClass = isSangatRawan ? "bg-rose-500/40" : "bg-amber-400/40";
  
  const iconHtml = renderToString(
    <div className="relative flex items-center justify-center w-10 h-10">
      {/* Transparent Halo */}
      <div className={`absolute inset-0 rounded-full ${haloColorClass} animate-pulse`} />
      <div className={`absolute inset-1 rounded-full ${haloColorClass}`} />
      
      {/* Core Dot */}
      <div className={`relative w-4 h-4 rounded-full border-2 border-white shadow-sm ${coreColorClass}`} />
    </div>,
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker-icon bg-transparent border-none",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function MapRealtime({ data, rawanData }) {
  useEffect(() => {
    // No longer need default icon fix when using custom icons
  }, []);

  return (
    <MapContainer
      center={[-7.1582, 113.4761]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer checked name="Peta Standar">
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Sensor Ketinggian Air">
          <LayerGroup>
            {data.map((item) => {
              if (!item.latitude || !item.longitude) return null;
              return (
                <Marker
                  key={`sensor-${item.id_sensor}`}
                  position={[item.latitude, item.longitude]}
                  icon={createCustomIcon(item.status)}
                >
                  <Popup className="custom-popup">
                    <div className="p-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-slate-800 text-sm">
                          {item.nama_sensor}
                        </h3>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className="flex justify-between gap-4">
                          <span className="text-slate-500">Ketinggian:</span>
                          <span className="font-bold text-slate-900">
                            {item.tinggi_air} cm
                          </span>
                        </p>
                        <p className="flex justify-between gap-4 items-center">
                          <span className="text-slate-500">Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                              item.status === "normal"
                                ? "bg-emerald-100 text-emerald-700"
                                : item.status === "siaga"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Titik Rawan Banjir">
          <LayerGroup>
            {rawanData?.map((item) => {
              if (!item.latitude || !item.longitude) return null;
              return (
                <Marker
                  key={`rawan-${item.id_titik}`}
                  position={[item.latitude, item.longitude]}
                  icon={createRawanIcon(item.tingkat_rawan)}
                >
                  <Popup className="custom-popup">
                    <div className="p-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-slate-800 text-sm">
                          Titik Rawan Banjir
                        </h3>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <p className="flex flex-col gap-0.5">
                          <span className="text-slate-500 uppercase text-[9px] font-bold">
                            Lokasi
                          </span>
                          <span className="font-semibold text-slate-900 leading-tight">
                            {item.lokasi}, Kec. {item.kecamatan}
                          </span>
                        </p>
                        <p className="flex justify-between gap-4 items-center pt-1 border-t border-slate-100">
                          <span className="text-slate-500">Tingkat Kerawanan:</span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                              item.tingkat_rawan === "sangat rawan"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.tingkat_rawan}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
