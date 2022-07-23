//rc95 13/07/2022 00:13
// CRUD: creat, read, update, delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const objectID = mongodb.objectID
const { MongoClient, ObjectID } = require('mongodb')
const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp())
// return

// const connectionURL = 'mongodb://localhost/';
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewParser: true }, (error, client) => {
    if (error) {
        return console.log('Unnable to connect mongoDB')
    }

    console.log('Connected correctly to mongoDB!')

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Rodrigo',
    //     age: 27
    // })

    // 76. Inserting documents (rows in SQL) - rc95 13/07/2022 00:23
    // https://www.mongodb.com/docs/drivers/node/upcoming/usage-examples/insertOne/?_ga=2.47823521.783077221.1657683045-359170041.1657683045
    db.collection('users').insertOne({
        name: 'Rodrigo',
        age: 27
    }, (error, result) => {
        if (error) {
            return console.log('Unnable to insert user')
        }

        console.log('Inserted user correctly:')
        console.log(result.ops)
    })

    //y si insertamos 2 registros?
    db.collection('users').insertMany([
        {
            name: 'Rodrigo',
            age: 27
        }, {
            name: 'Alejandro',
            age: 26
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unnable to insert many users')
        }

        console.log('Inserted many users correctly:')
        console.log(result.ops)
    })


    db.collection('tasks').insertMany([
        {
            description: 'task 1',
            completed: true
        }, {
            description: 'task 2',
            completed: false
        }, {
            description: 'task 3',
            completed: false
        }, {
            description: 'task 4',
            completed: true
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unnable to insert many tasks')
        }

        console.log('Inserted many tasks correctly:')
        console.log(result.ops)
    })


    // 77. the objectID - rc95 13/07/2022 00:34
    // https://www.mongodb.com/docs/manual/reference/method/ObjectId/
    // en resumen es util para cosas como CABECERA-DETALLE
    // const id = new ObjectID()
    db.collection('users').insertOne({
        _id: id,
        name: 'Maria',
        age: 35
    }, (error, result) => {
        if (error) {
            return console.log('Unnable to insert user')
        }

        console.log('Inserted user correctly:')
        console.log(result.ops)
    })

    // 78. querying documents - rc95 13/07/2022 00:43
    db.collection('users').findOne({ name: 'Maria' }, (error, user) => {
        if (error) {
            return console.log('Unnable to fetch user')
        }

        console.log('We found it:')
        console.log(user)
    })

    db.collection('users').findOne({ name: 'Alejandro' }, (error, user) => {
        if (error) {
            return console.log('Unnable to fetch user')
        }

        console.log('We found it:')
        console.log(user)
    })

    //ojo como aqui devuelve un NULL (no un error)
    db.collection('users').findOne({ name: 'Alejandro', age: 1 }, (error, user) => {
        if (error) {
            return console.log('Unnable to fetch user')
        }

        console.log('We found it:')
        console.log(user)
    })

    db.collection('users').findOne({ name: 'Alejandro', age: 26 }, (error, user) => {
        if (error) {
            return console.log('Unnable to fetch user')
        }

        console.log('We found it:')
        console.log(user)
    })

    //buscamos por ID
    db.collection('users').findOne({ _id: ObjectID("62ce49253e976f2cbf86c366") }, (error, user) => {
        if (error) {
            return console.log('Unnable to fetch user')
        }

        console.log('We found it:')
        console.log(user)
    })

    // ahora buscamos mas resultados 
    db.collection('users').find({ age: 27 }).toArray((error, user) => {
        if (error) {
            return console.log('Unnable to fetch users')
        }

        console.log('We found these:')
        console.log(user)
    })

    // para cantidades
    db.collection('users').find({ age: 27 }).count((error, count) => {
        if (error) {
            return console.log('Unnable to count users')
        }

        console.log('Count:' + count)

    })


    //tarea: findOne para la ultima tarea
    db.collection('tasks').findOne({ _id: ObjectID("62ce4fafa1a42d36feac36d3") }, (error, task) => {
        if (error) {
            return console.log('Unnable to fetch task')
        }

        console.log('We found it:')
        console.log(task)
    })

    //tarea: fetch all not_finished tasks
    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
        if (error) {
            return console.log('Unnable to fetch tasks')
        }

        console.log('We found these:')
        console.log(tasks)
    })



    //79. promises - rc95 13/07/2022 22:25
    //asyncronous / callbacks..
    //easiest way to handle async / callbacks
    //cremos 8-callbacks.js y 8-promises.js en la carpeta playground..
    //aqui vemos la diferencia entre un artefacto y otro..


    // 80. Updating documents - rc95 13/07/2022 22:45
    /*
    const updatePromise = db.collection('users').updateOne({
        _id: ObjectID("62ce49253e976f2cbf86c366")
    }, {
        $set: {
            name: 'UPDATED'
        }
    })

    updatePromise.then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
    */

    //forma corta..
    db.collection('users').updateOne({
        _id: ObjectID("62ce49253e976f2cbf86c366")
    }, {
        $set: { //operador $set para asignar un valor directamente..
            name: 'UPDATED'
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    //https://www.mongodb.com/docs/manual/reference/operator/update/
    db.collection('users').updateOne({
        _id: ObjectID("62ce49253e976f2cbf86c366")
    }, {
        $inc: { //operador $inc para incrementar un valor numerico..
            age: 1
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    //UPDATE MANY
    db.collection('tasks').updateMany({
        completed: false //nuestro query (where)
        //si queremos update *... solo dejamos vacío este bloque {}
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result.modifierCount)
    }).catch((error) => {
        console.log(error)
    })


    // 81. Deleting documents - rc95 13/07/2022 23:02
    //deleteMany
    db.collection('users').deleteMany({
        age: 27 //nuestro query (where)
        //si queremos delete *... solo dejamos vacío este bloque {}
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    //deleteOne
    db.collection('users').deleteOne({
        _id: ObjectID("62cf882e6b38e3361f2050d9")
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


    // 82. section intro: REST APIs and Mongoose
    // Mongoose: librería para modelar datos mongoDB 
    // cuales son campos obligatorios? cuales son opcionales? que tipos de datos espero de cada uno?
    // se puede sbaber que usuario creó que registro, con eso podemos hacer filtros por usuario..


    // 83. setting up Mongoose
    //https://mongoosejs.com/
    // npm i mongoose@5.3.16
    //creamos la carpeta/archivo ./src/db/mongoose.js
})

// node mongodb.js