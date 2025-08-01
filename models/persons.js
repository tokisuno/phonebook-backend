require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to MongoDB!')
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB: ${err.message}`)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// const personSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minLength: 3,
//     required: true
//   },
//   number: String,
// })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
