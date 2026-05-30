const prisma = require("../../../../prisma/prismaClient");
const { convertPgResult } = require("../../../utils/typeConverter");

const getWorkSummary = async () => {
    const data = await prisma.$queryRaw`
        SELECT
            a."WORKCD" AS workcd,
            b."WORKDESP" AS workdesp,
            COUNT(a."WORKCD") AS total_count,
            SUM(a."WAGE") AS total_wage
        FROM "DAILYHAZ" a
        INNER JOIN "WORKMST" b
            ON a."WORKCD" = b."WORKCD"
        GROUP BY
            a."WORKCD",
            b."WORKDESP"
        ORDER BY
            a."WORKCD"
    `;

    return convertPgResult(data);
};

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
    getWorkSummary,
    getDailyHazSummary
};