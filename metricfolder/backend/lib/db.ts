import { Pool } from 'pg';

// For local development, you can use a connection string or individual environment variables
// Example DATABASE_URL: postgres://user:password@localhost:5432/dbname
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:root123@localhost:5432/metric_db',
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
