const { Schema, model } = require('mongoose')

const taskSchema = new Schema({
  content: String,
  mecanico: String,
  dateTask: Date,
  marca: String,
  patente: String,
  modelo: String,
  costo: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Task = model('Task', taskSchema)

module.exports = Task
