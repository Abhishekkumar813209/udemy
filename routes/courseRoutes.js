import express from "express";
const router = express.Router();

import { getAllCourse } from "../controllers/courseController.js";

//Get All Courses without lectures
router.route("/courses").get(getAllCourse);


export default router;