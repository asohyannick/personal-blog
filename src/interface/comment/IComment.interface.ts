import { Document, Types } from "mongoose";
export interface IComment extends Document {
 postId: Types.ObjectId;
 author: string;
 content: string;
 isApproved: boolean;
 date: Date;
}
