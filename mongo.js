require('dotenv').config()

const mongoose = require('mongoose');

const name = process.argv[2];
const number = process.argv[3];

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  "name": String,
  "number": String,
})

const Person = mongoose.model('Person', personSchema);

if (name === undefined && number === undefined) {
  Person
    .find({})
    .then(result => {
      result.forEach((person) => {
        console.log(person);
      })
      mongoose.connection.close();
    })
} else {

  const person = new Person({
    "name": `${name}`,
    "number": `${number}`
  })

  person.save().then((_) => {
    console.log('note saved!');
    mongoose.connection.close();
  })
}


