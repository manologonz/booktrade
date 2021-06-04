import {Schema, model} from "mongoose";
import {IBook} from "./types";

const bookSchema = new Schema({
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
    category: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    }
});

export default model<IBook>("Book", bookSchema);