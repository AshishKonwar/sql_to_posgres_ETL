const { runMigration } = require("../services/migration.service");

const migrateDatabase = async (req, res) => {

    try {

        const result = await runMigration();

        return res.status(200).json({
            success: true,
            message: "Migration completed successfully",
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    migrateDatabase
};