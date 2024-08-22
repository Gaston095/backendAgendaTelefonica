require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    res.status(400).send({ error: 'Malformatted id' })
  }

  next(error)
}

app.get("/", (req,res) => {
  res.send('<h1>Agenda Telefónica</h1>')
})

app.get("/api/persons",(req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})


app.post("/api/persons", (req,res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

/*   if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  } */

  const person = new Person({
    name : body.name,
    number: body.number,
    // id : generateID
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error => next(error))
})

app.get('/info',(req,res) => {
  res.send(`
    <h2>Phonebook has info for ${persons.length} people</h2>
    <p>${new Date().toString()}</p>
  `)
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})