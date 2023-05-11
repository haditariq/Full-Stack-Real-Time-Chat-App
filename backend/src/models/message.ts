import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
  text: string;
  sentBy: Schema.Types.ObjectId;
  chat_id: Schema.Types.ObjectId;
}

const messageSchema = new mongoose.Schema<Message>(
  {
    text: { type: String, required: true },
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
    chat_id: { type: Schema.Types.ObjectId, ref: "Chat" }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Message>('Message', messageSchema);
