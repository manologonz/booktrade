import {Schema, model} from "mongoose";
import {IAuthToken} from "./types";

const authTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        requried: true
    }
});

export default model<IAuthToken>("AuthToken", authTokenSchema);