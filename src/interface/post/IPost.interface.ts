import { Document } from "mongoose";
export interface IPost extends Document {
    title: string;
    content: string;
    author: string;
    tags: string[];
    category: string;
    isPublishable: boolean;
    views: number;
    imageURL: string;
    excerpt: string;
    readingTiime: number;
    date: Date;
}
