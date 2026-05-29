const { getMssqlPool } = require("../../config/mssql");

const { pgPool } = require("../../config/postgres");

const { mapSqlTypeToPg } = require("./typeMapper");

const logger = require("../../utils/logger");

const createPgTable = async (tableName) => {

    const startTime = Date.now();

    try {

        logger.info(`Starting PostgreSQL table creation for: ${tableName}`);

        logger.info("Connecting to SQL Server");

        const mssqlPool = await getMssqlPool();

        logger.info("Successfully connected to SQL Server");

        logger.info(`Fetching column metadata for table: ${tableName}`);

        const columnsResult = await mssqlPool
            .request()
            .input("tableName", tableName)
            .query(`
                SELECT
                    COLUMN_NAME,
                    DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = @tableName
            `);

        logger.info(`Column metadata fetched for table: ${tableName}`);

        const columns = columnsResult.recordset;

        logger.info(
            `Found ${columns.length} columns in table: ${tableName}`
        );

        if (columns.length === 0) {

            logger.warn(
                `No columns found for table: ${tableName}`
            );

            return;
        }

        logger.info(
            `Starting SQL Server to PostgreSQL datatype mapping for table: ${tableName}`
        );

        const columnDefinitions = columns.map(col => {

            const pgType = mapSqlTypeToPg(col.DATA_TYPE);

            logger.info(
                `Mapped column "${col.COLUMN_NAME}" from SQL type "${col.DATA_TYPE}" to PostgreSQL type "${pgType}"`
            );

            return `
                "${col.COLUMN_NAME}"
                ${pgType}
            `;

        }).join(",");

        logger.info(
            `Completed datatype mapping for table: ${tableName}`
        );

        logger.info(
            `Generating PostgreSQL CREATE TABLE query for: ${tableName}`
        );

        const createQuery = `
            CREATE TABLE IF NOT EXISTS "${tableName}" (
                ${columnDefinitions}
            )
        `;

        logger.info(
            `Generated CREATE TABLE query for: ${tableName}`
        );

        logger.info(
            `Executing CREATE TABLE query for: ${tableName}`
        );

        await pgPool.query(createQuery);

        logger.info(
            `Successfully created PostgreSQL table: ${tableName}`
        );

        const duration = (
            (Date.now() - startTime) / 1000
        ).toFixed(2);

        logger.info(
            `PostgreSQL table creation completed for ${tableName} in ${duration}s`
        );

    } catch (error) {

        logger.error(
            `Failed to create PostgreSQL table for: ${tableName}`,
            {
                message: error.message,
                stack: error.stack
            }
        );

        throw error;
    }
};

module.exports = {
    createPgTable
};