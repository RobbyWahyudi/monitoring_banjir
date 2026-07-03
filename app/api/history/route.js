import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_sensor = searchParams.get("id_sensor");

    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const limit = parseInt(searchParams.get("limit")) || 50;
    const offset = parseInt(searchParams.get("offset")) || 0;
 
    let dateFilter = "";
    const queryParams = [id_sensor];
    let paramIndex = 2;

    if (month && year) {
      dateFilter = ` AND EXTRACT(MONTH FROM timestamp) = $${paramIndex} AND EXTRACT(YEAR FROM timestamp) = $${paramIndex + 1}`;
      queryParams.push(parseInt(month), parseInt(year));
      paramIndex += 2;
    } else if (month) {
      dateFilter = ` AND EXTRACT(MONTH FROM timestamp) = $${paramIndex}`;
      queryParams.push(parseInt(month));
      paramIndex += 1;
    } else if (year) {
      dateFilter = ` AND EXTRACT(YEAR FROM timestamp) = $${paramIndex}`;
      queryParams.push(parseInt(year));
      paramIndex += 1;
    }

    const limitIndex = paramIndex;
    const offsetIndex = paramIndex + 1;
    const dataQueryParams = [...queryParams, limit, offset];

    // Get data
    const dataResult = await pool.query(
       `SELECT * FROM (
          SELECT tinggi_air, status, timestamp 
          FROM data_monitoring
          WHERE id_sensor = $1 ${dateFilter}
          ORDER BY timestamp DESC
          LIMIT $${limitIndex} OFFSET $${offsetIndex}
        ) sub
        ORDER BY timestamp ASC`,
       dataQueryParams,
    );

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM data_monitoring WHERE id_sensor = $1 ${dateFilter}`,
      queryParams
    );

    return Response.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
