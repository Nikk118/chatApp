import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"

const  userSchema= new Schema({
    email:{
        type:String,
        required:true,
        unique:true, 
    },
    username:{
        type:String,
        required:true,
        unique:true, 
    },
    password:{
        type:String,
        required:true,
        minlenght:6
    },
    profilePicture:{
        type:String,
        default:""
    }
    
},{timestamps:true})


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next(); // Skip hashing if password is not modified
        }

        if (!this.password) {
            throw new Error("Password is required");
        }

        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User=mongoose.model("User",userSchema)
