import * as express from "express";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import { Logger, DatabaseService } from "./services";
import { router } from "./routes";
const logger = Logger.getLogger();
const app = express.default();
const port = 4400;

app.use(compression.default());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors.default());
app.use('/api', router);
app.use(function (_req, res, _next) {
    res.status(404).send({ success: false, message: "Invalid Path" });
});


DatabaseService.connect((error) => {
    if (error) {
        logger.error({
            message: "Error connecting to database",
            error,
        });
        process.exit(1);
    }

    app.listen(port, () => {
        logger.info(`Listening on port ${port}...`);
    });
});

export default app;