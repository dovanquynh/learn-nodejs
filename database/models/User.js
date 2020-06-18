const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { mongoose } = require('../database')
const { sendEmail } = require('../../utils/utility')
const { Schema } = mongoose
const secretString = "secret string"

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

const loginUser = async (email, password) => {
    try {
        let foundUser = await User.findOne({ email: email.trim() })
            .exec()

        if (!foundUser) {
            throw "User không tồn tại"
        }

        if (foundUser.active === 0) {
            throw "User chưa kích hoạt"
        }

        let encryptedPassword = foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)

        if (checkPassword === true) {
            let jsonObject = {
                id: foundUser._id
            }
            let tokenKey = await jwt.sign(
                jsonObject,
                secretString,
                { expiresIn: 86400 }
            )
            return tokenKey
        }
        else {
            throw "Password invalid."
        }
        
    } catch (error) {
        throw error
    }
}

const verifyJWT = async (tokenKey) => {
    try {
        let decodedJson = await jwt.verify(tokenKey, secretString)
        if (Date.now() / 1000 > decodedJson.exp) {
            throw "Token hết hạn, login lại."
        }

        let foundUser = await User.findById(decodedJson.id)

        if (!foundUser) {
            throw "Ko tìm thấy user với token này"
        }

        return foundUser

    } catch (error) {
        throw error
    }
}

module.exports = {
    User,
    insertUser,
    activateUser,
    loginUser,
    verifyJWT
}