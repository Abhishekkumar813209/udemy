import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {buySubscription, getRazorPayKey} from "../controllers/paymentController.js";

const router = express.Router();


//Buy Subscription
router.route("/subscribe").get(isAuthenticated,buySubscription)

//verify payment and save reference in database
router.route("/paymentverification").post(isAuthenticated,buySubscription);

//Get Razorpay Key
router.route("/razorpaykey").get(getRazorPayKey);


export default router;