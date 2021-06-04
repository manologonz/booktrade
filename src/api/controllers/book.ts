import Book from "../models/book";
import {ILeanBook, IBook, TBook} from "../models/types";
import {Request, Response, NextFunction} from "express";
import {checkErrors} from "../utils/helpers"
import {validationResult} from "express-validator";

export async function listBooks(req: Request, res: Response, next: NextFunction) {
    try {
        res.json({detail: "Not supporte yet"});
    } catch(err) {
        next(err);
    } 
}

export async function createBook(req: Request, res: Response, next: NextFunction) {
    try {
        checkErrors(validationResult(req));
        const data: TBook = {
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            pages: req.body.pages,
            price: req.body.price,
            lenguage: req.body.lenguage,
            quantity: req.body.quantity,
            published: new Date(req.body.published),
            category: req.body.category,
            isbn: req.body.isbn
        };
        console.log(data)
        if(req.body.subtitle) {
            data.subtitle = req.body.subtitle;
        }
        let book = new Book(data);
        book = await book.save();
        res.json(book);
    } catch(err) {
        next(err);
    }
}