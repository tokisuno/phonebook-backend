require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/persons');
const app = express();
morgan.token('body', req => JSON.stringify(req.body));

let persons = [];

// let persons = [
//   {
//     "id": "1",
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": "2",
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": "3",
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": "4",
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.use(express.json());
app.use(express.static('dist'))
app.use(morgan(':method :url :body'));
app.use(express.static('dist'));

app.get('/api/persons', (_, res) => {
  Person.find({}).then((notes) => {
    res.json(notes)
  })
})

// Not working yet
// app.get('/info', (_, res) => {
//   const date = new Date();
//
//   res.send(`
//     <p>There are ${persons.length} names in the phonebook</p>
//     <p>${date}</p>
//     `);
// })

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((note) => {
    res.json(note);
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'either name or number is missing',
    })
  }

  // Don't worry about this for now
  // const isPresent = persons.some(person => person.name === body.name);
  // if (isPresent) {
  //   return res.status(400).json({
  //     error: 'name already exists in phonebook',
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" })
}
app.use(unknownEndpoint);

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
