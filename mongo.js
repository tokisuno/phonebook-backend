require('dotenv').config()

const mongoose = require('mongoose');

// if (process.argv.length < 2) {
//   console.log('give password as argument');
//   process.exit(1);
// }

const name = process.argv[2];
const number = process.argv[3];

const url = `mongodb+srv://lucasmei:${process.env.MONGO_PW}@cluster0.81uo97g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


