import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//dotenv configuration
dotenv.config({
    path:"./config/config.env"
})

//express usage
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}))
app.use(cookieParser());

//Importing Routes
import user from "./routes/userRoutes.js"
import course from "./routes/courseRoutes.js"
import payment from "./routes/paymentRoutes.js"

app.use("/api/v1",user);
app.use("/api/v1",course);
app.use("/api/v1",payment);

export default app;