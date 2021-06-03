import app from "./api/app";
import mongoose from "mongoose";

const port = process.env.PORT || 5000;
const url = <string>process.env.MONGODB_URL;
const options = { useUnifiedTopology: true, useNewUrlParser: true };
mongoose.connect(url, options).then((result) => {
    app.listen(port, () => {
        console.log("Server listening on: http://localhost:"+port);
    });
    
}).catch(err => console.log(err));
