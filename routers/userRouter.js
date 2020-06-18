const express = require('express')
const router = express.Router()
const {
    insertUser,
    activateUser,
    loginUser,
    verifyJWT
} = require('../database/models/User')

router.use((req, res, next) => {
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

router.post('/loginUser', async (req, res) => {
    let { email, password } = req.body

    try {
        let tokenKey = await loginUser(email, password)
        res.json({
            tokenKey,
            result: 'OK',
            message: 'Đăng nhâp thành công.'
        })
    } catch (error) {
        res.json({
            result: 'Failed',
            message: `Đăng nhâp ko thành công. Error: ${error}`
        })
    }
})

router.get('/jwtTest', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    try {
        await verifyJWT(tokenKey)
        res.json({
            result: 'OK',
            message: 'Verify token successful.'
        })
    } catch (error) {
        res.json({
            result: 'Failed',
            message: `Token error. Error: ${error}`
        })
    }
})

module.exports = router