"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
);

export default function WaterLevelChart({ chartData }) {
  const data = {
    labels: chartData.map((d) =>
      new Date(d.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    ),
    datasets: [
      {
        label: "Tinggi Air (cm)",
        data: chartData.map((d) => d.tinggi_air),
        fill: false,
        tension: 0.3,
        borderColor: "#4b7ce5ff",
        backgroundColor: "#4b7ce5ff",
        pointBackgroundColor: "#1352dbff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Waktu",
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Tinggi Air (cm)",
          font: {
            weight: "bold",
          },
        },
        beginAtZero: true,
        suggestedMax: 15,
      },
    },
  };

  return <Line data={data} options={options} />;
}
