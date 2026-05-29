const DAILYHAZ_SUMMARY_QUERY = `
    SELECT 
        workcd,
        COUNT(workcd) AS total_count,
        SUM(wage) AS total_wage
    FROM DAILYHAZ
    GROUP BY workcd
`;

const CREATE_DAILYHAZ_SUMMARY_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS dailyhaz_summary (
        workcd TEXT PRIMARY KEY,
        total_count BIGINT,
        total_wage NUMERIC
    )
`;

const TRUNCATE_DAILYHAZ_SUMMARY_TABLE_QUERY = `
    TRUNCATE TABLE dailyhaz_summary
`;

const UPSERT_DAILYHAZ_SUMMARY_QUERY = `
    INSERT INTO dailyhaz_summary (
        workcd,
        total_count,
        total_wage
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (workcd)
    DO UPDATE SET
        total_count = EXCLUDED.total_count,
        total_wage = EXCLUDED.total_wage
`;

module.exports = {
    DAILYHAZ_SUMMARY_QUERY,
    CREATE_DAILYHAZ_SUMMARY_TABLE_QUERY,
    TRUNCATE_DAILYHAZ_SUMMARY_TABLE_QUERY,
    UPSERT_DAILYHAZ_SUMMARY_QUERY
};