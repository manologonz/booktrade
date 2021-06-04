import {Request, Response, NextFunction} from "express";
import User from "../models/user";
import AuthToken from "../models/authToken";
import {TUserTokenInfo} from "../models/types";
import * as jwt from "jsonwebtoken";
import {HttpError} from "../utils/types";

function getTokenFromHeader(req: Request): string {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.split(" ")[1]) {
        throw new HttpError("No authorization credentials found", 403);
    }
    return authHeader.split(" ")[1];
}

async function validateToken(data: TUserTokenInfo, token:string): Promise<boolean> {
    const validToken = await AuthToken.findOne({user: data._id}); // gets the stored token.
    if(validToken) {
        if(validToken.user.toString() === data._id.toString() && validToken.token === token) {
            return true; // returns true if is the stored token from the correct user
        }
    }
    return false; // returns false if no document found.
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getTokenFromHeader(req);
        const key = <string>process.env.JWT_SECRET;
        const data = <TUserTokenInfo>jwt.verify(token, key); // throw an error if the token is not valid.
        const isValidToken = await validateToken(data, token); // verifies that the token is valid within the system
        if(!isValidToken) {
            throw new Error("No valid token"); // thorw a generic error;
        }
        // add user to the request parameter.
        const user = await User.findOne({_id: data._id}, {__v: 0, password: 0}).lean();
        req.user = user;
        next();
    } catch(err) {
        // for any tirggered error in the isAuthenticated method
        // it passes to the handleError middleware a general 
        // "NotAuthorized" error.
        next(new HttpError("Not Authorized", 403));
    }
}