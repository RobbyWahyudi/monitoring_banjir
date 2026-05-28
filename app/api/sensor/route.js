import pool from "@/lib/db";

// ======================
// GET ALL SENSOR
// ======================

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT *
      FROM sensor
      ORDER BY id_sensor ASC
    `);

    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ======================
// CREATE SENSOR
// ======================

export async function POST(req) {
  try {
    const body = await req.json();

    const { nama_sensor, latitude, longitude, tanggal_instalasi } = body;

    const result = await pool.query(
      `
      INSERT INTO sensor
      (
        nama_sensor,
        latitude,
        longitude,
        tanggal_instalasi
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [nama_sensor, latitude, longitude, tanggal_instalasi],
    );

    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
