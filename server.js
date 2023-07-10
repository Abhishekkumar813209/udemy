import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";


//database connection
connectDB()

app.get("/",(req,res)=>{
    res.send("Hello this is the homepage");
})

// const socket = new net.Socket();

// socket.setTimeout(30000);

// socket.on('timeout',()=>{
//     console.log('Socket connection timed out')
//     socket.destroy();
// })

// socket.connect(4000,'localhost',()=>{
//     console.log('Socket Connected')
// })


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

app.listen(process.env.PORT,()=>{
    console.log(`Server is started at port ${process.env.PORT}`)
})