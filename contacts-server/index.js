
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body)); 
const customFormat = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(customFormat));


let contacts = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]





app.get('/', (request, response)=>{
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response)=>{
  response.send(`<h1>Phonebook has info for ${contacts.length} people</h1> <h2>${new Date()}</h2>`)

})

app.get('/api/contacts', (request,response) => {
  response.json(contacts)
})

const generateId = () => {
  const maxId = contacts.length > 0
  ? Math.max(...contacts.map(contact => contact.id))
  : 0
  return maxId + 1
}

app.post('/api/contacts',(request,response)=>{

  const body = request.body

  if (!body.name || !body.number){
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const newContact = {
    id:  generateId(),
    name: body.name,
    number: body.number
    
  }

  contacts = contacts.concat(newContact)

  response.json(newContact)
})

app.get('/api/contacts/:id',(request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(c => c.id === id )

  if(contact){
    response.json(contact)
  } else {
    return response.status(404).json({error: 'contact not found'})
  }
})

app.delete('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(c => c.id !== id)

  if(!id){
    return response.status(404).json({error: 'contact not found'})
  }else{
    response.status(204).end()
  }
  


})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Server running on port ` + PORT)
})