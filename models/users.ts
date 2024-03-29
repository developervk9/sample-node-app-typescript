import { Schema, Document, model } from 'mongoose';
interface UserDocument extends Document {
    name: string | null;
    email: string;
    password: string;
}
const usersSchema = new Schema<UserDocument>({
    name: { type: String, default: null },
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });
export const Users = model<UserDocument>('users', usersSchema);
