// 82. section intro: REST APIs and Mongoose
// Mongoose: librería para modelar datos mongoDB 
// cuales son campos obligatorios? cuales son opcionales? que tipos de datos espero de cada uno?
// se puede sbaber que usuario creó que registro, con eso podemos hacer filtros por usuario..


// 83. setting up Mongoose
//https://mongoosejs.com/
// npm i mongoose@5.3.16
//creamos la carpeta/archivo ./src/db/mongoose.js

//rc95 13/07/2022 23:19
const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
});

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const newUser = new User({
    name: 'Zulma',
    age: 35
});

newUser.save().then(() => {
    console.log('new user created!', newUser)
}).catch((error) => {
    console.log('ERROR: ', error)
});

//y ahora forzamos un error por validación..
const newUser2 = new User({
    name: 'Zulma',
    age: 'qwerty'
});

newUser2.save().then(() => {
    console.log('new user created!', newUser2)
}).catch((error) => {
    console.log('ERROR: ', error)
});


// 84. Creating a Mongoose Model
const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
});

const newTask = new Task({
    description: 'task 1',
    completed: false
});

newTask.save().then(() => {
    console.log('new task created!', newTask)
}).catch((error) => {
    console.log('ERROR: ', error)
});


// 85. Data Validation and Data Sanitization: part 1
// https://mongoosejs.com/docs/validation.html
const User2 = mongoose.model('User2', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    // https://www.npmjs.com/package/validator
    // npm i validator@10.9.0
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email!')
            }
        }
    }
});

const newUser2_2 = new User2({
    name: 'YYYY',
    age: 28,
    email: 'correo@hotmail.com'
});

newUser2_2.save().then(() => {
    console.log('new user2 created!', newUser2_2)
}).catch((error) => {
    console.log('ERROR: ', error)
});

//schemaTypes: https://mongoosejs.com/docs/schematypes.html

const newUser2_3 = new User2({
    name: ' zzzZZzz ',
    // age: 28,
    email: ' zzzz@hotmail.com '
});

newUser2_3.save().then(() => {
    console.log('new user2 created!', newUser2_3)
}).catch((error) => {
    console.log('ERROR: ', error)
});

// 86. Data Validation and Data Sanitization: part 2
const User3 = mongoose.model('User3', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    // https://www.npmjs.com/package/validator
    // npm i validator@10.9.0
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"!')
            }
        }
    }
});

const newUser3_2 = new User3({
    name: 'YYYY',
    age: 28,
    email: 'correo@hotmail.com',
    password: '  qwertyqwerty  '
});

newUser3_2.save().then(() => {
    console.log('new user3 created!', newUser3_2)
}).catch((error) => {
    console.log('ERROR: ', error)
});


// challenge - task
const Task2 = mongoose.model('Task2', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const newTask2 = new Task2({
    description: '  task 2    ',
    // completed: false
});

newTask2.save().then(() => {
    console.log('new task2 created!', newTask2)
}).catch((error) => {
    console.log('ERROR: ', error)
});

// 87. Structuring a REST API
// ver las capturas de pantalla  guardadas..

// 88. Installing POSTMAN
// https://www.postman.com/
// test for example: https://rc95-weather-application.herokuapp.com/weather?address=lima

// 89. Resource Creation Endpoints: part 1
// npm i nodemon@1.18.9 --save-dev
// npm i express@4.16.4

// creamos ./src/index.js

// node src/db/mongoose.js
