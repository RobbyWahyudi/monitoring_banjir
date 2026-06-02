import pool from './lib/db.js';
async function run() {
  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'titik_rawan_banjir';");
  console.log('titik_rawan_banjir:', res.rows);
  const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sensor';");
  console.log('sensor:', res2.rows);
  process.exit();
}
run();
