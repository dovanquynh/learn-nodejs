const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    let books = [
        {
            id: 1,
            title: "Item 1",
            author: "Author 1"
        },
        {
            id: 2,
            title: "Item2",
            author: "Author 2"
        },
        {
            id: 3,
            title: "Item 3",
            author: "Author 3"
        },
        {
            id: 4,
            title: "Item 4",
            author: "Author 4"
        }
    ]
    res.json(books)
})

module.exports = router