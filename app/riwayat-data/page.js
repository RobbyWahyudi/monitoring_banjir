"use client";

import { useState, useEffect } from "react";

export default function RiwayatDataPage() {
  const [sensors, setSensors] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 50;

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch("/api/latest-data");
        const data = await res.json();
        setSensors(data);
        if (data.length > 0) {
          setSelectedSensor(data[0].id_sensor);
        }
      } catch (error) {
        console.error("Error fetching sensors:", error);
      }
    };
    fetchSensors();
  }, []);

  useEffect(() => {
    if (selectedSensor) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const offset = (currentPage - 1) * limit;
          let url = `/api/history?id_sensor=${selectedSensor}&limit=${limit}&offset=${offset}`;
          if (selectedMonth) url += `&month=${selectedMonth}`;
          if (selectedYear) url += `&year=${selectedYear}`;

          const res = await fetch(url);
          const result = await res.json();
          // Sort DESC for table view (newest first)
          setHistoryData([...result.data].reverse());
          setTotalRecords(result.total);
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [selectedSensor, currentPage, selectedMonth, selectedYear]);

  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-3xl font-bold tracking-tight text-slate-900">Riwayat Data</h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-100 flex-wrap">
          <span className="text-sm font-medium text-slate-500 ml-2">Pilih Sensor:</span>
          <select
            className="bg-slate-50 border-none text-slate-800 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 block p-2.5 outline-none transition-all min-w-[200px]"
            value={selectedSensor}
            onChange={(e) => {
              setSelectedSensor(e.target.value);
              setCurrentPage(1); // Reset to page 1 on sensor change
            }}
          >
            {sensors.map((s) => (
              <option key={s.id_sensor} value={s.id_sensor}>
                {s.nama_sensor}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>

          <span className="text-sm font-medium text-slate-500 ml-2">Bulan:</span>
          <select
            className="bg-slate-50 border-none text-slate-800 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 block p-2.5 outline-none transition-all min-w-[120px]"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          <span className="text-sm font-medium text-slate-500 ml-2">Tahun:</span>
          <select
            className="bg-slate-50 border-none text-slate-800 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 block p-2.5 outline-none transition-all min-w-[100px]"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-300">
                <th className="px-6 py-5 text-sm font-bold text-slate-700 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-5 text-sm font-bold text-slate-700 uppercase tracking-wider">Ketinggian Air</th>
                <th className="px-6 py-5 text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-sm font-bold text-slate-700 uppercase tracking-wider text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : historyData.length > 0 ? (
                historyData.map((row, index) => {
                  const prevRow = historyData[index + 1];
                  const diff = prevRow ? row.tinggi_air - prevRow.tinggi_air : 0;
                  
                  return (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            {new Date(row.timestamp).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false
                            })}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(row.timestamp).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-lg">
                        {row.tinggi_air} <span className="text-sm font-normal text-slate-400">cm</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          row.status === "normal" ? "bg-emerald-100 text-emerald-700" :
                          row.status === "siaga" ? "bg-amber-100 text-amber-700" :
                          "bg-rose-100 text-rose-700"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {diff > 0 ? (
                          <span className="text-rose-500 font-bold flex items-center justify-end gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7 7 7M12 3v18" />
                            </svg>
                            {diff.toFixed(2)} cm
                          </span>
                        ) : diff < 0 ? (
                          <span className="text-emerald-500 font-bold flex items-center justify-end gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7M12 21V3" />
                            </svg>
                            {Math.abs(diff).toFixed(2)} cm
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 italic">
                    Belum ada data historis untuk sensor ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-900">{(currentPage - 1) * limit + 1}</span> - <span className="font-semibold text-slate-900">{Math.min(currentPage * limit, totalRecords)}</span> dari <span className="font-semibold text-slate-900">{totalRecords}</span> data
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 3 + i + 1;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                  
                  if (pageNum <= totalPages && pageNum > 0) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
