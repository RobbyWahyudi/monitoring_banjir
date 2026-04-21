import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (s.id_sensor)
        s.id_sensor,
        s.nama_sensor,
        s.latitude,
        s.longitude,
        d.tinggi_air,
        d.status,
        d.timestamp
      FROM sensor s
      JOIN data_monitoring d ON s.id_sensor = d.id_sensor
      ORDER BY s.id_sensor, d.timestamp DESC
    `);

    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
