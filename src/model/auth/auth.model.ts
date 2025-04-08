import { IAuth } from "../../interface/auth/IAuth";
import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';
const authSchema: Schema = new Schema<IAuth>({
 username:{
    type: String,
    trim: true,
 },
 password:{
    type: String,
    required: true,
 },
 isAdmin:{
    type: Boolean,
    default: false,
 },
 refreshToken:{
    type: String,
    trim: true,
 },
}, {timestamps: true});
authSchema.pre<IAuth>('save', async function(next) {
if (!this.isModified('password')) return next();
 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password, salt);
 next();
})
const Auth = mongoose.model<IAuth>('Auth', authSchema);
export default Auth;
