import {Schema, model} from "mongoose";
import { BookDocument, BookModel } from "./types";

const bookSchema = new Schema<BookDocument, BookModel>({
    title: {
        type: String,
        required: true,
        es_indexed: true
    },
    subtitle: {
        type: String,
        required: false,
        es_indexed: true
    },
    quantity: {
        type: Number,
        required: true
    },
    author: [String],
    publisher: {
        type: String,
        required: true,
        es_indexed: true
    },
    pages: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        es_indexed: true
    },
    lenguage: {
        type: String,
        required: true,
        es_indexed: true
    },
    published: {
        type: Date,
        required: true,
        es_indexed: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        es_indexed: true
    },
    isbn: {
        type: String,
        required: true,
        es_indexed: true
    },
    seller: {
        _id: Schema.Types.ObjectId,
        firstName: String,
        lastName: String
    }
});


export default model<BookDocument, BookModel>("Book", bookSchema);
