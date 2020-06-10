const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = 8080

//Upload file
const fileUpload = require('express-fileupload')
app.use(fileUpload({
    limits: { fileSize: 150 * 1024 * 1024 } // Maximum 150 MB
}))

//set view's engine
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'js')))

//Router
const systemInfo = require('./routers/systemInfo')
const redirectExample = require('./routers/redirectExample')
const books = require('./routers/books')
const files = require('./routers/files')
const users = require('./routers/users')
const tasks = require('./routers/tasks')

app.listen(PORT, ()=> {
    console.log(`Server is listening on port: ${PORT}`)
})

app.get('', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(`<h1 style="color: blue;">Hello world !</h1>`)
})

app.use('/systemInfo', systemInfo)
app.use('/redirectExample', redirectExample)
app.use('/books', books)
app.use('/files', files)
app.use('/users', users)
app.use('/tasks', tasks)

app.use((req, res) => {
    const http404file = path.join(__dirname)+'/404.html'
    res.status(404).sendFile(http404file)
})