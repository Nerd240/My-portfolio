import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactMessageDoc extends Document {
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessageDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
      index: true,
    },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ContactMessageModel: Model<IContactMessageDoc> =
  mongoose.models.ContactMessage || mongoose.model<IContactMessageDoc>('ContactMessage', ContactMessageSchema);
