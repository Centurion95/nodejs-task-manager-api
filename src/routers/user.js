const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/accounts') //rc95 23/07/2022 09:25

// router.post('/users', async (req, res) => {
//     const user = new User(req.body);
//     try {
//         await user.save()
//         res.status(201).send(user)
//     } catch (error) {
//         res.status(404).send(error)
//     }
// })

//rc95 18/07/2022 01:09
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name) //rc95 23/07/2022 09:25
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findByCredentials(email, password)
        // res.send(user)

        const token = await user.generateAuthToken()
        // res.send({ user, token })
        // res.send({ user: user.getPublicProfile(), token }) //rc95 19/07/2022 23:08 - vamos a ocultar cierta info
        res.send({ user, token }) //rc95 19/07/2022 23:36 - con esto va a usar .toJSON de users.js
    } catch (error) {
        res.status(400).send()
    }
})

//rc95 19/07/2022 10:55
router.post('/users/logout', auth, async (req, res) => {
    // en ./middleware/auth agregamos: req.token = token //para despues poder hacer el logout
    try {
        //vamos a buscar el token a cerrar, y lo excluimos
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//tarea del profesor - rc95 19/07/2022 11:08
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// router.get('/users', async (req, res) => {
// sin middleware: new_request -> run router handler
// con middleware: new_request -> do_something -> run router handler
//ojo, esto expone los datos de los usuarios, debería usarse solo por usuarios admin
// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

//rc95 18/07/2022 12:45
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', async (req, res) => {
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

/*
//esto nos permite modificar el perfil de cualquier usuario, en realidad debemos ser capaces de eliminar solo el nuestro
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    const _id = req.params.id
    try {
        //con esto hacemos que nuetro middleware corra..
        const user = await User.findById(_id);
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})
*/

// 113. Authenticating User Endpoints - rc95 19/07/2022 23:56
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

/*
//esto nos permite eliminar el perfil de cualquier usuario, en realidad debemos ser capaces de eliminar solo el nuestro
router.delete('/users/:id', async (req, res) => {
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
*/

// 113. Authenticating User Endpoints - rc95 19/07/2022 23:43
//solo vamos a ser capaces de borrar nuestro perfil
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name) //rc95 23/07/2022 09:32
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//tarea del profesor.. en el router user.. rc95 21/07/2022 00:14
const multer = require('multer')
const upload = multer({
    // dest: 'avatars', //ya no queremos guardar en la carpeta, sino en la coleccion..
    // 125. validation challenge //tarea del profesor..
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, my_callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // con expresiones regulares..
            return my_callback(new Error('File must be an image!'))
        }
        my_callback(undefined, true)
    }
})

// router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
// 127. adding images to user profile - rc95 21/07/2022 00:44
//queremos que esté autenticado.. auth
//ya no queremos guardar en la carpeta del proyecto, sino en la coleccion de usuarios
const sharp = require('sharp')
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer

    // 129. auto.cropping and image formatting --rc95 21/07/2022 01:19
    // npm i sharp - https://www.npmjs.com/package/sharp
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer

    //va a guardar algo como esto:
    // /9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAA....
    //luego podemos ir a la web; jsbin.com
    //y poner esto:
    // <img scr="data:image/jpg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAA..../>
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//tarea del profesor:
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// 128. serving up files --rc95 21/07/2022 01:06
router.get('/users/:id/avatar', /*auth,*/ async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        // res.set('Content-Type', 'image/jpg')
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
        //http://localhost:3001/users/62d78c12874a67365974bf88/avatar
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router