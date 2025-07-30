const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Note = require('../models/notes')
const helper = require('./test_helper')

const api = supertest(app)



beforeEach(async() => {
    await Note.deleteMany({})
    
    await Note.insertMany(helper.initialNote)
})

test('notes are returned as json', async() => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-type', /application\/json/)
})

test('all notes are returned', async() => {
     
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, helper.initialNote.length)
})

test('a specific note is within the returned notes', async() => {
    const response = await api.get('/api/notes')

    const content = response.body.map(e => e.content)
    assert.strictEqual(content.includes('HTML is easy'), true)
})

test('a valid new note is added', async() => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.length, helper.initialNote.length + 1)

    const content = notesAtEnd.map(note => note.content)

    assert(content.includes('async/await simplifies making async calls'), true)
})

test('note without content is not added', async() => {
    const newNote = {
        important: false
    }

    await api  
        .post('/api/notes')
        .send(newNote)
        .expect(400)
    
    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.length, helper.initialNote.length)
})

test('a specific note can be viewed', async() => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const result = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-type', /application\/json/)
    
    assert.deepStrictEqual(result.body, noteToView)
})

test('a note can be deleted', async() => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    const result = await api   
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
    
    const notesAtEnd = await helper.notesInDb()

    const content = notesAtEnd.map(e => e.content)
    assert(!content.includes(noteToDelete.content))

    assert.strictEqual(notesAtEnd.length, helper.initialNote.length - 1)

})


after(async() => {
    await mongoose.connection.close()
})