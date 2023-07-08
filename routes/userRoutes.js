import express from "express"
import {
    register,
    login,
    logout,
    getMyProfile,
    changePassword,
    forgetPassword,
    resetPassword
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

//ChangePassword 
router.route("/changepassword").put(isAuthenticated,changePassword);

//ForgotPassword
router.route("/forgetpassword").post(forgetPassword);

//Reset Password 
router.route("/resetpassword/:token").put(resetPassword);

export default router;