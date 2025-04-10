import mongoose, { Schema } from "mongoose";
import { IComment } from "../../interface/comment/IComment.interface";
const commentSchema: Schema =  new Schema<IComment>({
postId:{
    type:Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
},
author:{
    type: String,
    trim: true,
    required: true,
},
content:{
    type: String,
    trim: true,
    required: true,
},
isApproved: {
    type: Boolean,
    default: false,
},
date:{
    type: Date,
    default: Date.now
},
}, {timestamps: true});
const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
