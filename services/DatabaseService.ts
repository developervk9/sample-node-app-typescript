import { Logger } from "./LoggerService";
const logger = Logger.getLogger();
const mongoose = require("mongoose");

export const DatabaseService = {
    connect(callback: (callbackMessage?: string) => void) {
        mongoose
            .connect(
                "mongodb+srv://safvan555:MJVWBhekub47P88T@cluster0.i0byfcz.mongodb.net/pesto",
                {
                    useNewUrlParser: true,
                }
            )
            .then(() => {
                logger.info("Connection has been established successfully.");
                callback();
            })
            .catch((err: any) => {
                callback(err);
            });
    },
};
