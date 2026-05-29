require("dotenv").config();

const { pgPool } = require("./src/config/postgres");

(async () => {
    try {
        const result = await pgPool.query("SELECT NOW()");

        console.log("✓ Connected to Neon PostgreSQL");
        console.log("Current time:", result.rows[0]);

    } catch (err) {
        console.error("✗ PostgreSQL Connection Error:", err.message);
        process.exit(1);
    } finally {
        await pgPool.end();
        console.log("Connection pool closed");
    }
})();
