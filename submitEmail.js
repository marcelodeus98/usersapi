const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers:'SSLv3'
    },

    auth: {
        user: 'seuemail@email.com',
        pass: 'suasenha'
    },

});

const sendEmail = (token, email) => {
    transporter.sendMail({
        from:'SeuNome <seuemail@email.com>',
        to: email,
        subject: 'Token for password recovery',
        text: 
        `
            Password recovery request message\n
            \n
            Email: ${email}
            Token: ${token}
        `
    }).then(message => {
        console.log(message);
    }).catch(err => {
        console.log(err);
    }); 
};

module.exports = {sendEmail};

