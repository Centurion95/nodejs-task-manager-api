const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userOneId = mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Pedro',
    email: 'pedro@ejemplo.com',
    password: 'eJemPlo!666',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Juan',
    email: 'juan@ejemplo.com',
    password: 'eJemPlo!777',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    id_user: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    id_user: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    id_user: userTwo._id
}

const setupDataBase = async () => {
    console.log('beforeEach - antes: borramos todos los usuarios antes de iniciar las pruebas!!')
    await User.deleteMany()
    await User(userOne).save()
    await User(userTwo).save()

    await Task.deleteMany()
    await Task(taskOne).save()
    await Task(taskTwo).save()
    await Task(taskThree).save()
}


module.exports = {
    userOneId,
    userOne,

    userTwoId,
    userTwo,

    taskOne,
    taskTwo,
    taskThree,

    setupDataBase
}