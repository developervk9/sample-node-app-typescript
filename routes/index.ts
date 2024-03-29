import * as express from "express";

import * as userController from "../controllers/users";
import { validate, catchError } from "../middleware/validator"

const router = express.Router();

router.post("/signup", validate("signup"), catchError as express.RequestHandler, userController.signUp);
router.post("/login", validate("login"), userController.login);


export { router };

