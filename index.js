const express = require('express');
const app = express();
const morgan = require('morgan');

morgan.token('body', req => JSON.stringify(req.body));

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.use(express.json());
app.use(morgan(':method :url :body'));
app.use(express.static('dist'));

app.get('/api/persons', (_, res) => {
  res.json(persons);
})

app.get('/info', (_, res) => {
  const date = new Date();

  res.send(`
    <p>There are ${persons.length} names in the phonebook</p>
    <p>${date}</p>
    `);
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.statusMessage = "Current person doesn't exist";
    res.status(404).end();
  }
})

const generateId = () => {
  return Math.floor(Math.random() * (1000 - persons.length) + persons.length);
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'either name or number is missing',
    })
  }

  const isPresent = persons.some(person => person.name === body.name);
  if (isPresent) {
    return res.status(400).json({
      error: 'name already exists in phonebook',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
