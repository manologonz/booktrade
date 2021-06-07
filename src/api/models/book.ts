import {Schema, model} from "mongoose";
import { BookDocument, BookModel } from "./types";

const bookSchema = new Schema<BookDocument, BookModel>({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: true
    },
    author: [String],
    publisher: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    lenguage: {
        type: String,
        required: true
    },
    published: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    seller: {
        _id: Schema.Types.ObjectId,
        firstName: String,
        lastName: String
    } 
});

bookSchema.index({title: 1});
bookSchema.index({publisher: 1});
bookSchema.index({price: 1});
bookSchema.index({lenguage: 1});
bookSchema.index({publshed: 1});

export default model<BookDocument, BookModel>("Book", bookSchema);