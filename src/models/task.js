const { mongo } = require('mongoose')
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    // con "timestamps: true" ya no necesitamos..
    // creation_date: {
    //     //rc95 14/07/2022 10:01
    //     type: Date,
    //     default: Date.now
    // },
    id_user: { //rc95 20/07/2022 00:05
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //como una FK
    }
}, {
    timestamps: true //rc95 20/07/2022 00:57
})

taskSchema.pre('save', async function (next) {
    const task = this

    console.log('pre save task')

    next()
})


const Task = mongoose.model('Task', taskSchema);

module.exports = Task