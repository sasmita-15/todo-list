import mongoose,{ Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    todo: [
        {
            type: mongoose.Types.ObjectId,
            ref: "List"
        }
    ],
    
    password: {
        type: String,
        required: true,     
    },
    refershToken: {
        type: String,
    },

},{
    timestamps: true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 2)
    next()

})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function() {
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {  
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            
        }

    )
    
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {  
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            
        }

    )
    
}
export const User = mongoose.model("User",userSchema)