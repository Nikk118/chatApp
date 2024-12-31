import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const verifyJWT=asyncHandler(async(req,res,next)=>{
    
        const token=req.cookies?.jwt
    
        if(!token){
            return res.status(401).json({message:"unauthorized"})
        }

        const decode=  jwt.verify(token,process.env.JWT_SECRET)

        if (!decode) {
            return res.status(401).json({message:"unauthorized"})
            
        }

        const user= await User.findById(decode.userId).select("-password")

        if (!user) {
            return res.status(401).json({message:"unauthorized"})
            
        }

        req.user=user

        next()
    


})

export {
    verifyJWT
}