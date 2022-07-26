const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT//|| 3001

/*
// rc95 18/07/2022 12:03 - middleware - debe estar aqui..
app.use((req, res, next) => {
    // console.log('middleware: ', req.method, req.path)
    // next() //sin esto, el middleware nunca va a continuar..

    // if (req.method === 'GET') {
    //     res.send('GET requests are disabled')
    // } else {
    //     next()
    // }

    //tarea del profesor
    res.status(503).send('Sitio en mantenimiento!')
})
*/

app.use(express.json()) //con esto vamos a parsear automaticamente el json entrante a un objeto..
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port + '/')
})

//103. Securely storing passwords: part 1
// https://www.npmjs.com/package/bcryptjs
// npm i bcryptjs@2.4.3

const bcrypt = require('bcryptjs')
const myFunction = async () => {
    const password = '123hola'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('123hola', hashedPassword)
    console.log(isMatch)
}

myFunction()

//103. Securely storing passwords: part 2 - rc95 17/07/2022 23:40
// vamos a hacer cambios en el modelo de User

//106. JSON web tokens
// https://www.npmjs.com/package/jsonwebtoken
// npm i jsonwebtoken@8.4.0


const jwt = require('jsonwebtoken')
const router = require('./routers/user')
const User = require('./models/user')
const myFunction2 = async () => {
    // const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse')
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })

    console.log('token: ' + token)
    //algo como: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2NTgxMTkwMDR9.3PpY0pVe2r-8lD1i7QwZ3x3DF9LOacvakZ-dJPK4jRU

    // want to decode?: https://www.base64decode.org/

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log('verify: ', data)
}

myFunction2()


// 108. Express Middleware - rc95 18/07/2022 12:03
// sin middleware: new_request -> run router handler
// con middleware: new_request -> do_something -> run router handler

// 109. Accepting Authentication tokens - rc95 18/07/2022 12:19
// vamos a crear una carpeta middleware y poner ahi el codigo.. (no en index.js)

// 110. Advanced Postman
// crear environment, crear atributos, setear environment desde postman..
// usar la variable de entorno, ejemplo: 
// ANTES localhost:3001/users
// DESPUES {{url}}/users

// authorization(pestaña, lista desplegable): 
// - bearer token: para probar con 1 token..
// - inherit auth from parent (el que vamos a usar): sirve para heredar de su padre (la colección)

// vamos a setear "bearer token" para la coleccion(carpeta) completa, entonces todos los que "heredan", van a tener esta configuracion..

// para los request insert_user y login_user, vamos a setear "no_auth"

//rc95 19/07/2022 10:52
// ahora en la configuracion de la coleccion, en vez de psar el token "hardcodeado", vamos a pasar {{authToken}}
// y en las pestañas TEST de login y create_user vamos a escribir el siguiente codigo:
/*
//rc95 19/07/2022 10:51 - pm: postman
if(pm.response.code === 201){
    pm.environment.set('authToken', pm.response.json().token)
}
*/

//esto hará que automaticamente setee la variable de entorno authToken por el token generado en el momento..


// 111. Loggin OUT - rc95 19/07/2022 10:51
// en ./router/user

// 112. Hidding private data - rc95 19/07/2022 11:12 - seguir desde aca..
//19/07/2022 23:07 - siguiendo
const pet = {
    name: 'Jal'
}
console.log('pet', pet)
console.log('JSON.stringify(pet)', JSON.stringify(pet))
// res.send() entonces hace JSON.stringify()...

pet.toJSON = function () {
    console.log('this', this)
    return this
}
console.log('JSON.stringify(pet)', JSON.stringify(pet))


// 113. Authenticating User Endpoints - rc95 19/07/2022 23:43

// 114. the user/task relantionship - rc95 20/07/2022 00:02
//en el modelo de task, vamos a agregar el id del usuario que creó la tarea..
//drop db again..
//agregamos ref en Task
//agregamos .virtual en User

const Task = require('./models/task')
// const User = require('./models/user')

const main = async () => {
    try {
        const task = await Task.findById('62d780e649ffd41f2df181b6')
        // console.log(task)
        // console.log(task.id_user)
        await task.populate('id_user').execPopulate() //hacemos correr la ref (FK)
        console.log('task.id_user', task.id_user)
    } catch (error) {

    }

    try {
        const user = await User.findById('62d77f5df565e61b0c62c3fc')
        // console.log('user.tasks', user.tasks)
        await user.populate('tasks').execPopulate() //hacemos correr la virtual_field
        console.log('user.tasks', user.tasks)
    } catch (error) {

    }

}
main()

// 115. Authentication Task Endpoints - rc95 20/07/2022 00:29

// 116. Cascade Delete Tasks - rc95 20/07/2022 00:50


// 118. working with timestamps - rc95 20/07/2022 00:56

// 119. filtering data - rc95 20/07/2022 01:02

// 120. paginating data - rc95 20/07/2022 01:14

// 121. sorting data - rc95 20/07/2022 01:25
//rc95 20/07/2022 01:38 hasta aca llegué..


// 14 file uploads
// 123. adding support for file uploads - rc95 20/07/2022 23:51
// https://www.npmjs.com/package/multer
// npm i multer@1.4.1
const multer = require('multer')
const upload = multer({
    dest: 'images', //esto va a crear una carpeta /images en la carpeta del proyecto..
    // 124. validating file uploads - rc95 21/07/2022 00:15
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, my_callback) {
        if (!file.originalname.endsWith('.pdf')) {
            return my_callback(new Error('File must be a PDF'))
        }
        // if (!file.originalname.match(/\.(doc|docs)$/)) { // con expresiones regulares..
        //     return my_callback(new Error('File must be a Word Document'))
        // }
        my_callback(undefined, true)
    }
})

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

