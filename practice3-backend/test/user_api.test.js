const User = require('../models/users')
const bcrypt = require('bcrypt')
const {test, beforeEach, after, describe} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'you',
            name: 'me',
            password: '12345'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)

        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper status code and message if username is already taken', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'done',
            password: '12345',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })
})

after(async() => {
    await mongoose.connection.close()
})