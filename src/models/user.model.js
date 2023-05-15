import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'User first name required'],
      minLength: [4, 'Min Length should be 4 chars'],
      maxLength: [50, 'Max Length should be 50 chars'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'User last name required'],
      minLength: [3, 'Min Length should be 3 chars'],
      maxLength: [60, 'Max Length should be 60 chars'],
      trim: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'User email required'],
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    role: {
      type: String,
      enum: ['admin', 'writer', 'guest'],
    },
    age: {
      type: Number,
      min: 1,
      max: 99,
    },
    numberOfArticles: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

userSchema.pre('save', function (next) {
  if (this.age < 0) {
    this.age = 1;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
