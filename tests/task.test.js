const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')

// 148. Setup Task Tests Suite - 26/07/2022 00:25
// podemos eliminar math.js y math.test.js
// creamos task.test.js y trabajamos ahi..
// en /fixtures/ creamos  db.js
// hacmeos todos los cambios para poner todo en db.js
// para reutilizar el login del otro archivo... en el package.json agregamos: --runInBand

// const { userOneId, userOne, setupDataBase } = require('./fixtures/db')
const {
    userOneId,
    userOne,

    userTwoId,
    userTwo,

    taskOne,
    taskTwo,
    taskThree,

    setupDataBase
} = require('./fixtures/db')

beforeEach(setupDataBase)

test('1. Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test..'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

// 149. Testing with Task Data - 26/07/2022 00:40
// cambios en db.js

//tarea del profesor..
test('2. Should get all tasks for user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('3. Should not delete first task from the second user account', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


//150. Bonus: extra tests ideas 
// https://gist.github.com/andrewjmead/988d5965c609a641202600b073e54266

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks

//FIN - 26/07/2022 01:00