import express from "express"
import { getDashboardStats,contact,courseRequest } from "../controllers/otherController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router()

//contact form 
router.route("/contact").post(contact);

//Request form 
router.route("/courserequest").post(courseRequest);

router.route('/admin/stats').get(isAuthenticated,authorizeAdmin,getDashboardStats);

export default router;