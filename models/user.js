import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  userType: {
    type: String,
    enum: ['guest', 'host'],
    default: 'guest',
  },
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Home'
  },
  bookings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Home'
  }
})


export default mongoose.model('User', userSchema)


