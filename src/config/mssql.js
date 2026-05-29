const sql = require("mssql");
require("dotenv").config();

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
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

let pool;

const getMssqlPool = async () => {

    try {

        if (pool) {
            return pool;
        }

        pool = await sql.connect(config);

        console.log("Connected to SQL Server");

        return pool;

    } catch (err) {

        console.error("SQL Server Connection Error:", err);

        throw err;
    }
};

module.exports = {
    getMssqlPool
};