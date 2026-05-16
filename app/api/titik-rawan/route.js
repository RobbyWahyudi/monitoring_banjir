import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id_titik,
        lokasi,
        kecamatan,
        latitude,
        longitude,
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
