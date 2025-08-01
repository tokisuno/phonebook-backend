require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/persons')
const app = express()

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :body'))

app.get('/api/persons', (_, res) => {
  Person.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person.collection.estimatedDocumentCount()
    .then(count => {
      res.send(`
        <p>There are ${count} names in the phonebook</p>
        <p>${date}</p>
        `)
    })

})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((note) => {
    res.json(note)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
        .then((updatedPerson) => {
          res.json(updatedPerson)
        })
        .catch(err => next(err))
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(404).send({ error: 'malformed id' })
  } else if (err.name === 'Validation Error') {
    return res.status(404).json({ error: err.message })
  }
  next(err)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
