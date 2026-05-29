const logger = require("../../../utils/logger");
const { getTables } = require("../../../migrations/batch/getTables");
const { createPgTable } = require("../../../migrations/batch/createPgTable");
const { migrateTable } = require("../../../migrations/batch/migrateTable");

const runMigration = async () => {

    const totalStartTime = Date.now();

    logger.info(
        "Starting full SQL Server to PostgreSQL migration"
    );

    const tables = await getTables();

    logger.info(
        `Fetched ${tables.length} tables from SQL Server`
    );

    logger.info(
        `Tables: ${tables.join(", ")}`
    );

    for (const table of tables) {

        logger.info(
            `Starting migration pipeline for table: ${table}`
        );

        await createPgTable(table);

        logger.info(
            `PostgreSQL table ready: ${table}`
        );

        await migrateTable(table);

        logger.info(
            `Data migration completed for table: ${table}`
        );
    }

    const totalDuration = (
        (Date.now() - totalStartTime) / 1000
    ).toFixed(2);

    logger.info(
        `Full migration process completed successfully in ${totalDuration}s`
    );

    return {
        success: true,
        tablesMigrated: tables.length,
        duration: totalDuration
    };
};

module.exports = {
    runMigration
};