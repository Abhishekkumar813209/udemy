import Course from "../models/Course.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from 'cloudinary';

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

    const file = req.file;
    const fileUri = getDataUri(file);
    console.log("File URI:",fileUri);

    try{

        const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
            folder:'images',timeout:60000
        });
        console.log("Cloudinary response:",mycloud);


        const newCourse = await Course.create({
            title,
            description,
            category,
            createdBy,
            poster:{
                public_id:mycloud.public_id,
                url:mycloud.secure_url
            },
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

//Get course Lectures
export const getCourseLectures = catchAsyncError(async(req,res,next)=>{
    const course = await Course.findById(req.params.id);

    if(!course) return next(new ErrorHandler("Course not found",404));

    course.views +=1;
    
    await course.save();

    res.status(200).json({
        success:true,
        lectures:course.lectures,
    })

})

export const addLecture = catchAsyncError(async(req,res,next) =>{
    const{id} = req.params;
    const {title,description} = req.body;
    

    const course = await Course.findById(id);
    if(!course) return next (new ErrorHandler("Course not found",404));

    const file = req.file;
    const fileUri = getDataUri(file)
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
        resource_type:"video",
    })
    
    course.lectures.push({
        title,
        description,
        video:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        }
    });


    course.numOfVideos = course.lectures.length;
    course.views +=1;

    await course.save();

    res.status(200).json({
        success:true,
        message:"Lecture added in course"
    })
})

export const deleteCourse = catchAsyncError(async(req,res,next)=>{
    console.log("Inside createCourse");

    const {id} = req.params;

    const course = await Course.findById(id);

    if(!course){
        return next(new ErrorHandler("Course Not found",404));
    }
    
    if(course.poster && course.poster.public_id){
        await cloudinary.v2.uploader.destroy(course.poster.public_id);
    }

    for(let i=0;i<course.lectures.length ; i++){
        course.lecture = course.lectures[i];
        if(lecture.video&& lecture.video.public_id){
            await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
                resource_type:"Video"
            });
        }
    }

    await course.deleteOne({_id:id});
    res.status(200).json({
        success:true,
        message:"Course deleted Successfully"
    })
})

export const deleteLecture = catchAsyncError(async(req,res,next)=>{
    const {courseId,lectureId} = req.query;

    const course = await Course.findById(courseId);

    if(!course){
        return next(new ErrorHandler("Course not found",404))
    }

    const lecture = course.lectures.find((item)=>{
        if(item._id.toString() ===lectureId.toString()) return item;
    });

    await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
        resource_type:"video"
    })

    course.lectures = course.lectures.filter(item=>{
        if(item._id.toString()!== lectureId.toString()) return item;
    })

    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(200).json({
        success:true,
        message:"Lecture Deleted Successfully"
    })

})

