const { Pool } = require("pg");
require("dotenv").config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pgPool.connect()
    .then((client) => {
        console.log("Connected to Neon PostgreSQL");
        client.release(); 
    })
    .catch((err) => {
        console.error("PostgreSQL Connection Error:", err);
    });

    pgPool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
});

module.exports = {
    pgPool
};