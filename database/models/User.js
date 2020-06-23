const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { mongoose } = require('../database')
const { sendEmail } = require('../../utils/utility')
const { Schema } = mongoose
const { deleteBlogPostByAuthor } = require('./BlogPost')
const secretString = "secret string"
const ACTION_BLOCK_USER = "ACTION_BLOCK_USER"
const ACTION_DELETE_USER = "ACTION_DELETE_USER"

const UserSchema = new Schema({
    name: { type: String, default: 'unknown', unique: true },
    email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique: true },
    password: { type: String, required: true },
    active: { type: Number, default: 0 },
    permission: { type: Number, default: 0 },//0:user, 1:moderator, 2:admin
    isBanned: { type: Number, default: 0 },//1: lock account
    blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }]
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
        // await sendEmail(email, encryptedPassword)
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

        if (foundUser.isBanned === 1) {
            throw "User đã bị khóa tài khoản."
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

        if (foundUser.isBanned === 1) {
            throw "User đã bị khóa tài khoản."
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

        if (foundUser.isBanned === 1) {
            throw "User đã bị khóa tài khoản."
        }

        return foundUser

    } catch (error) {
        throw error
    }
}

const blockOrDeleteUsers = async (userIds, tokenKey, actionType) => {
    try {
        let signedInUser = await verifyJWT(tokenKey)

        if (signedInUser.permission !== 2) {
            throw "Chỉ có tài khoản admin mới có quyền."
        }

        userIds.forEach(async (userId) => {
            let user = await User.findById(userId)

            if (!user) {
                return
            }

            if (actionType === ACTION_BLOCK_USER) {
                user.isBanned = 1
                await user.save()
            }
            else if (actionType === ACTION_DELETE_USER) {
                // Xóa các blogPost của user 
                await deleteBlogPostByAuthor(userId)
                // Xóa user
                await User.findByIdAndDelete(userId)
            }
        })
    } catch (error) {
        throw error
    }
}



module.exports = {
    User,
    insertUser,
    activateUser,
    loginUser,
    verifyJWT,
    blockOrDeleteUsers
}