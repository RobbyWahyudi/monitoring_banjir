"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import dynamic from "next/dynamic";

const MapRealtime = dynamic(() => import("@/components/MapRealtime"), {
  ssr: false,
});

let socket;

export default function PetaBanjirPage() {
  const [data, setData] = useState([]);
  const [rawanData, setRawanData] = useState([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Ambil data sensor (realtime)
        const res = await fetch("/api/latest-data");
        const result = await res.json();
        setData(result);

        // Ambil data titik rawan
        const resRawan = await fetch("/api/titik-rawan");
        const resultRawan = await resRawan.json();
        setRawanData(resultRawan);

        // Setup socket
        const socketInstance = io();

        socketInstance.on("new-data", (newData) => {
          // Update MAP
          setData((prev) => {
            const filtered = prev.filter(
              (item) => item.id_sensor !== newData.id_sensor,
            );
            return [...filtered, newData];
          });
        });

        socket = socketInstance;
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };

    init();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 lg:left-64 z-0 flex flex-col bg-slate-50">
      {/* Mobile Header Bar */}
      <div className="lg:hidden h-18 bg-white border-b border-slate-100 flex items-center justify-center px-4 shadow-sm z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-slate-900 leading-none">
            Peta Rawan Banjir
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium italic">
            Sebaran sensor dan rawan banjir di Kabupaten Pamekasan
          </p>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapRealtime data={data} rawanData={rawanData} />

        {/* Desktop Floating Header */}
        <div className="hidden lg:block absolute top-8 right-8 z-1000 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 max-w-md">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            Peta Rawan Banjir
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Sebaran sensor dan rawan banjir di Kabupaten Pamekasan
          </p>
        </div>

        {/* Legend Button */}
        <div className="absolute bottom-8 right-4 lg:right-8 z-1000">
          {!showLegend && (
            <button
              onClick={() => setShowLegend(true)}
              className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-full border border-slate-200 shadow-xl font-semibold text-slate-700 hover:bg-white transition-all flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              Legenda
            </button>
          )}

          {/* Legend Popup Overlay */}
          {showLegend && (
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200 shadow-2xl space-y-5 min-w-60 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
              <button
                onClick={() => setShowLegend(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                title="Tutup"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Sensor Legend */}
              <div>
                <div className="font-bold text-slate-800 text-xs mb-3 border-b border-slate-200 pb-2 uppercase tracking-wider pr-6">
                  Sensor Ketinggian Air
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm shadow-sm" />
                    <span className="text-xs font-semibold text-slate-600">
                      Lokasi Sensor
                    </span>
                  </div>
                  <div className="pl-7 space-y-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Status di Pop-up:
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                      <span className="text-[11px] font-medium text-slate-600">
                        Normal (&lt; 5cm)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                      <span className="text-[11px] font-medium text-slate-600">
                        Siaga (5-10cm)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                      <span className="text-[11px] font-medium text-slate-600">
                        Bahaya (&ge; 10cm)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rawan Legend */}
              <div>
                <div className="font-bold text-slate-800 text-xs mb-3 border-b border-slate-200 pb-2 uppercase tracking-wider">
                  Titik Rawan Banjir
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-pulse" />
                      <div className="relative w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      Sangat Rawan
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-pulse" />
                      <div className="relative w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      Rawan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
