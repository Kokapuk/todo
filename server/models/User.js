import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model('User', UserSchema);
