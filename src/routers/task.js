const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// router.post('/tasks', async (req, res) => {
// const task = new Task(req.body)
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, //va a copiar todas las propiedades from body to this object
        id_user: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})

// 119. filtering data - rc95 20/07/2022 01:02
// se trata de usar el query_string..
// GET /tasks
// GET /tasks?completed=false
// GET /tasks?completed=true
// 120. paginating data - rc95 20/07/2022 01:14
// limit, skip..
// GET /tasks?limit=10&skip=10
// 121. sorting data - rc95 20/07/2022 01:25
// tasks?sortBy=createdAt:asc
// tasks?sortBy=createdAt:desc
//usamos un caracter especial por el cual vamos a splitear, como _ o :
router.get('/tasks', auth, async (req, res) => {
    const match = {} //filtering
    const sort = {}

    if (req.query.completed) { //si recibe el parametro..
        match.completed = req.query.completed === 'true'
        //'true' = true, else = false
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        //             if parts[1] = 'desc' then -1 else 1
    }

    try {
        // const tasks = await Task.find({ id_user: req.user._id })
        // res.send(tasks)

        //alternativa, usar el virtual_field
        // await req.user.populate('tasks').execPopulate()

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

/*
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
*/

//traer solo las tareas del usuario logeado
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, id_user: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// router.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if (!isValidOperation) {
//         return res.status(404).send({ error: 'Invalid updates!' })
//     }

//     const _id = req.params.id
//     try {
//         //con esto hacemos que nuetro middleware corra..
//         const task = await Task.findById(_id);
//         updates.forEach((update) => task[update] = req.body[update])
//         await task.save()

//         // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, id_user: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, id_user: req.user._id });
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router