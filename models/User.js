import  mongoose from "mongoose"
import validator from "validator"
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,"minLength should be 6"],
        minLength:[6,"password must be at least 6 characters long"]   
    },
    role:{
        type:Number,
        enum:[0,1],
        default:0
    },
    subscription:{
        id:String,
        status:String
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        },
    },
    playlist:[
        {
            course:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Course",
            },
            poster:String,
        },
    ],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})


export default mongoose.model("User",userSchema);