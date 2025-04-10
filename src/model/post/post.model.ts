import mongoose, { Schema } from "mongoose";
import { IPost } from "../../interface/post/IPost.interface";
const postSchema: Schema = new Schema<IPost>({
 title:{
    type: String,
    trim: true,
    required: true,
 },
 content:{ 
    type: String,
    trim: true,
    required: true,
 },
 author:{
    type: String,
    trim: true,
    required: true,
 },
 tags:{
    type: [String],
    trim: true,
    required: true,
    default:[
        "https://cdn.mos.cms.futurecdn.net/Ajc3ezCTN4FGz2vF4LpQn9-1200-80.jpg"
    ],
 },
 category:{
    type: String,
    trim: true,
    required: true,
 },
 isPublishable: {
    type: Boolean,
    default: false,
 },
 views:{
    type: Number,
    default: 3,
 },
 imageURL:{
    type: String,
    trim: true,
    required: true,
 },
 excerpt:{
    type: String,
    trim: true,
    required: true,
},
 readingTiime:{
    type: Number,
    required: true,
    default: 3,
},
date:{
   type: Date,
   default: Date.now,
},
}, {timestamps: true});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
