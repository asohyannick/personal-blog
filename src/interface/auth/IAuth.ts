import { Document } from "mongoose";
export interface IAuth extends  Document {
    username: string;
    password: string;
    isAdmin: boolean;
    refreshToken: string;
}
