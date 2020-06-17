const { mongoose } = require('../database')
const bcrypt = require('bcrypt')
const { sendEmail } = require('../../utils/utility')
const { Schema } = mongoose

const UserSchema = new Schema({
    name: { type: String, default: 'unknown', unique: true },
    email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true },
    password: { type: String, required: true },
    active: { type: Number, default: 0 }
})

const User = mongoose.model('User', UserSchema)

const insertUser = async (name, email, password) => {
    try {
        const encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = new User()
        newUser.name = name
        newUser.email = email
        newUser.password = encryptedPassword
        await newUser.save()
        await sendEmail(email, encryptedPassword)
    } catch (error) {
        throw error
    }
}

const activateUser = async (emai, secretKey) => {
    try {
        let foundUser = await User.findOne({ emai, password: secretKey }).exec()

        if (!foundUser) {
            throw "Không tìm thấy user để kích hoạt"
        }

        if (foundUser.active === 0) {
            foundUser.active = 1
            await foundUser.save()
        }
        else {
            throw 'User đã kích hoạt'
        }

    } catch (error) {
        throw error
    }
}

module.exports = { User, insertUser, activateUser }