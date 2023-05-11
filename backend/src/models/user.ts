import mongoose, { Document } from 'mongoose';

export interface User extends Document {
  username: string;
}

const messageSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<User>('User', messageSchema);
