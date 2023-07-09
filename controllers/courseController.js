import Course from "../models/Course.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js"


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