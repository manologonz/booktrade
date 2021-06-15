import app from "./api/app";
import mongoose from "mongoose";

const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URL || "";
const options = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };
mongoose.connect(url, options).then((result) => {
    app.listen(port, () => {
        console.log("listening on: http://localhost:"+port);
    });
    
}).catch(err => console.log(err));
