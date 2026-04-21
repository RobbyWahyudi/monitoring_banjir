import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "banjirdb",
  password: "1245",
  port: 5432,
});

export default pool;
