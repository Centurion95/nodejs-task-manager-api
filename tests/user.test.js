const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

//rc95 25/07/2022 23:27 - 144. testing with authentication
// const jwt = require('jsonwebtoken')
// const mongoose = require('mongoose')
// const userOneId = mongoose.Types.ObjectId()


// 146. Mocking libraries - rc95 25/07/2022 23:58
// creamos la carpeta ./tests/__mocks__
// y el archivo @sendgrid/mails.js, y fijate como sobrecargamos las propiedades... con esto "maquetamos" lo que queremos y no queremos..





// const userOne = {
//     _id: userOneId,
//     name: 'Pedro',
//     email: 'pedro@ejemplo.com',
//     password: 'eJemPlo!666',
//     tokens: [{
//         token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
//     }]
// }

// beforeEach(async () => {
//     console.log('beforeEach - antes: borramos todos los usuarios antes de iniciar las pruebas!!')
//     await User.deleteMany()
//     await User(userOne).save()
// })

// afterEach(() => {
//     console.log('afterEach - despues')
// })

const { userOneId, userOne, setupDataBase } = require('./fixtures/db')
beforeEach(setupDataBase)

test('1. Should signup a new user', async () => {
    // await request(app).post('/users').send({
    //     name: 'usuario prueba',
    //     email: 'centu95.rc@gmail.com',
    //     password: 'qwertyasd'
    // }).expect(201)

    const response = await request(app).post('/users').send({
        name: 'usuario prueba',
        email: 'centu95.rc@gmail.com',
        password: 'qwertyasd'
    }).expect(201)

    //145. avanced assertions - 
    // Assert that the database was changed correctly..
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assert about the response
    // expect(response.body.user.name).toBe('usuario prueba')
    expect(response.body).toMatchObject({
        user: {
            name: 'usuario prueba',
            email: 'centu95.rc@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('qwertyasd')
})

// test('2. Should login existing user', async () => {
//     await request(app).post('/users/login').send({
//         email: userOne.email,
//         password: userOne.password
//     }).expect(200)
// })

//tarea del profesor...
test('2. Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Assert that the database was changed correctly..
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//tarea del profesor..
test('3. Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        // email: userOne.email,
        email: 'cualquier_correo',
        password: 'this_is_wrong_password'
    }).expect(400)
})
//hasta aca llegué.. 24/07/2022 02:20


//rc95 25/07/2022 23:27 - 144. testing with authentication
test('4. Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //con esto SI va a funcionar...
        .send()
        .expect(200)
})

test('5. Should NOT get profile for unanthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

//tarea del profesor...
test('6. Should delete profile for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //con esto SI va a funcionar...
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('7. Should NOT delete profile for unanthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

// 147. Wrapping up User Tests - 26/07/2022 00:08
// creamos la carpeta ./tests/fixtures
// copiamos una imagen a dicha carpeta..
test('8. Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


//tarea del profesor..
test('9. Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //con esto SI va a funcionar...
        .send({
            name: 'cambiado'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('cambiado')
})

test('10. Should NOT update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //con esto SI va a funcionar...
        .send({
            location: 'cambiado'
        })
        // .expect(400)
        .expect(404)
})

// 148. Setup Task Tests Suite - 26/07/2022 00:25
// podemos eliminar math.js y math.test.js
// creamos task.test.js y trabajamos ahi..