const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/api",
    require("./src/modules/jkb/routes/migration.routes")
);

app.use(
    "/api",
    require("./src/modules/jkb/routes/teaworkers.routes")
);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
