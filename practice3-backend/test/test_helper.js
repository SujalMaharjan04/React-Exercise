const Note = require('../models/notes')
const User = require('../models/users')

const initialNote = [
    {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

const nonExistingId = async () => {
    const note = new Note({content: 'willremovethissoon'})
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const notesInDb = async() => {
    const note = await Note.find({})
    return note.map(note => note.toJSON())
}

const usersInDb = async() => {
  const user = await User.find({})
  return user.map(user => user.toJSON())
}

module.exports = {initialNote, nonExistingId, notesInDb, usersInDb}