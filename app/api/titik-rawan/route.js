import pool from "@/lib/db";

// ======================
// GET ALL DATA
// ======================

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id_titik,
        nama_lokasi AS lokasi,
        kecamatan,
        ST_Y(lokasi) AS latitude,
        ST_X(lokasi) AS longitude,
        tingkat_rawan
      FROM titik_rawan_banjir
      ORDER BY id_titik ASC
    `);

    return Response.json(result.rows);
  } catch (error) {
    console.error("Error titik rawan:", error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ======================
// CREATE DATA
// ======================

export async function POST(req) {
  try {
    const body = await req.json();

    const { lokasi, kecamatan, latitude, longitude, tingkat_rawan } = body;

    const result = await pool.query(
      `
      INSERT INTO titik_rawan_banjir
      (
        nama_lokasi,
        kecamatan,
        lokasi,
        tingkat_rawan
      )
      VALUES ($1, $2, ST_SetSRID(ST_MakePoint($4, $3), 4326), $5)
      RETURNING 
        id_titik,
        nama_lokasi AS lokasi,
        kecamatan,
        ST_Y(lokasi) AS latitude,
        ST_X(lokasi) AS longitude,
        tingkat_rawan
      `,
      [lokasi, kecamatan, latitude, longitude, tingkat_rawan],
    );

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("POST titik rawan error:", error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}
