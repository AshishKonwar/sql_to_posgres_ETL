const { connectMssql } = require("./config/mssql");

(async () => {
    await connectMssql();
})();