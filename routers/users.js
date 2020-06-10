const express = require('express')
const router = express.Router()

router.get('/bmi', async (req, res) => {
    //BMI = Body Mass Index
    let { name = '', weight = 0, height = 0 } = req.query
    weight = parseFloat(weight)
    height = parseFloat(height)

    if (isNaN(height) || isNaN(height)) {
        res.json({
            result: "failed",
            message: "Moi ban nhap chieu cao va can nang"
        })
        return
    }

    if (name === "") {
        res.json({
            result: "OK",
            message: "Ban phai nhap ten nguoi"
        })
    }

    let bmi = Math.round(weight / (height * height), 2)
    let message = ""

    if (bmi < 15) {
        //Qua gay
        message = "Quá gầy"
    }
    else if (bmi >= 15 && bmi < 18.5) {
        message = "Hơi gầy"
    }
    else if (bmi >= 18.5 && bmi < 25) {
        message = "Thể trạng bình thường"
    }
    else if (bmi >= 30 && bmi < 40) {
        message = "Mập"
    }
    else if (bmi >= 40) {
        message = "Quá mập"
    }

    res.json({
        result: "OK",
        data: bmi,
        message: `Chỉ số BMI của bạn: ${name} là: ${bmi} => ${message}`
    })
})

router.get('/bmiPage', async (req, res) => {
    res.render('bmiPage')
})

let users = [
    { 'admin': '123' }
]
router.post('/login', async (req, res) => {
    let { name = '', password = '' } = req.body
    const foundUser = users.find(user => {
        return user[name] === password
    })

    if (foundUser) {
        res.json({
            result: "ok",
            message: 'Dang nhap thanh cong'
        })
    }
    else {
        res.json({
            result: 'failed',
            message: 'That bai'
        })
    }
})

router.get('/login', async (req, res) => {
    res.render('loginPage')
})

module.exports = router