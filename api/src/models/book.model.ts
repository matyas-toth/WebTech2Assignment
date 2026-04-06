import mongoose, { Document, Schema } from 'mongoose';

export type BookStatus = 'WANT_TO_READ' | 'READING' | 'READ';

export interface IBook extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['WANT_TO_READ', 'READING', 'READ'],
      default: 'WANT_TO_READ',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent adding the exact same book for the same user twice
bookSchema.index({ userId: 1, title: 1, author: 1 }, { unique: true });

export const Book = mongoose.model<IBook>('Book', bookSchema);
