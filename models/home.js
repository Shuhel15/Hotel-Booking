import mongoose from 'mongoose';

 const homeSchema = mongoose.Schema({
  homeName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: String,
  description: String,
})

// homeSchema.pre('findOneAndDelete', async function(next) {
//   const homeId = this.getQuery()['_id'];
//   await favourite.deleteMany({homeId: homeId })
// })

export default mongoose.model('Home', homeSchema)


