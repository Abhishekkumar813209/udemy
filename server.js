import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
import NodeCron from "node-cron"
import { Stats } from "./models/Stats.js";


//database connection
connectDB();

app.get("/",(req,res)=>{
    res.send('Hello this is the homepage <a href="http://localhost:3000"> Click here</a> ');
})

cloudinary.v2.config({
    cloud_name: 'dkya9km8h', 
    api_key: '817693881242651', 
    api_secret: 'CQvBsRrw-QjG21tn-qUZM5n9uN8',
    secure: true
})

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})

NodeCron.schedule("0 0 0 1 * *", async()=>{
   try{
    await Stats.create({});
   }catch(error){
    console.log(error);
   }
})

    // const temp= async()=>{
    //     await Stats.create({});
    // }
    // temp();


app.listen(process.env.PORT,()=>{
    console.log(`Server is started at port ${process.env.PORT}`)
})