const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://postgres:root123@localhost:5432/metric_db',
});

const sql = `
CREATE TABLE IF NOT EXISTS metrics (
    metric_name TEXT PRIMARY KEY,
    last_value FLOAT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function apply() {
    try {
        console.log('Applying migration...');
        await pool.query(sql);
        console.log('Migration applied successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error applying migration:', err);
        process.exit(1);
    }
}

apply();
