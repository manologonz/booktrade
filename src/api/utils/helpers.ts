import {Response, NextFunction} from "express";
import {AuthRequest} from "../utils/types";
import {Result} from "express-validator";
import {HttpError} from "../utils/types";
import {FieldErrors} from "./types";
import User from "../models/user";
import {IUser, TUserTokenInfo} from "../models/types";
import * as jwt from "jsonwebtoken";

function getToken(req: AuthRequest): string {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.split(" ")[1]) {
        throw new HttpError("No authorization credentials found", 403);
    }
    return authHeader.split("")[1];
}


export function checkErrors(result: Result) {
    if(!result.isEmpty()) {
        const errors: FieldErrors = {};
        result.array().forEach(({param, msg}) => {
            if(errors.hasOwnProperty(param)) {
                errors[param] = [
                    ...errors[param],
                    msg
                ]
            } else {
                errors[param] = [msg];
            }
        });
        throw new HttpError("Validation error", 400, true, errors);
    }
}

export async function isAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const token = getToken(req);
        const key = <string>process.env.JWT_SECRET;
        const data = <TUserTokenInfo>jwt.verify(token, key);
        const user = await User.findOne({_id: data._id}, {__v: 0, password: 0}).lean<IUser>();
        req.user = user;
        next();
    } catch(err) {
        next(err);
    }
}

