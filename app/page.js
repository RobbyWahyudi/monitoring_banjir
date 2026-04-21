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
    const res = await fetch(`/api/history?id_sensor=${sensorId}`);
    const result = await res.json();
    setChartData(result);
  };

  useEffect(() => {
    const init = async () => {
      // Ambil data awal (map)
      const res = await fetch("/api/latest-data");
      const result = await res.json();
      setData(result);

      // Ambil data awal grafik
      const chartRes = await fetch(`/api/history?id_sensor=${selectedSensor}`);
      const chartResult = await chartRes.json();
      setChartData(chartResult);

      // Setup socket
      const socketInstance = io("http://localhost:3000");

      socketInstance.on("new-data", (newData) => {
        console.log("Realtime:", newData);

        // 🚨 ALERT BANJIR
        if (newData.status === "bahaya") {
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
            ].slice(-20),
          ); // ambil 20 data terakhir
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
    <div style={{ padding: "20px" }}>
      <FloodAlert alerts={alerts} onClose={handleCloseAlert} />
      <h1>Dashboard Monitoring Banjir</h1>

      <MapRealtime data={data} />

      <h2>Data Realtime</h2>
      <ul>
        {data.map((d) => (
          <li key={d.id_sensor}>
            {d.nama_sensor} - {d.tinggi_air} cm ({d.status})
          </li>
        ))}
      </ul>

      <h2>Grafik Ketinggian Air</h2>
      <select
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

      <WaterLevelChart chartData={chartData} />
    </div>
  );
}
