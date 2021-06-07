import {Request, Response, NextFunction} from "express";
import User from "../models/user";
import AuthToken from "../models/authToken";
import Book from "../models/book";
import {IUserTokenInfo} from "../models/types";
import * as jwt from "jsonwebtoken";
import {HttpError} from "../utils/types";
import {ObjectIdValidator} from "../utils/helpers";
import {ObjectId} from "mongoose";

function getTokenFromHeader(req: Request): string {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.split(" ")[1]) {
        throw new HttpError("No authorization credentials found", 403);
    }
    return authHeader.split(" ")[1];
}

async function validateToken(data: IUserTokenInfo, token:string): Promise<boolean> {
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
        const key = process.env.JWT_SECRET || "secret";
        const data = <IUserTokenInfo>jwt.verify(token, key); // throw an error if the token is not valid.
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

export async function isBookSeller(req: Request, res: Response, next: NextFunction) {
    const objectIdValidator = new ObjectIdValidator();
    try {
        const _id = req.params.bookId;
        objectIdValidator.single(_id);
        const book = await Book.findOne({_id: _id}).lean();
        if(!book) {
            throw new HttpError("A Book with that id could not be found");
        }
        if(req.user?._id === book.seller._id) {
            throw new HttpError("Not Authorized", 403);
        }
        next();
    } catch (err) {
        next(err);
    }
}