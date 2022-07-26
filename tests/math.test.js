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


// rc95 24/07/2022 00:34
// para ejecutar: npm test
/*
test('Hello World', () => {

})

test('This should fail', () => {
    throw new Error('Failure!')
})
*/


/*
why test?
- saves time
- creates reliable software
- gives flexibility to developers
 - refactoring
 - collaborating
 - profiling
- Peace of mind
*/


// 138. writing test and assertions -rc95 24/07/2022 00:41
const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('1. calculateTip ok', () => {
    const total = calculateTip(10, .30)
    // const total = calculateTip(20, .30) //para forzar el error en el test

    //no vamos a usar esto..
    // if (total !== 13) {
    //     throw new Error('Total tip should be 13. Got ' + total)
    // }

    //solo vamos a usar esto..
    expect(total).toBe(13)
})

test('2. calculateTip with default_value ok', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})



// 139. writing your own/ tests - rc95 24/07/2022 01:09
// https://gist.github.com/andrewjmead/85e30a13d838d2a6fc229f961b3ceb69

// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!

test('3. Should convert 32 F to 0 C', () => {
    const total = fahrenheitToCelsius(32)
    expect(total).toBe(0)
})

test('4. Should convert 0 C to 32 F', () => {
    const total = celsiusToFahrenheit(0)
    expect(total).toBe(32)
})

// 140. testing async code - rc95 24/07/2022 01:14
// cambio en package.json
// "test": "jest --watch"
// test('5. Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done() //cuando sean asincronas, debemos indicar done()
//     }, 2000)
// })

test('6. Should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
        // expect(sum).toBe(6)
        done()
    })
})

test('7. Async/Await should add two numbers', async () => {
    const sum = await add(10, 22)
    // const sum = await add(11, 32)
    expect(sum).toBe(32)

})
