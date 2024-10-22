const pg = require("pg")
require("dotenv").config()

const pool = new pg.Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
})

async function migrate() {
	const client = await pool.connect()
	try {
		await client.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id SERIAL PRIMARY KEY,
                body TEXT
            );

            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            INSERT INTO migrations (timestamp) VALUES (CURRENT_TIMESTAMP);
        `)
	} finally {
		client.release()
	}
}

module.exports = { pool, migrate }
