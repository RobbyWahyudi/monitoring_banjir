"use client";

import { useEffect, useState, useRef } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function SensorPage() {
  const [sensors, setSensors] = useState([]);

  const [form, setForm] = useState({
    nama_sensor: "",
    latitude: "",
    longitude: "",
    tanggal_instalasi: "",
  });

  const [editId, setEditId] = useState(null);

  // ======================
  // FETCH SENSOR
  // ======================

  const fetchSensors = async () => {
    const res = await fetch("/api/sensor");
    const data = await res.json();

    setSensors(data);
  };

  useEffect(() => {
    let ignore = false;

    const fetchSensors = async () => {
      try {
        const res = await fetch("/api/sensor");
        if (!res.ok) {
          throw new Error(`Failed to fetch sensors: ${res.status}`);
        }
        const data = await res.json();
        if (!ignore) {
          setSensors(data);
        }
      } catch (error) {
        console.error("Error fetching sensors:", error);
        // Optionally set error state here if you have one
      }
    };

    fetchSensors();

    return () => {
      ignore = true;
    };
  }, []);

  // ======================
  // SUBMIT
  // ======================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/sensor/${editId}` : "/api/sensor";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      nama_sensor: "",
      latitude: "",
      longitude: "",
      tanggal_instalasi: "",
    });

    setEditId(null);

    fetchSensors();
  };

  // ======================
  // EDIT
  // ======================

  const handleEdit = (sensor) => {
    setEditId(sensor.id_sensor);

    setForm({
      nama_sensor: sensor.nama_sensor,
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      tanggal_instalasi: sensor.tanggal_instalasi?.split("T")[0],
    });
  };

  // ======================
  // DELETE
  // ======================

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus sensor?");

    if (!confirmDelete) return;

    await fetch(`/api/sensor/${id}`, {
      method: "DELETE",
    });

    fetchSensors();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-['Poppins'] text-white">
          Kelola Data Sensor
        </h1>
        <p className="text-slate-400">Tambah, ubah, atau hapus data sensor.</p>
      </div>

      {/* FORM SECTION */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">
          {editId ? "Ubah Data Sensor" : "Tambah Sensor Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Nama Sensor
              </label>
              <input
                type="text"
                placeholder="Contoh: Sensor Sungai A"
                value={form.nama_sensor}
                onChange={(e) =>
                  setForm({ ...form, nama_sensor: e.target.value })
                }
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Tanggal Instalasi
              </label>
              <input
                type="date"
                value={form.tanggal_instalasi}
                onChange={(e) =>
                  setForm({ ...form, tanggal_instalasi: e.target.value })
                }
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all scheme:dark"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Contoh: -7.158"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                placeholder="Contoh: 113.482"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    nama_sensor: "",
                    latitude: "",
                    longitude: "",
                    tanggal_instalasi: "",
                  });
                }}
                className="px-6 py-3 rounded-xl font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
            >
              {editId ? "Simpan Perubahan" : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  ID
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  Nama Sensor
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  Lokasi (Lat, Lng)
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  Tgl. Instalasi
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sensors.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Belum ada data sensor.
                  </td>
                </tr>
              ) : (
                sensors.map((sensor) => (
                  <tr
                    key={sensor.id_sensor}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {sensor.id_sensor}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-200">
                      {sensor.nama_sensor}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {sensor.latitude}, {sensor.longitude}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {sensor.tanggal_instalasi?.split("T")[0]}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(sensor)}
                          title="Edit"
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(sensor.id_sensor)}
                          title="Hapus"
                          className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
