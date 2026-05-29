const { getMssqlPool } = require("../../config/mssql");

const { pgPool } = require("../../config/postgres");

const logger = require("../../utils/logger");

const migrateTable = async (tableName) => {

    const startTime = Date.now();

    const BATCH_SIZE = 1000;

    try {

        logger.info(
            `Starting migration for table: ${tableName}`
        );

        const mssqlPool = await getMssqlPool();

        logger.info(
            `Connected to SQL Server for table: ${tableName}`
        );

        const result = await mssqlPool.request().query(`
            SELECT *
            FROM ${tableName}
        `);

        const rows = result.recordset;

        logger.info(
            `Fetched ${rows.length} rows from SQL Server table: ${tableName}`
        );

        if (rows.length === 0) {

            logger.warn(
                `No rows found in table: ${tableName}`
            );

            return;
        }

        const columns = Object.keys(rows[0]);

        logger.info(
            `Found ${columns.length} columns in table: ${tableName}`
        );

        logger.info(
            `Starting batch inserts into PostgreSQL`
        );

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {

            const batchRows = rows.slice(i, i + BATCH_SIZE);

            logger.info(
                `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`
            );

            const values = [];

            const valuePlaceholders = batchRows.map(
                (row, rowIndex) => {

                    const rowPlaceholders = columns.map(
                        (_, colIndex) => {

                            const valueIndex =
                                (rowIndex * columns.length)
                                + colIndex
                                + 1;

                            return `$${valueIndex}`;
                        }
                    );

                    columns.forEach(col => {
                        values.push(row[col]);
                    });

                    return `(${rowPlaceholders.join(",")})`;
                }
            );

            const insertQuery = `
                INSERT INTO "${tableName}" (
                    ${columns.map(col => `"${col}"`).join(",")}
                )
                VALUES
                ${valuePlaceholders.join(",")}
            `;

            await pgPool.query(insertQuery, values);

            logger.info(
                `Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} with ${batchRows.length} rows`
            );
        }

        const duration = (
            (Date.now() - startTime) / 1000
        ).toFixed(2);

        logger.info(
            `Migration completed for table: ${tableName} in ${duration}s`
        );

        return {
            tableName,
            totalRows: rows.length,
            duration
        };

    } catch (error) {

        logger.error(
            `Migration failed for table: ${tableName}`,
            {
                message: error.message,
                stack: error.stack
            }
        );

        throw error;
    }
};

module.exports = {
    migrateTable
};