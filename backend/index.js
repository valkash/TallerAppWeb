require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./models/User')
const Task = require('./models/Task')

const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')
const userExtractor = require('./middleware/userExtractor')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  console.log(request.ip)
  console.log(request.ips)
  console.log(request.originalUrl)
})

app.get('/api/tasks', async (request, response) => {
  const tasks = await Task.find({})
  response.json(tasks)
})

app.get('/api/tasks/:id', (request, response, next) => {
  const { id } = request.params

  Task.findById(id)
    .then(task => {
      if (task) return response.json(task)
      response.status(404).end()
    })
    .catch(err => next(err))
})

app.put('/api/tasks/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const task = request.body

  const newTaskInfo = {
    content: task.content
  }

  Task.findByIdAndUpdate(id, newTaskInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(next)
})

app.delete('/api/tasks/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params

  const res = await Task.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)

  response.status(204).end()
})

app.post('/api/tasks', userExtractor, async (request, response, next) => {
  const {
    content,
    mecanico,
    dateTask,
    marca,
    patente,
    modelo,
    costo
  } = request.body

  const { userId } = request

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newTask = new Task({
    content,
    mecanico,
    dateTask: new Date(dateTask),
    marca,
    patente,
    modelo,
    costo,
    user: user._id
  })

  try {
    const savedTask = await newTask.save()

    user.tasks = user.tasks.concat(savedTask._id)
    await user.save()

    response.json(savedTask)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
