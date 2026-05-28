"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-['Poppins'] text-white flex items-center gap-3">
          Dashboard Admin
        </h1>
        <p className="text-slate-400">
          Selamat datang di panel kontrol. Kelola data sensor dan titik rawan
          banjir dari sini.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Kelola Sensor */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform translate-x-4 -translate-y-4"></div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-2">Data Sensor</h2>
            <p className="text-slate-400 text-sm mb-6">
              Kelola perangkat IoT, perbarui lokasi sensor, dan pantau status
              instalasi.
            </p>

            <Link
              href="/admin/sensor"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-300"
            >
              Kelola Sensor <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Card: Kelola Titik Rawan */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform translate-x-4 -translate-y-4"></div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-2">
              Titik Rawan Banjir
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Kelola peta daerah rawan banjir untuk peringatan dini kepada
              masyarakat.
            </p>

            <Link
              href="/admin/titik-rawan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors group-hover:translate-x-1 duration-300"
            >
              Kelola Titik Rawan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-linier-to-r from-blue-900/20 to-rose-900/20 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Informasi Sistem
          </h3>
          <p className="text-sm text-slate-400">
            Pembaruan sistem dilakukan secara real-time. Pastikan titik
            koordinat (Latitude & Longitude) akurat saat menambahkan data baru
            agar dapat dipetakan dengan benar.
          </p>
        </div>
      </div>
    </div>
  );
}
