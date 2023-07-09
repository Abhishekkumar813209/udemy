import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";

//database connection
connectDB()

app.get("/",(req,res)=>{
    res.send("Hello this is the homepage");
})

cloudinary.v2.config({
    cloud_name: 'dkya9km8h', 
    api_key: '817693881242651', 
    api_secret: 'CQvBsRrw-QjG21tn-qUZM5n9uN8',
    secure: true
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is started at port ${process.env.PORT}`)
})