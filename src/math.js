//rc95 24/07/2022 00:42
// const calculateTip = (total, tipPercent) => {
//     const tip = total * tipPercent
//     return total + tip
// }

// hacemos un cambio para ver si lo test siguen funcionando..
// const calculateTip = (total, tipPercent) => total + (total * tipPercent)

//agregamos defaut_value
const calculateTip = (total, tipPercent = .25) => total + (total * tipPercent)

// 139. writing your own/ tests - rc95 24/07/2022 01:09
// https://gist.github.com/andrewjmead/85e30a13d838d2a6fc229f961b3ceb69

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Number must be non-negative')
            }

            resolve(a + b)
        }, 2000)
    })
}

module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}