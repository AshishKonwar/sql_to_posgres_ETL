const { getMssqlPool } = require("../../config/mssql");

const getTables = async () => {

    const pool = await getMssqlPool();

    const result = await pool.request().query(`
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
    `);

    return result.recordset.map(row => row.TABLE_NAME);
};

module.exports = {
    getTables
};