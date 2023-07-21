import jwt from "jsonwebtoken"
import { catchAsyncError } from "./catchAsyncError.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import User from "../models/User.js";


export const isAuthenticated = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token) return next (new ErrorHandler("Not Logged In",401));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        next();
    } catch (error) {
        // Handle the JWT verification error here4
        console.log(error)
        console.error('JWT Verification Error:', error.message);
        next(new ErrorHandler("Invalid Token"));
    }
})

export const authorizeAdmin = (req,res,next) =>{
    if(req.user.role!==1)
    return next(
        new ErrorHandler(
            `${req.user.role} is not allowed to access this Route` , 403
        )
    );
    next();
}

export const authorizeSubscribers = (req, res, next) => {
    if (req.user.subscription.status !== "active" && req.user.role !== 1) {
      return next(new ErrorHandler("Only Subscribers can access this course"));
    }
    next();
}