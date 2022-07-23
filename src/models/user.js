const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//103. Securely storing passwords: part 2 - rc95 17/07/2022 23:40
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, //rc95 18/07/2022 00:14 - debemos borrar la BD completa osino no funciona!
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: { //rc95 21/07/2022 00:47
        type: Buffer
    }
}, {
    timestamps: true //rc95 20/07/2022 00:57
})

//rc95 20/07/2022 00:24 - con esto vamos a poder hacer "user.tasks"
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'id_user'
})

//rc95 19/07/2022 23:08 - vamos a excluir informacion sensible..
// userSchema.methods.getPublicProfile = function () {
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    // 129. auto.cropping and image formatting --rc95 21/07/2022 01:19
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unnable to Login') //- invalid email
    }

    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unnable to Login') //- invalid credentials
    }

    return user
}

// estos son middleware (como triggers en SQL) //pre = ANTES
userSchema.pre('save', async function (next) {
    const user = this
    // console.log('before saving!')

    //en insert y en update, si se pasa el parametro password, va a ser hasheado..
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// 116. Cascade Delete Tasks - rc95 20/07/2022 00:50
// este middleware es como un trigger al eliminar un ususario
const Task = require('./task')
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ id_user: user._id })
    next()
})

//y pasamos el schema como 2do parametro..
const User = mongoose.model('User', userSchema)

module.exports = User