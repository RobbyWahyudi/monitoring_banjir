import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id_sensor, tinggi_air } = body;

    let status = "normal";
    if (tinggi_air > 100) status = "bahaya";
    else if (tinggi_air > 50) status = "siaga";

    const result = await pool.query(
      `INSERT INTO data_monitoring (id_sensor, tinggi_air, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_sensor, tinggi_air, status],
    );

    const fullData = await pool.query(
      `SELECT 
        s.id_sensor,
        s.nama_sensor,
        s.latitude,
        s.longitude,
        d.tinggi_air,
        d.status,
        d.timestamp
       FROM sensor s
       JOIN data_monitoring d ON s.id_sensor = d.id_sensor
       WHERE d.id_data = $1`,
      [result.rows[0].id_data],
    );

    const newData = fullData.rows[0];

    if (global.io) {
      global.io.emit("new-data", newData);
    }

    return Response.json({
      success: true,
      data: newData,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message });
  }
}
