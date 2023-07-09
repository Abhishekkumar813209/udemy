import express from "express";
const router = express.Router();

import { getAllCourse,
         createCourse 
       } from "../controllers/courseController.js";
import { isAuthenticated,authorizeAdmin } from "../middlewares/auth.js";

//Get All Courses without lectures
router.route("/courses").get(getAllCourse);


//Create new Course only admin
router.route("/createcourse").post(isAuthenticated,authorizeAdmin,createCourse);

export default router;