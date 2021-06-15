import {connect, connection, ConnectOptions} from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import * as bcrypt from "bcryptjs";
import User from "../../api/models/user";
import {User as IUser, URole} from "../../api/models/types"
dotenv.config();

const url = process.env.MONGODB_URL || "";
const options = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true };

type IncompleteUser = {
    _id?: string,
    firstName?: string,
    lastName?: string
    email?: string
}

interface IUserWithId extends IUser {
    _id: string
}

// Function fetch the data from the user.data.json file
function getData(): IncompleteUser[] {
    const rawData: IncompleteUser[] = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "user.data.json"), "utf-8"));
    return rawData;
}

// Function adds the missing fields from the user data.
function validateUserData(data: IncompleteUser[]): IUserWithId[] {
    if(data.length < 10) throw new Error("You need at least 10 items");
    return data.map((obj, index) => {
        // The users before the 5 last in the data array are saved as CLIENT the rest are saved as SELLER_CLIENT 
        const role = index > (data.length - 1) - 5 ? URole.SELLER_CLIENT: URole.CLIENT;
        return completeUserData(obj, index, role);
    });
}

// validates if the values are correct.
function completeUserData(user: IncompleteUser, index: number, role: URole): IUserWithId {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const _password = process.env.USER_TEST_PASSWORD || "securepassword123";
    if(!(!!user._id) || user._id === "" || typeof user._id !== "string") {
        throw new Error(`array[${index}] user _id is missing or empty`);
    }
    if(!(!!user.firstName) || user.firstName === "" || typeof user.firstName !== "string") {
        throw new Error(`array[${index}] user firstName is missing or empty`);
    }
    if(!(!!user.lastName) || user.lastName === "" || typeof user.lastName !== "string") {
        throw new Error(`array[${index}] user lastName is missing or empty`);
    }
    if(!(!!user.email) || user.email === "" || typeof user.email !== "string" || !emailRegex.test(user.email)) {
        throw new Error(`array[${index}] user email is missing or empty`);
    }
    const password = bcrypt.hashSync(_password, 12);
    return {
        _id: user._id,
        username: user.firstName + index,
        firstName: user.firstName,
        lastName: user.lastName,
        password,
        email: user.email,
        role,
    }
}

// This function fetch the data and validate the fields.
function getUserData(): IUserWithId[] {
    const data = getData();
    console.log("getting data...");
    return validateUserData(data);
}

// Main function
(async function (url: string, options: ConnectOptions) {
    try {
        connect(url, options) // mongoose
        const data = getUserData();
        let user: IUserWithId;
        console.log("Inserting data...");
        for(let i = 0; i < data.length; i++) {
            user = data[i];
            await User.findOneAndUpdate({_id: user._id}, user, {upsert: true, useFindAndModify: false});
        }
    } catch(err) {
        console.log(err);
    } finally { // whatever happends, it closes the connection to de db.
        await connection.close(); // mongoose

    }
})(url, options);