const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/', async(req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})

    const passwordCorrect = user === null 
        ? false 
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(404).json({error: 'Invalid password or username'})
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60})

    res
        .status(200)
        .send({ token, username: user.username, name: user.name})
})

module.exports = loginRouter