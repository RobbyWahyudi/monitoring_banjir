import pool from "@/lib/db";

// ======================
// UPDATE DATA
// ======================

export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const { lokasi, kecamatan, latitude, longitude, tingkat_rawan } = body;

    const result = await pool.query(
      `
      UPDATE titik_rawan_banjir
      SET
        lokasi = $1,
        kecamatan = $2,
        latitude = $3,
        longitude = $4,
        tingkat_rawan = $5
      WHERE id_titik = $6
      RETURNING *
      `,
      [lokasi, kecamatan, latitude, longitude, tingkat_rawan, id],
    );

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("PUT error:", error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ======================
// DELETE DATA
// ======================

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await pool.query(
      `
      DELETE FROM titik_rawan_banjir
      WHERE id_titik = $1
      `,
      [id],
    );

    return Response.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE error:", error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}
