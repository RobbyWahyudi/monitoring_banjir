import pool from "@/lib/db";

// ======================
// UPDATE SENSOR
// ======================

export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const { nama_sensor, latitude, longitude, tanggal_instalasi } = body;

    const result = await pool.query(
      `
      UPDATE sensor
      SET
        nama_sensor = $1,
        lokasi = ST_SetSRID(ST_MakePoint($3, $2), 4326),
        tanggal_instalasi = $4
      WHERE id_sensor = $5
      RETURNING 
        id_sensor,
        nama_sensor,
        ST_Y(lokasi) AS latitude,
        ST_X(lokasi) AS longitude,
        tanggal_instalasi
      `,
      [nama_sensor, latitude, longitude, tanggal_instalasi, id],
    );

    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ======================
// DELETE SENSOR
// ======================

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await pool.query(
      `
      DELETE FROM sensor
      WHERE id_sensor = $1
      `,
      [id],
    );

    return Response.json({
      success: true,
      message: "Sensor berhasil dihapus",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
