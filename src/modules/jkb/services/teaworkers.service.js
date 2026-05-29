const prisma = require("../../../../prisma/prismaClient");

const getDailyHazSummary = async () => {
    const data = await prisma.$queryRaw`
        SELECT
            workcd,
            COUNT(workcd) AS total_count,
            SUM(wage) AS total_wage
        FROM DAILYHAZ
        GROUP BY workcd
    `;

    return data;
};

module.exports = {
    getDailyHazSummary
};