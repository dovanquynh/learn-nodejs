const express = require('express')
let router = express.Router()
const os = require('os')

router.get('/', (req,res) => {
    let { type = '' } = req.query
    res.setHeader('Content-Type', 'text/html; charset=utf-8')

    switch(type.toLowerCase()) {
        case 'os':
            const osPlatform = os.platform()
            const osType = os.type()
            res.send(`Operating system's platform: ${osPlatform}, type: ${osType}`)
            break
        case 'framework':
            res.send('This is Express framework')
            break
        case 'date': 
            let currentDate = new Date()
            res.send(`Current date is: ${currentDate.toUTCString()}`)
            break
        default:
            res.send('You enter wrong type')
    }
})

module.exports = router