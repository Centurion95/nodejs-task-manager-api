//npm i @sendgrid/mail@6.3.1
const sgMail = require('@sendgrid/mail')
// const sendgridAPIKEY = 'your_api_here'
// const fromMail = 'centu95@hotmail.com'

// sgMail.setApiKey(sendgridAPIKEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.send({
//     // to: 'centu95@hotmail.com',
//     to: 'centu95.rc@gmail.com',
//     from: fromMail,
//     subject: 'asunto',
//     text: 'cuerpo de mail'
// })
// node src/emails/accounts.js
// fin - 21/07/2022 01:55

//rc95 23/07/2022 09:20 - continuamos..
const sendWelcomeEmail = (toEmail, name) => {
    sgMail.send({
        to: toEmail,
        // from: fromMail,
        from: process.env.SENDGRID_MAIL_FROM,
        subject: 'Welcome to the APP! =)',
        text: `Hello ${name}!, Let me know if you need help.`
        // html: ''
    })
    console.log('sendWelcomeEmail was sent..')
}

//tarea del profesor - mail de cancelacion..
const sendCancelationEmail = (toEmail, name) => {
    sgMail.send({
        to: toEmail,
        // from: fromMail,
        from: process.env.SENDGRID_MAIL_FROM,
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}, I hope to see you back sometime soon.`
        // html: ''
    })
    console.log('sendCancelationEmail was sent..')
}

module.exports = {
    sendWelcomeEmail, //esto lo vamos a usar en el router de usuario, al momento de crear un nuevo usuario (post)
    sendCancelationEmail
}