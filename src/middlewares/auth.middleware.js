import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

// ye middleware sirf verify karega ki user hai ya nahi hai.
export const verifyJWT = asyncHandler(async(req, _, next)=>{
    try {
        // 1. token ka access kese loge ? -> req ke pass cookies ka access hai (req ke pass cookies ka access aaya kese? -> aap ne hi toh diya hai app.js me "app.use(cookieParser())" )
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        // 2. agr token hai to hume JWT use karke puchna padega ki ye token sahi hai ya nahi hai, or is token me kya kya info. hai
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401 , "Invalid access Token")
        }
        req.user = user;
        next() 
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})