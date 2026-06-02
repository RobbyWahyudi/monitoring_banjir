import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrate() {
  try {
    console.log("Starting migration...");
    
    // 1. Enable PostGIS
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log("PostGIS extension ensured.");

    // 2. titik_rawan_banjir changes
    // Check if `lokasi` is still a text column and we haven't renamed it yet.
    const res = await pool.query(`
      SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'titik_rawan_banjir' AND column_name = 'lokasi';
    `);
    
    if (res.rows.length > 0 && res.rows[0].data_type !== 'USER-DEFINED') {
      // Assuming 'USER-DEFINED' for geometry. Actually, PostGIS geometry might be USER-DEFINED.
      // A better way is to check if it's text.
      if (res.rows[0].data_type === 'character varying' || res.rows[0].data_type === 'text') {
        console.log("Renaming 'lokasi' to 'nama_lokasi' in 'titik_rawan_banjir'");
        await pool.query('ALTER TABLE titik_rawan_banjir RENAME COLUMN lokasi TO nama_lokasi;');
      }
    }

    // Add new PostGIS column
    await pool.query('ALTER TABLE titik_rawan_banjir ADD COLUMN IF NOT EXISTS lokasi GEOMETRY(Point, 4326);');
    console.log("Added 'lokasi' GEOMETRY column to 'titik_rawan_banjir'");

    // Migrate existing data if latitude and longitude columns exist
    const res2 = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'titik_rawan_banjir' AND column_name = 'latitude';
    `);
    if (res2.rows.length > 0) {
      console.log("Migrating coordinates in 'titik_rawan_banjir'");
      await pool.query(`
        UPDATE titik_rawan_banjir 
        SET lokasi = ST_SetSRID(ST_MakePoint(CAST(longitude AS float), CAST(latitude AS float)), 4326)
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
      `);
      console.log("Dropping old latitude and longitude columns from 'titik_rawan_banjir'");
      await pool.query('ALTER TABLE titik_rawan_banjir DROP COLUMN latitude;');
      await pool.query('ALTER TABLE titik_rawan_banjir DROP COLUMN longitude;');
    }

    // 3. sensor changes
    // Check if 'lokasi' column exists
    await pool.query('ALTER TABLE sensor ADD COLUMN IF NOT EXISTS lokasi GEOMETRY(Point, 4326);');
    console.log("Added 'lokasi' GEOMETRY column to 'sensor'");

    // Migrate existing data
    const res3 = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'sensor' AND column_name = 'latitude';
    `);
    if (res3.rows.length > 0) {
      console.log("Migrating coordinates in 'sensor'");
      await pool.query(`
        UPDATE sensor 
        SET lokasi = ST_SetSRID(ST_MakePoint(CAST(longitude AS float), CAST(latitude AS float)), 4326)
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
      `);
      console.log("Dropping old latitude and longitude columns from 'sensor'");
      await pool.query('ALTER TABLE sensor DROP COLUMN latitude;');
      await pool.query('ALTER TABLE sensor DROP COLUMN longitude;');
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
