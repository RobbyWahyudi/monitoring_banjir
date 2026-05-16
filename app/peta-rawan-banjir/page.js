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

        {/* Legend Overlay */}
        <div className="absolute bottom-8 right-4 lg:right-8 z-1000 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl space-y-4 min-w-50">
          <div>
            <div className="font-bold text-slate-800 text-xs mb-2 border-b border-slate-100 pb-2 uppercase tracking-wider">
              Status Air (Sensor)
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                <span className="text-xs font-semibold text-slate-600">
                  Normal (&lt; 50cm)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
                <span className="text-xs font-semibold text-slate-600">
                  Siaga (50-100cm)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
                <span className="text-xs font-semibold text-slate-600">
                  Bahaya (&gt; 100cm)
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-800 text-xs mb-2 border-b border-slate-100 pb-2 uppercase tracking-wider">
              Kerawanan (Titik)
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-rose-500 drop-shadow-sm" />
                <span className="text-xs font-semibold text-slate-600">
                  Sangat Rawan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-amber-400 drop-shadow-sm" />
                <span className="text-xs font-semibold text-slate-600">
                  Rawan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
