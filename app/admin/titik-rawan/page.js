"use client";

import { useEffect, useState, useRef } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function TitikRawanPage() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    lokasi: "",
    kecamatan: "",
    latitude: "",
    longitude: "",
    tingkat_rawan: "rawan",
  });

  const [editId, setEditId] = useState(null);

  // ======================
  // FETCH DATA
  // ======================

  const fetchData = async () => {
    const res = await fetch("/api/titik-rawan");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/titik-rawan");
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }
        const result = await res.json();
        if (!ignore) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally set error state here if you have one
      }
    };

    fetchData();

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
    const url = editId ? `/api/titik-rawan/${editId}` : "/api/titik-rawan";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      lokasi: "",
      kecamatan: "",
      latitude: "",
      longitude: "",
      tingkat_rawan: "rawan",
    });

    setEditId(null);
    fetchData();
  };

  // ======================
  // EDIT
  // ======================

  const handleEdit = (item) => {
    setEditId(item.id_titik);

    setForm({
      lokasi: item.lokasi,
      kecamatan: item.kecamatan,
      latitude: item.latitude,
      longitude: item.longitude,
      tingkat_rawan: item.tingkat_rawan,
    });
  };

  // ======================
  // DELETE
  // ======================

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus data?");

    if (!confirmDelete) return;

    await fetch(`/api/titik-rawan/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-['Poppins'] text-white">
          Kelola Titik Rawan Banjir
        </h1>
        <p className="text-slate-400">
          Tambah, ubah, atau hapus data pemetaan daerah rawan banjir.
        </p>
      </div>

      {/* FORM SECTION */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">
          {editId ? "Ubah Data Titik Rawan" : "Tambah Titik Rawan Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-sm font-medium text-slate-300">
                Lokasi
              </label>
              <input
                type="text"
                placeholder="Contoh: Desa XYZ, Dusun ABC"
                value={form.lokasi}
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Kecamatan
              </label>
              <input
                type="text"
                placeholder="Contoh: Pamekasan"
                value={form.kecamatan}
                onChange={(e) =>
                  setForm({ ...form, kecamatan: e.target.value })
                }
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                Tingkat Kerawanan
              </label>
              <select
                value={form.tingkat_rawan}
                onChange={(e) =>
                  setForm({ ...form, tingkat_rawan: e.target.value })
                }
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="rawan">Rawan</option>
                <option value="sangat rawan">Sangat Rawan</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    lokasi: "",
                    kecamatan: "",
                    latitude: "",
                    longitude: "",
                    tingkat_rawan: "rawan",
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
                  Lokasi
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  Kecamatan
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  Koordinat (Lat, Lng)
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300">
                  Tingkat Kerawanan
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-300 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Belum ada data titik rawan banjir.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id_titik}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {item.id_titik}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-200">
                      {item.lokasi}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {item.kecamatan}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {item.latitude}, {item.longitude}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          item.tingkat_rawan?.toLowerCase() === "sangat rawan"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.tingkat_rawan?.toLowerCase() === "sangat rawan"
                          ? "Sangat Rawan"
                          : "Rawan"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_titik)}
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
