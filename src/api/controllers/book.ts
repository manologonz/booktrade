import Book from "../models/book";
import {BookDocument, Book as IBook} from "../models/types";
import {Request, Response, NextFunction} from "express";
import {checkErrors} from "../utils/helpers"
import {validationResult} from "express-validator";
import { HttpError, PaginatedResponse} from "../utils/types";
import {hasNextPages} from "express-paginate";
import {ObjectIdValidator} from "../utils/helpers";
export async function listBooks(req: Request, res: Response, next: NextFunction) {
    try {
        // pagination
        const limit = parseInt(<string>req.query.limit, 10) || 10;
        const skip = <number>req.skip || 0;
        const page = parseInt(<string>req.query.page, 10) || 1;
        const count = await Book.find({}).countDocuments({});
        const pageCount = Math.ceil(count / <number>limit);
        // sorting and result query
        const _sort = <string>req.query.sort || "title";
        const result = await Book.find({}).limit(limit).skip(skip).sort(_sort);
        const next = hasNextPages(req)(pageCount) 
        ? `${req.protocol}://${req.get("host")}/api/book?page=${page + 1}` : false;
        const data: PaginatedResponse = {
            next,
            count,
            result
        }
        res.json(data);
    } catch(err) {
        next(err);
    } 
}

export async function createBook(req: Request, res: Response, next: NextFunction) {
    try {
        checkErrors(validationResult(req));
        if(!req.user) throw new HttpError("Not Authorized", 403);
        const data: IBook = {
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            pages: req.body.pages,
            price: req.body.price,
            lenguage: req.body.lenguage,
            quantity: req.body.quantity,
            published: new Date(req.body.published),
            category: req.body.category,
            isbn: req.body.isbn,
            description: req.body.description,
            seller: {
                _id: req.user._id,
                firstName: req.user?.firstName,
                lastName: req.user?.lastName
            }
        };
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


export async function updateBook(req: Request, res: Response, next: NextFunction) {
    try {
        const _id = req.params.bookId;
        checkErrors(validationResult(req));
        const book = await Book.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    title: req.body.title,
                    author: req.body.author,
                    publisher: req.body.publisher,
                    pages: req.body.pages,
                    price: req.body.price,
                    lenguage: req.body.lenguage,
                    quantity: req.body.quantity,
                    published: new Date(req.body.published),
                    category: req.body.category,
                    isbn: req.body.isbn,
                },
            },
            {new: true, useFindAndModify: false}
        );
        if(!book) {
            throw new HttpError("A Book with this id could not be found");
        }
        res.json({book});
    } catch (err) {
        next(err);
    }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
        const _id = req.params.bookId;
        const objIdValidator = new ObjectIdValidator();
        objIdValidator.single(_id);
        const book = await Book.findOne({_id}).lean();
        if(!book) throw new HttpError("A Book with this id could not be found");
        await Book.findOneAndDelete({_id});
        res.status(204).json({});
    } catch (err) {
        next(err);
    }
}