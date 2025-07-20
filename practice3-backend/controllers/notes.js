const notesRouter = require('express').Router()
const Note = require('../models/notes')


notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

notesRouter.get('/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note);
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

notesRouter.delete('/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
    return String(maxId + 1)
}


notesRouter.post('/', (request, response, next) => {
    const body = request.body;

    if (!body.content) {
        return request.status(400).json ({
            error: "Content is Missing"
        })
    }
    
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    
    note.save().then(result => {
        response.json(result)
    }).catch(error => next(error))
})


notesRouter.put('/:id', (request, response) => {
    const {content, important} = request.body

    Note.findById(request.params.id)
     .then(note => {
        if (!note) {
            return response.status(404).end();
        }

        note.content = content;
        note.important = important;

        return note.save().then(result => {
            response.json(result)
        })
     })
     .catch(error => next(error))
})

module.exports = notesRouter
