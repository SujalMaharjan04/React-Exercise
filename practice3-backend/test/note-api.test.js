const {test, after} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async() => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-type', /application\/json/)
})

after(async() => {
    await mongoose.connection.close()
})