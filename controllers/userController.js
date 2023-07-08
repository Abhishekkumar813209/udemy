import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/User.js"
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncError(async(req,res,next) =>{
    const {name,email,password} = req.body;

    if(!email || !password || !name) return next (new ErrorHandler("please enter all field" , 400));

    let user = await User.findOne({email})
    if(user) return next(new ErrorHandler("user Already Exists",400));
    

    //Upload file on cloudinary
    


    user = await User.create({
        name,
        email,
        password
    })
    sendToken(res,user,"Registered Successfully")
})

export const login = catchAsyncError(async(req,res,next)=>{

})


export const logout = catchAsyncError(async(req,res,next)=>{

})
