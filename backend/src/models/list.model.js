import mongoose,{ Schema } from "mongoose";
import { User } from "./user.models.js";

const listSchema = new Schema({
    todo: {
        type: String,
        required: true,

    },
    userId : {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    description: {
        type: String,

    },
    workImage: {
        type: String,  //cloudinary url
    },
    status:{
        type: String,
    },
    date: {
        type: String,
        required: true
    }
    
},{timestamps: true})

export const List = mongoose.model("List",listSchema)