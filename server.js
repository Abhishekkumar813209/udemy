import app from "./app.js";


app.get("/",(req,res)=>{
    res.send("You are at home page")
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is started at port ${process.env.PORT}`)
})