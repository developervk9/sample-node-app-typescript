import { Request, Response } from 'express';
import * as pbkdf2 from "pbkdf2";
import * as jwt from 'jsonwebtoken'
import { Users } from '../models/users'
import { config } from '../configs';
import { UserDocument } from '../interfaces/users'
export async function signUp(req: Request, res: Response): Promise<void> {
    var password = pbkdf2.pbkdf2Sync(
        req.body.password,
        "salt",
        1,
        32,
        "sha512"
    );
    let obj = { ...req.body, password: password };
    new Users(obj).save();
    res.status(200).send({
        status: true,
        message: "SignUp Successfully.",
    });
}
export async function login(req: Request, res: Response): Promise<void> {
    const password = pbkdf2.pbkdf2Sync(
        req.body.password,
        "salt",
        1,
        32,
        "sha512"
    );
    let existingUser: UserDocument | null = await Users.findOne({ email: req.body.email }).lean();
    if (existingUser && (existingUser.password.toString() !== password.toString())) {
        res.status(400).send({
            status: false,
            message: "Wrong password.",
        });
    }
    delete (existingUser as any).password;
    const token = await jwt.sign(existingUser!, config.JWTSECRET_KEY);
    res.status(200).send({ status: true, token: token });
    return;
}
