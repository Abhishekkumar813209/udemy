import app from "./app.js";
import { connectDB } from "./config/database.js";


//database connection
connectDB()

app.get("/",(req,res)=>{
    res.send("Hello this is the homepage");
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is started at port ${process.env.PORT}`)
})