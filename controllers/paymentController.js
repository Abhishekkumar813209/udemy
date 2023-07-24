import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import User from "../models/User.js"
import ErrorHandler from "../utils/ErrorHandler.js";
import { instance } from "../server.js"
import crypto from "crypto"
import Payment from "../models/Payment.js"


export const buySubscription = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    if(user.role ===1) return next(new ErrorHandler("Admin Can't buy Subscription",401))

    //var instance = new Razorpay({ key_id :'YOUR_KEY',key_secret:'YOUR_SECRET'})
    const plan_id = process.env.PLAN_ID;
    console.log(plan_id)

    const subscription = await instance.subscriptions.create({
        plan_id,
        customer_notify:1,
        quantity:1,
        total_count:12,
    })

    user.subscription.id = subscription.id;
    user.subscription.status=subscription.status;

    await user.save()

    res.status(200).send({
        success:true,
        subscriptionId:subscription.id
    })
})


export const paymentVerification = catchAsyncError(async(req,res,next)=>{
    const {razorpay_signature , razorpay_payment_id , razorpay_subscription_id} = req.body;

    const user = await User.findById(req.user._id);

    const subscription_id = user.subscription.id;

    const generated_signature = crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(razorpay_payment_id + "|" + subscription_id,"utf-8").digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;
    
    if(!isAuthentic) return res.redirect(`${process.env.FRONTEND_URL}/paymentfailed`);
    // database comes here
    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id
    })

    user.subscription.status="active";

    await user.save();


   res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`)
})
    

export const getRazorPayKey = catchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        success:true,
        key:process.env.RAZORPAY_API_KEY
    })
}) 


export const cancelSubscription = catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
  
      const subscriptionId = user.subscription.id;
        let refund = false;
        
        await instance.subscriptions.cancel(subscriptionId);
  
    //   const payment = await Payment.findOne({
    //     razorpay_subscription_id: subscriptionId,
    //   });
  
    //   if (!payment) {
    //     throw new ErrorHandler("Payment not found", 404);
    //   }
  
    //   const gap = Date.now() - payment.createdAt;
  
    //   const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
  
    //   if (refundTime > gap) {
    //     // await instance.payments.refund(payment.razorpay_payment_id);
    //     refund = true;
    //   }
  
    //   await payment.deleteOne();
      user.subscription.id = undefined;
      user.subscription.status = undefined;
      await user.save();
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  });
  