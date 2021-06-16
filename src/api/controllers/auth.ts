import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {checkErrors} from "../utils/helpers";
import User from "../models/user";
import AuthToken from "../models/authToken";
import {User as IUser, UserDocument, UserLeanDocument, IUserTokenInfo, URole} from "../models/types";
import * as jwt from "jsonwebtoken";
import * as bycript from "bcryptjs";
import { HttpError } from "../utils/types";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        checkErrors(validationResult(req));
        const data: IUser = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bycript.hash(req.body.password, 12),
            role: req.body.role
        }
        let user = new User(data);
        user = await user.save();
        res.json({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: URole[user.role]
        });
    } catch(err) {
        next(err);
    }
}

async function validateEmailAndPassword(username: string, password: string): Promise<UserDocument> {
    const user = await User.findOne({username});
    if(!user) throw new HttpError("username or email incorrect", 400);
    const isValidPassword = await bycript.compare(password, <string>user.password);
    if(!isValidPassword) throw new HttpError("username or email incorrect", 400);
    return user;
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        checkErrors(validationResult(req));
        const user = await validateEmailAndPassword(req.body.username, req.body.password);
        const tokenInfo: IUserTokenInfo = {
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.getRole()
        }
        const token = jwt.sign(tokenInfo, <string>process.env.JWT_SECRET);
        await AuthToken.deleteMany({user: <any>user._id});
        const newToken = new AuthToken({
            user: user._id,
            token
        });
        await newToken.save();
        res.json({user: tokenInfo,token});
    } catch(err) {
        next(err);
    }
}
