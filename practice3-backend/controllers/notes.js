const notesRouter = require('express').Router()
const Note = require('../models/notes')
const User = require('../models/users')


notesRouter.get('/', async(request, response) => {
    const note = await Note.find({}).populate('user', {username: 1, name: 1})
    
    response.json(note)
})

notesRouter.get('/:id', async(request, response) => {
    const result = await Note.findById(request.params.id)
    if (result) {
        response.status(200).json(result)
    } else {
        response.status(404).end()
    }
})

notesRouter.delete('/:id', async(request, response) => {
    await Note.findByIdAndDelete(request.params.id)
    
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
    return String(maxId + 1)
}


notesRouter.post('/', async(request, response, next) => {
    const body = request.body;

    const user = await User.findById(body.userId)

    if (!user) {
        return response.status(400).json({error: 'userId is missing or not valid'})
    }

    if (!body.content) {
        return response.status(400).json ({
            error: "Content is Missing"
        })
    }
    
    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote)
    await user.save()
    response.status(201).json(savedNote)
    
})


notesRouter.put('/:id', async(request, response) => {
    const {content, important} = request.body

    const result = await Note.findById(request.params.id)
     
    if (!result) {
        return response.status(404).end()
    }

    result.content = content
    result.important = important

    const saved = await result.save()

    response.json(saved)
})


module.exports = notesRouter
