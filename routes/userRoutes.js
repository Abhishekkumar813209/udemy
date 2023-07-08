import express from "express"
import {
    register,
    login,
    logout
} from "../controllers/userController.js"
const router = express.Router();

//Register Route
router.route("/register").post(register);

//Login Route
router.route("/login").post(login);

//Logout Route
router.route("/logout").get(logout)


export default router;