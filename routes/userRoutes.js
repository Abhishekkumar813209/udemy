import express from "express"
import {
    register,
    login,
    logout,
    getMyProfile
} from "../controllers/userController.js"
import {isAuthenticated} from "../middlewares/auth.js"
const router = express.Router();

//Register Route
router.route("/register").post(register);

//Login Route
router.route("/login").post(login);

//Logout Route
router.route("/logout").get(logout)


//Get my profile 
router.route("/me").get(isAuthenticated,getMyProfile);

export default router;