import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Staff = 'staff',
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: Role;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Role, default: Role.Staff },
});

export default mongoose.model<IUser>('User', userSchema);
