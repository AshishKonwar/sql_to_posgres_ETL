require("dotenv").config();

const sql = require("mssql");

const config = {
  server: process.env.MSSQL_HOST,
  database: process.env.MSSQL_DATABASE,
  authentication: {
    type: "default",
    options: {
      userName: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 15000,
    requestTimeout: 15000
  }
};

(async () => {
  try {
    console.log("Attempting to connect to:", config.server, "/", config.database);
    
    const pool = new sql.ConnectionPool(config);
    await pool.connect();
    
    console.log("✓ Connected to SQL Server");
    
    const result = await pool.request().query("SELECT GETDATE() as CurrentTime");
    console.log("Current time:", result.recordset[0]);
    
    await pool.close();
    console.log("Connection closed");

  } catch (err) {
    console.error("✗ MSSQL Connection Error:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    process.exit(1);
  }
})();
