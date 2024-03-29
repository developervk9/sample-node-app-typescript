const { check, validationResult } = require("express-validator");
import { Request, Response, NextFunction } from 'express';

import { RequestHandlerParams, ParamsDictionary } from 'express-serve-static-core';
import { Users } from '../models/users'

export const validate = (x: any): RequestHandlerParams<ParamsDictionary, any, any, Record<string, any>> => {
    switch (x) {
        case "login": {
            return [
                check("email")
                    .exists().withMessage('Email is required.')
                    .isEmail().withMessage('Invalid email format.')
                    .custom(async (value: any) => {
                        const existingUser = await Users.findOne({ email: value }).lean();
                        if (!existingUser) {
                            throw new Error('Invalid email.');
                        }
                        return true;
                    })
                    .bail(),
                check("password").bail().exists().withMessage("Password is required."),
            ];
        }
        case "signup": {
            return [
                check("name").bail().exists().withMessage("Name is required."),
                check("email")
                    .exists().withMessage('Email is required.')
                    .isEmail().withMessage('Invalid email format.')
                    .custom(async (value: any) => {
                        const existingUser = await Users.findOne({ email: value });
                        if (existingUser) {
                            throw new Error('Email already exists');
                        }
                        return true;
                    })
                    .bail(),
                check("password").bail().exists().withMessage("Password is required."),
            ];
        }
        default:
            return [];
    }
};
export async function catchError(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({ status: false, errors: errors.array() });
        return;
    } else {
        next();
    }
}