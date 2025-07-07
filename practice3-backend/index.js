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

// app.get('/api/notes/:id', (request, response) => {
//     const id = request.params.id;
//     const note = notes.find(note => note.id === id);
    
//     if (note) {
//         response.json(note);
//     } else {
//         response.status(404).end();
//     }
// })

// app.delete('/api/notes/:id', (request, response) => {
//     const id = request.params.id;
//     notes = notes.filter(note => note.id !== id);

//     response.status(204).end();
// })

// const generateId = () => {
//     const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
//     return String(maxId + 1);
// }


// app.post('/api/notes', (request, response) => {
//     const body = request.body;

//     if (!body.content) {
//         return request.status(400).json ({
//             error: "Content is Missing"
//         })
//     }
    
//     const note = {
//         content: body.content,
//         id: generateId(),
//         important: body.important || false,
//     }
    
//     notes.concat(note);
//     response.json(note)
// })



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})