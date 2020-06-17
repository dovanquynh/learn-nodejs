const express = require('express')
const router = express.Router()
const { insertUser, activateUser } = require('../database/models/User')
const { model } = require('mongoose')

router.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
})

router.post('/register', async (req, res) => {
    let { name, email, password } = req.body

    try {
        await insertUser(name, email, password)
        res.json({
            result: 'OK',
            message: 'Đăng ký tài khoản thành công, bạn cần mở email để kích hoạt.'
        })
    } catch (error) {
        res.json({
            result: 'Failed',
            message: `Ko thể đăng ký. Lỗi: ${error}`
        })
    }
})

router.get('/activateUser', async (req, res) => {
    let { email, secretKey } = req.query

    try {
        await activateUser(email, secretKey)
        res.send(`<h1 style="color: blue">Kích hoạt user thành công.</h1>`)
    } catch (error) {
        res.send(`<h1 style="color: red">Không kích hoạt được User.Error: ${error}</h1>`)
    }
})

module.exports = router