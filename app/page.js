"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import dynamic from "next/dynamic";
import WaterLevelChart from "@/components/WaterLevelChart";
import FloodAlert from "@/components/FloodAlert";

const MapRealtime = dynamic(() => import("@/components/MapRealtime"), {
  ssr: false,
});

let socket;

export default function Home() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(1);
  const [alerts, setAlerts] = useState([]);

  const handleCloseAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Fetch awal
  const fetchData = async () => {
    const res = await fetch("/api/latest-data");
    const result = await res.json();
    setData(result);
  };

  const fetchChart = async (sensorId) => {
    const res = await fetch(`/api/history?id_sensor=${sensorId}&limit=15`);
    const result = await res.json();
    setChartData(result.data);
  };

  useEffect(() => {
    const init = async () => {
      // Ambil data awal (map)
      const res = await fetch("/api/latest-data");
      const result = await res.json();
      setData(result);

      // Ambil data awal grafik
      const chartRes = await fetch(
        `/api/history?id_sensor=${selectedSensor}&limit=15`,
      );
      const chartResult = await chartRes.json();
      setChartData(chartResult.data);

      // Setup socket
      const socketInstance = io();

      socketInstance.on("new-data", (newData) => {
        const sent = Number(newData.sent_time);
        const receive = Date.now();
        const latency = Math.abs(receive - sent);

        // console.log("Realtime:", newData);

        // console.log("Sent:", sent);
        // console.log("Receive:", receive);
        console.log("Latency:", latency, "ms");

        // 🚨 ALERT BANJIR
        if (newData.status === "bahaya") {
          // Play alert sound
          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
          );
          audio.volume = 1.0;
          const playPromise = audio.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Autoplay prevented or audio failed:", error);
            });
          }

          setAlerts((prev) => {
            // Hindari duplikasi alert dari sensor yang sama
            const exists = prev.find((a) => a.id_sensor === newData.id_sensor);
            if (exists) return prev;

            return [
              ...prev,
              {
                id: Date.now(),
                id_sensor: newData.id_sensor,
                nama_sensor:
                  newData.nama_sensor || `Sensor ${newData.id_sensor}`,
                tinggi_air: newData.tinggi_air,
              },
            ];
          });
        }

        // 🔹 Update MAP
        setData((prev) => {
          const filtered = prev.filter(
            (item) => item.id_sensor !== newData.id_sensor,
          );
          return [...filtered, newData];
        });

        // 🔹 Update CHART (hanya sensor aktif)
        if (newData.id_sensor === selectedSensor) {
          setChartData((prev) =>
            [
              ...prev,
              {
                tinggi_air: newData.tinggi_air,
                timestamp: newData.timestamp,
              },
            ].slice(-15),
          ); // ambil 15 data terakhir
        }
      });

      socket = socketInstance;
    };

    init();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [selectedSensor]);

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts((prev) => prev.slice(1));
      }, 10000); // 10 detik

      return () => clearTimeout(timer);
    }
  }, [alerts]);
  return (
    <div className="space-y-8">
      <FloodAlert alerts={alerts} onClose={handleCloseAlert} />

      <div className="flex flex-col gap-2">
        <h1 className="text-white text-3xl font-bold tracking-tight">
          Dashboard Monitoring
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-slate-800 text-xl">
                  Grafik Ketinggian Air
                </h2>
              </div>
              <select
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all min-w-50"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedSensor(val);
                  fetchChart(val);
                }}
              >
                {data.map((s) => (
                  <option key={s.id_sensor} value={s.id_sensor}>
                    {s.nama_sensor}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full h-75 md:h-112.5 relative">
              <WaterLevelChart chartData={chartData} />
            </div>
          </div>
        </div>

        {/* Sidebar/Info Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800 text-lg">
                Status Sensor
              </h2>
            </div>
            <div className="space-y-4">
              {data.map((d) => (
                <div
                  key={d.id_sensor}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 transition-all hover:shadow-md hover:border-blue-100 group"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {d.nama_sensor}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Data terkini:{" "}
                      {new Date(d.timestamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-slate-900">
                      {d.tinggi_air}{" "}
                      <span className="text-sm font-normal text-slate-400">
                        cm
                      </span>
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 ${
                        d.status === "normal"
                          ? "bg-emerald-100 text-emerald-700"
                          : d.status === "siaga"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
              {data.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">
                  <div className="mb-2">📡</div>
                  Menunggu data sensor...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-blue-50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Pusat Bantuan
            </h3>
            <p className="text-slate-500 text-sm mb-5 leading-relaxed">
              Segera hubungi BPBD Pamekasan jika terjadi keadaan darurat banjir
              di sekitar Anda.
            </p>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Hubungi 112
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
