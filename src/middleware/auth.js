const jwt = require('jsonwebtoken')
const User = require('../models/user')

// rc95 18/07/2022 12:27 - middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('token:', token)
        // const decoded = jwt.verify(token, 'thisismynewcourse')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        console.log('decoded:', decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token //para despues poder hacer el logout
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate!' })
    }


    // console.log('middleware: ', req.method, req.path)
    // next() //sin esto, el middleware nunca va a continuar..

    // if (req.method === 'GET') {
    //     res.send('GET requests are disabled')
    // } else {
    //     next()
    // }

    //tarea del profesor
    // res.status(503).send('Sitio en mantenimiento!')
}

module.exports = auth
