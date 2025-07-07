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
        response.json(note);
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
    return String(maxId + 1);
}


app.post('/api/notes', (request, response) => {
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
    })
})



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})