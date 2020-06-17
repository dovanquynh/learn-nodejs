const nodemailer = require('nodemailer')
const PORT = 8080

const sendEmail = async (receiverEmail, secretKey) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dovanquynh96@gmail.com',
                pass: '123456'
            }
        })
    
        let mailOptions = {
            from: '"Quynh" <dovanquynh96@gmail.com>',
            to: receiverEmail,
            subject: 'Activate email',
            html: `<h1>Please click here to activate your account:</h1>\
                    http://localhost:${PORT}/users/activateUser?secretKey=${secretKey}&email=${receiverEmail}`
        }

        let info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: %s`, info.messageId)
        
    } catch (error) {
        throw error
    }
}

module.exports = { sendEmail, PORT }