const express = require('express')
let router = express.Router()

let redirectFrom = ""

router.get('/old', (req, res) => {
    if (redirectFrom === 'new') {
        redirectFrom = ""
        res.send('This is old!')
    } else {
        redirectFrom = "old"
        res.redirect('/redirectExample/new')
    }
})

router.get('/new', (req, res) => {
    if (redirectFrom === 'old') {
        redirectFrom = ""
        res.send('This is old!')
    } else {
        redirectFrom = "new"
        res.redirect('/redirectExample/old')
    }
})

module.exports = router