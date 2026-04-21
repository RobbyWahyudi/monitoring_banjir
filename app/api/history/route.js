import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_sensor = searchParams.get("id_sensor");

    const result = await pool.query(
      `SELECT tinggi_air, timestamp 
       FROM data_monitoring
       WHERE id_sensor = $1
       ORDER BY timestamp ASC
       LIMIT 20`,
      [id_sensor],
    );

    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
