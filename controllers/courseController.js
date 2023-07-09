import Course from "../models/Course.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/ErrorHandler.js";


export const getAllCourse = catchAsyncError(async(req,res,next)=>{

    const keyword = req.query.keyword || " "
    const category = req.query.category || " "

    const courses = await Course.find({
        title:{
            $regex:keyword,
            $options:"i"
        },
        category:{
            $regex:category,
            $options:"i"
        }
    }).select("-lectures");
    res.status(200).json({
        success:true,
        courses,
    })
})

export const createCourse = catchAsyncError(async(req,res,next)=>{
    const {title,description,category,createdBy} = req.body;
    console.log("Request body:" , req.body);

    if(!title || !description || !category || !createdBy){
        console.log("Missing fields in request");
        return next(new ErrorHandler("Please enter add all fields" ,400))
    }

    try{
        const newCourse = await Course.create({
            title,
            description,
            category,
            createdBy
        })

        console.log("New Course Created",newCourse);

        res.status(201).json({
            success:true,
            message:"Course Created Successfully . You can add lectures now"
        })
    } catch(err){
        console.log(err)
        return next(new ErrorHandler("Failed to create course"))
    }
})