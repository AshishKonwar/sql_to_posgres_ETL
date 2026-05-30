/**
 * Converts PostgreSQL raw query result types to JSON-safe JavaScript types
 * Handles all common type mismatches when migrating from MSSQL to PostgreSQL
 */

const convertValue = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    // BigInt → Number (PostgreSQL COUNT, SUM on integers)
    if (typeof value === "bigint") {
        return Number(value);
    }

    // Decimal/Numeric → Float (Prisma returns these as Decimal objects)
    if (value?.constructor?.name === "Decimal") {
        return parseFloat(value.toString());
    }

    // Date → ISO String
    if (value instanceof Date) {
        return value.toISOString();
    }

    // Buffer/Bytes → Base64 String
    if (Buffer.isBuffer(value)) {
        return value.toString("base64");
    }

    // Boolean (PostgreSQL uses true/false, MSSQL uses 1/0)
    if (typeof value === "boolean") {
        return value;
    }

    return value;
};

const convertRow = (row) => {
    const converted = {};
    for (const [key, value] of Object.entries(row)) {
        converted[key] = convertValue(value);
    }
    return converted;
};

/**
 * Main converter — handles single object or array of objects
 * Usage: convertPgResult(data)
 */
const convertPgResult = (data) => {
    if (Array.isArray(data)) {
        return data.map(convertRow);
    }
    if (data && typeof data === "object") {
        return convertRow(data);
    }
    return data;
};

module.exports = { convertPgResult };