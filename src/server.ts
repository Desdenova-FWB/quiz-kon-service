import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import questionRouts from "./routes/Question";
import answerRouts from "./routes/Answer";
import userResult from "./routes/UserResult";

const router = express();

/** Connect to mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
        Logging.info(`Connected to mongo-db`);
        StartServer();
    })
    .catch((error) => {
        Logging.info(`UNABLE to connected to mongo-db`);
        Logging.error(error);
    });
/** start only if db connects  */
const StartServer = () => {
    router.use((req, res, next) => {
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on("finish", () => {
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        if (req.method == "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }

        next();
    });

    router.use("/question", questionRouts);

    router.use("/answer", answerRouts);

    router.use("/userResult", userResult);

    /** HEALTHCHECK */

    router.get("/ping", (req, res, next) => res.status(200).json({ message: "pong" }));

    /** error handeling */
    router.use((req, res, next) => {
        const error = new Error("not found");
        Logging.error(error);
        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
