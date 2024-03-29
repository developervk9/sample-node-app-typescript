import * as winston from "winston";
import { TransformableInfo } from "logform";

const MESSAGE = Symbol.for("message");
const ignoreFormat = (logEntry: TransformableInfo) =>
    logEntry.ignoreLogs ? false : logEntry;
const jsonFormat = (logEntry: TransformableInfo) => {
    logEntry[MESSAGE] = JSON.stringify({ timestamp: new Date(), ...logEntry });
    return logEntry;
};

const [ignoreFormatWrapper, jsonFormatWrapper] = [ignoreFormat, jsonFormat].map(
    winston.format
);

interface ILogger {
    logger: ReturnType<typeof winston.createLogger> | null | undefined;
    getLogger(): ReturnType<typeof winston.createLogger>;
}

export const Logger: ILogger = {
    logger: null,
    getLogger() {
        if (!this.logger) {
            this.logger = winston.createLogger({
                transports: [new winston.transports.Console()],
                format: winston.format.combine(
                    ignoreFormatWrapper(),
                    jsonFormatWrapper(),
                    winston.format.prettyPrint()
                ),
            });
        }
        return this.logger;
    },
};
