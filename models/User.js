import  mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            // required:true,
        },
        url:{
            type:String,
            // required:true
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

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
  };

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}




export default mongoose.model("User",userSchema);