const prisma = require("../../../../prisma/prismaClient");
const { convertPgResult } = require("../../../utils/typeConverter");

const getDailyHazSummary = async () => {
    const data = await prisma.$queryRaw`
        SELECT
            "WORKCD",
             COUNT("WORKCD") AS total_count,
            SUM("WAGE") AS total_wage
        FROM "DAILYHAZ"
        GROUP BY "WORKCD"
    `;

    return convertPgResult(data);
};

module.exports = {
    getDailyHazSummary
};