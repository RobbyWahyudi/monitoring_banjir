import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_sensor = searchParams.get("id_sensor");

    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;
 
    // Get data
    const dataResult = await pool.query(
       `SELECT * FROM (
          SELECT tinggi_air, status, timestamp 
          FROM data_monitoring
          WHERE id_sensor = $1
          ORDER BY timestamp DESC
          LIMIT $2 OFFSET $3
        ) sub
        ORDER BY timestamp ASC`,
       [id_sensor, limit, offset],
    );

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM data_monitoring WHERE id_sensor = $1`,
      [id_sensor]
    );

    return Response.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
