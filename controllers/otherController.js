import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";
import {Stats} from "../models/Stats.js"

export const contact = catchAsyncError(async(req,res,next) =>{
   
    const {name,email,message} = req.body;
    if(!name || !email || !message) return next(new ErrorHandler("All fields are mandatory",400))
    const to = process.env.MY_MAIL
    const subject = "Contact from CourseBundler";
    const text = `I am ${name} and my Email is ${email} .\n${message}`
    await sendEmail(to,subject,text)
    res.status(200).json({
        success:true,
        message:"Your message has been sent" 
    })
})

export const courseRequest = catchAsyncError(async(req,res,next) =>{
    const {name,email,course} = req.body;
    if(!name || !email || !course) return next(new ErrorHandler("All fields are mandatory",400))
    const to = process.env.MY_MAIL
    const subject = "Requesting for a course on  CourseBundler";
    const text = `I am ${name} and my Email is ${email} .\n${course}`

    await sendEmail(to,subject,text)

    res.status(200).json({
        success:true,
        message:"Your Request has been sent"
    })
})

export const getDashboardStats=catchAsyncError(async(req,res,next)=>{

    const stats=await Stats.find({

    }).sort({
        createdAt:'desc'
    }).limit(12)

    const statsData= [];

    for(let i = 0;i<stats.length;i++){
        statsData.push(stats[i])
    }

    const requiredSize = 12-stats.length;

    for (let i = 0;i<requiredSize;i++){
        statsData.unshift({
            users:0,
            subscription:0,
            views:0
        })
    }

    const usersCount = statsData[11].users;
    const subscriptionCount=statsData[11].subscription;
    const viewsCount = statsData[11].views;

    let usersPercentage = 0,
    viewsPercentage=0,
    subscriptionPercentage = 0

    let usersProfit = true,
    viewsProfit = true,
    subscriptionProfit=true;

    if(statsData[10].users===0) usersPercentage = usersCount*100;


    res.status(200).json({
        success:true,
        stats:statsData,
        usersCount,
        subscriptionCount,
        viewsCount
    });

})