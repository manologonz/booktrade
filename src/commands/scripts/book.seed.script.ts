import * as mongoose from "mongoose";
import User from "../../api/models/user";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_ULR || "";
const options = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };

await (async function (url: string, options: mongoose.ConnectOptions) {
    try {
        await mongoose.connect(url, options);
        await mongoose.connection.close();
    } catch(err) {
        console.log(err);
        mongoose.connection.close();
    }
})(url, options);