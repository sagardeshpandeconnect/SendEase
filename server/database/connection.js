// PostgreSQL connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Update this with your serverless CockroachDB connection URL
  ssl: {
    rejectUnauthorized: false,
  }
});
// console.log(process.env.DATABASE_URL)

module.exports = pool;
