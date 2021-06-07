import User from "../models/user";
import {Request, Response, NextFunction} from "express";

export async function listUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const _search = <string>req.query.search || "";
        const _sort = <string>req.query.sort || "name"
        const search = _search && _search !== "" ? {$text: {$search: `${_search}`}} : {};
        const limit = parseInt(<string>req.query.limit, 10) || 10;
        const skip = <number>req.skip || 0;
        const result = await User.find(search).limit(limit).skip(skip).sort(_sort).lean();
        res.json({result});
    } catch (err) {
        next(err);
    }
}