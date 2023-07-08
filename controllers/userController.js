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
    const {email,password} = req.body;

    if(!email || !password) return next(new ErrorHandler("Please enter all field" , 400));
    const user = await User.findOne({email}).select("+password")

    if(!user) return next(new ErrorHandler("Incorrect Email or Password" , 401));

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return next(new ErrorHandler("Incorrect Email or Password",401))

    sendToken(res,user,`Welcome Back , ${user.name}`,200);
})


export const logout = catchAsyncError(async(req,res,next)=>{
        res.status(200).cookie("token",null,{
            expires:new Date(Date.now()),
        }).json({
            success:true,
            message:"logout Successfully"
        })
})


export const getMyProfile = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success:true,
        user
    })
})

export const changePassword = catchAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter all fields",400));

    const user = await User.findById(req.user._id).select("+password")
    const isMatch = await user.comparePassword(oldPassword);
    if(!isMatch) return next(new ErrorHandler("Incorrect Old Password",400));

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success:true,
        message:"Password Changed Successfully"
    })
})