// 126. handling express errors....   res.status(400).send({ error: error.message })
// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }
// app.post('/upload', errorMiddleware, (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// 127. adding images to user profile - rc95 21/07/2022 00:44


// 128. serving up files --rc95 21/07/2022 01:06
// 129. auto.cropping and image formatting --rc95 21/07/2022 01:19

// 15 sending emails
// 131. exploring sendGrid --rc95 21/07/2022 01:30
// https://sendgrid.com/
// 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


// 132. sending welcome and cancelation emails
// 133. environment variables (dev.env) - rc95 23/07/2022 09:39
// creamos la carpeta y el archivo: ./config/dev.env
// https://www.npmjs.com/package/env-cmd
// npm i env-cmd@8.0.2 --save-dev
// vamos a configurar el package.json, el script "dev":
// antes 
// "dev": "nodemon src/index.js"
// despues
// "dev": "env-cmd ./config/dev.env nodemon src/index.js"
// al ejecutar npm run dev, ya toma el archivo de configuracion..


// 134. creating a production mongoDB Database - 23/07/2022 09:58
// https://www.mongodb.com/atlas/database
// creamos la cuenta gratis
// creamos nuestro cluster gratis
// configuramos la ip 0.0.0.0/0
// creamos el usuario: taskapp (podmos autogenerar el password, como este:) asd32165as4d98d
// le damos conectar, y vamos a seguir las instrucciones para: descargar, instalar y conectarnos por mongoDB Compass..
// guardamos la conexión


// 135. heroku deployment - rc95 23/07/2022 10:34
// git init 
// git checkout -b main
// git status
// creamos en la raiz el archivo .gitignore (excluimos todo lo que no queremos..)
// git status
// git add .
// git commit -m "first commit"
// publicamos en github
//publicamos en heroku...
// heroku create rc95-nodejs-task-manager-api
//configuramos las variables de entorno en heroku..
// heroku config:set key=value (por ejemplo)
//podemos verificar con:
// heroku config
//para eliminar:
// heroku config:unset key
//bueno, ahora si vamos a configurar todas nuestras variables..
// heroku config:set JWT_SECRET=thisismynewsecret SENDGRID_API_KEY=tu_api_aqui SENDGRID_MAIL_FROM=centu95@hotmail.com MONGODB_URL='cadena_De_conexion_aqui'
//OBS: este punto anterior se puede hacer directamente desde la web de heroku... agregar, eliminar, editar variables..
//finalmente vamos a hacer push a heroku..
// git push heroku main
//https://rc95-nodejs-task-manager-api.herokuapp.com
//ahora vamos a hacer todo en postman..
//configuramos el entorno de produccion (variable URL)
//apunto al entorno de produccion, y pruebo mis requests....
//creo un usuario..
//creo una tarea...
//vemos en mongoDB Compass que las colecciones SI se estan creando..
//fin: rc95 23/07/2022 12:08


// 16 testing nodejs
// 137. jest testing framework - rc95 24/07/2022 00:24
// https://jestjs.io/
// npm i jest@23.6.0 --save-dev
// cremos en package.json el script: "test: jest"
// ahora podemos ejecutar:
// npm test
// nos va a dar un error: "Error: no test specified"
// vamos a crear una nueva carpeta "tests" en la raíz..
// dentro vamos a crear un archivo "math.test.js" (jest va a detectar este archivo porque indica ".test")
// si ejecutamos nuevamente npm test, va a detectar el archivo, pero como está vacío, nos va a indicar "Your test suite must contain at least one test."
//.. vamos a escribir el test..


// 138. writing test and assertions -rc95 24/07/2022 00:41
//-creamos el archivo math.js en .scr/

// 139. writing your own test - rc95 24/07/2022 01:09
// 140. testing async code - rc95 24/07/2022 01:14
// cambio en package.json
// "test": "jest --watch"

// 141. testing an express application 1 - rc95 24/07/2022 01:28
// creamos test.env , cambiamos la BD para test
// en el script "test", agregamos este entorno de pruebas:
// "test": "env-cmd ./config/test.env jest --watch"
//tembien en el package.json agregamos un grupo "jest":{
// "testEnvornonment": "node"


// 142. testing an express application 2-rc95 24/07/2022 01:35
// test express applications: https://www.npmjs.com/package/supertest
// npm i supertest --save--dev
// creamos user.test.js en la carpeta tests
//separamos las cosas en el index.js..
//en /src creamos app.js

// 143. jest setup and teardown
// 144. testing with authentication
// 145. advanced assertions
// 146. mocking libraries
// 147. wrapping up user test
// 148. setup task test suite
// 149. testing with tas data
// 150. bonus: extra test ideas

// 17 socket.io
// 152. creating the Chat App Project
// 153. WebSockets
// 154. getting started with socket.io
// 155. socket.io events
// 156. socket.io events challenge
// 157. broadcasting events
// 158. sharing your location
// 159. event acknowledgements
// 160. form and button states
// 161. rendering messages
// 162. rendering location messages
// 163. working with time
// 164. timestamps for location messages
// 165. styling the chat app
// 166. join page
// 167. socket.io rooms
// 168. storing users: part 1
// 169. storing users: part 2
// 170. tracking users joining and leaving
// 171. sending messages to rooms
// 172. rendering user list
// 173. automatic scrolling
// 174. deploying the chat application

// 18 - FIN DEL CURSO!!!