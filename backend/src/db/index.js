import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB=async()=>{
    try {
        const connnectionInstant =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n connnection!!!!!!! ${connnectionInstant.connection.host}`);
        // console.log(` this is connection string: ${process.env.MONGODB_URI}`)
    } catch (error) {
        console.log("error: ",error);
        process.exit(1)
    }
}

export default connectDB