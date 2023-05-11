import mongoose, { Document, Schema } from 'mongoose';

export interface Chat extends Document {
  users: Schema.Types.ObjectId;
}

const chatSchema = new mongoose.Schema<Chat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "user" }]
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Chat>('Chat', chatSchema);
