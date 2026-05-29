const { getMssqlPool } = require("../config/mssql.js");
const { pgPool } = require("../config/postgres.js");
const logger = require("../utils/logger.js");

const {
    DAILYHAZ_SUMMARY_QUERY,
    CREATE_DAILYHAZ_SUMMARY_TABLE_QUERY,
    UPSERT_DAILYHAZ_SUMMARY_QUERY
} = require("../constants/queries/queries.js");

const migrateDailyHazSummary = async () => {

    const startTime = Date.now();

    try {

        logger.info("Starting DAILYHAZ summary migration");

        const mssqlPool = await getMssqlPool();

        logger.info("Connected to SQL Server");

        const result = await mssqlPool.request().query(
            DAILYHAZ_SUMMARY_QUERY
        );

        const rows = result.recordset;

        logger.info(`Fetched ${rows.length} aggregated rows`);

        if (rows.length === 0) {

            logger.warn("No rows found");

            return;
        }

        await pgPool.query(
            CREATE_DAILYHAZ_SUMMARY_TABLE_QUERY
        ); 

        logger.info("dailyhaz_summary table ready");

        for (const row of rows) {

                await pgPool.query(
                    UPSERT_DAILYHAZ_SUMMARY_QUERY,
                    [
                        row.workcd,
                        row.total_count,
                        row.total_wage
                    ]
                );
            }

            logger.info(
                `Successfully synced ${rows.length} DAILYHAZ summary rows`
        );

        const duration = (
            (Date.now() - startTime) / 1000
        ).toFixed(2);

        logger.info(
            `Migration completed successfully in ${duration}s`
        );

    } catch (error) {

        logger.error("Migration failed", {
            message: error.message,
            stack: error.stack
        });

        throw error;
    }
};

module.exports = {
    migrateDailyHazSummary
};