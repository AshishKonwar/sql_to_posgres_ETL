const mapSqlTypeToPg = (sqlType) => {

    const type = sqlType.toLowerCase();

    if (type.includes("int")) return "INTEGER";

    if (type.includes("bigint")) return "BIGINT";

    if (
        type.includes("varchar") ||
        type.includes("nvarchar") ||
        type.includes("text")
    ) {
        return "TEXT";
    }

    if (
        type.includes("datetime") ||
        type.includes("date")
    ) {
        return "TIMESTAMP";
    }

    if (type.includes("bit")) {
        return "BOOLEAN";
    }

    if (
        type.includes("decimal") ||
        type.includes("numeric") ||
        type.includes("money")
    ) {
        return "NUMERIC";
    }

    return "TEXT";
};

module.exports = {
    mapSqlTypeToPg
};