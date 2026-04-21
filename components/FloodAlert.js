"use client";

export default function FloodAlert({ alerts, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            background: "#ff4d4f",
            color: "white",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            minWidth: "250px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <b>⚠️ PERINGATAN BANJIR</b>
          <p style={{ margin: "5px 0" }}>{alert.nama_sensor}</p>
          <p style={{ margin: 0 }}>Tinggi Air: {alert.tinggi_air} cm</p>

          <button
            onClick={() => onClose(alert.id)}
            style={{
              marginTop: "10px",
              background: "white",
              color: "#ff4d4f",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Tutup
          </button>
        </div>
      ))}
    </div>
  );
}
