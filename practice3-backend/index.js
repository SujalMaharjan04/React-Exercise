require('dotenv').config();
const express = require('express');
const Note = require('./models/notes');
const app = express();
app.use(express.static('dist'));
app.use(express.json());






app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    }).catch(error => next(error));
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end();
    })
    .catch(error => next(error));
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
    return String(maxId + 1);
}


app.post('/api/notes', (request, response, next) => {
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
        response.json(result);
    }).catch(error => next(error));
})


app.put('/api/notes/:id', (request, response) => {
    const {content, important} = request.body;

    Note.findById(request.params.id)
     .then(note => {
        if (!note) {
            return response.status(404).end();
        }

        note.content = content;
        note.important = important;

        return note.save().then(result => {
            response.json(result);
        })
     })
     .catch(error => next(error));
})
const unknownEndPoint = (req, res) => {
    res.status(404).send({error: "Unknown Endpoint"});
}

app.use(unknownEndPoint);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({error: 'Malformatted id'});
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({error: err.message});
    }

    next(err);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})