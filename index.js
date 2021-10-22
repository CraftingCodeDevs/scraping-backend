const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const timeout = require("connect-timeout");

require('dotenv').config();

const {dbConnection} = require('./src/database/db-connection');
const igss = require("./src/api/igss/network");
const user = require("./src/api/user/network");
const auth = require("./src/api/auth/network");

const app = express();

(async function connectDb() {
    await dbConnection();
})();

//Middlewares
app.use(timeout("160s", {
    respond: true,
    error: {
        status: 504,
        message: "Request timed out"
    }
}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(haltOnTimeout);
//Rutas
app.use("/api/igss", igss);
app.use("/api/user", user);
app.use("/api/auth", auth);


const server = app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});

server.timeout = 1000 * 60 * 60;

function haltOnTimeout(req, res, next) {
    if (!req.timedout) next();
}