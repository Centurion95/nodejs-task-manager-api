//rc95 14/07/2022 00:19
const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port + '/')
})

//en package.json agregamos:
// "start": "node src/index.js",
// "dev": "nodemon src/index.js"

// ahora podemos ejecutar en la terminal..
// npm run dev

app.use(express.json()) //con esto vamos a parsear automaticamente el json entrante a un objeto..

//y ahora vamos al postman a crear una coleccion y a crear este request (/users)... ojo: debe ser POST

/*
app.post('/users', (req, res) => {
    console.log(req.body)
    //nos imprime algo como:
    
    // {
    //     name: 'Rodrigo Centurion',
    //     email: 'centu95@hotmail.com',
    //     password: 'qwertyasd'
    // }
    
    //para insertar esto a nuestra mongoDB, vamos a crear el modelo en ./scr/models/
    const user = new User(req.body)
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        //https://www.httpstatuses.org/
        // res.status(404)
        // res.send(error)

        res.status(404).send(error)
    })
})
*/

//rc95 17/07/2022 22:22 - método asincrono..
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(404).send(error)
    }
})


// 89. Resource CREATION Endpoints: part 2
// challenge, do the same for the TASK document..
/*
app.post('/tasks', (req, res) => {
    // console.log(req.body)
    const task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(404).send(error)
    })
})
*/
//rc95 17/07/2022 22:29 - método asincrono..
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})

// 90. Resource READING Endpoints: part 1
/*
app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500).send()
    })
})
*/
//rc95 17/07/2022 22:22 - método asincrono..
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})
// http://localhost:3001/users

/*
app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})
*/
//rc95 17/07/2022 22:25 - método asincrono..
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})
// ok: http://localhost:3001/users/62cf9d82e149d05ffbc128c3
// error: http://localhost:3001/users/087123409823


// 91. Resource READING Endpoints: part 2
/*
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500).send()
    })
})
*/
//rc95 17/07/2022 22:29 - método asincrono..
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

/*
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }).catch((error) => {
        res.status(500).send(error)
    })
})
*/
//rc95 17/07/2022 22:29 - método asincrono..
app.get('/tasks/:id', async (req, res) => {
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

// 93. Promise chaining - rc95 14/07/2022 01:03
// creamos 8-promises-chaining.js en playground..
// creamos promises-chaining.js en 4-task-manager/playground..


// 94. Promise chaining Challenge - rc95 14/07/2022 01:25


//97. Integrating Async/Await - rc95 17/07/2022 22:15
// vamos a cambiar: app.post('/users', (req, res) => {
// por:             app.post('/users', ASYNC (req, res) => {


//98. Resource Updating Endpoints: Part 1 - rc95 11/07/2022 22:33
app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    const _id = req.params.id
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// 99. Resource Updating Endpoints: Part 2 - rc95 11/07/2022 22:49
app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    const _id = req.params.id
    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// 100. Resource DELETING Endpoints - rc95 11/07/2022 22:51
app.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// rc95 11/07/2022 22:54
app.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})


//101. separate route files.. - rc95 23:08
