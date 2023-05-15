import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minLength: [5, 'Min Length should be 5 chars'],
      maxLength: [400, 'Max Length should be 400 chars'],
      trim: true,
    },
    subtitle: {
      type: String,
      minLength: 5,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minLength: [5, 'Min Length should be 5 chars'],
      maxLength: [50, 'Max Length should be 50 chars'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['sport', 'games', 'history'],
      required: [true, 'Category is required'],
    },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);

export default Article;
