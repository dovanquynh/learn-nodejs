const express = require('express')
const router = express.Router()
const {
    insertBlogPost,
    queryBlogPosts,
    queryBlogPostsByDateRange,
    getDetailBlogPost,
    updateBlogPost,
    deleteBlogPost
} = require('../database/models/BlogPost')

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.post('/insertBlogPost', async (req, res) => {
    let { title, content } = req.body
    let tokenKey = req.headers['x-access-token']
    try {
        let newBlogPost = await insertBlogPost(title, content, tokenKey)
        res.json({
            result: "ok",
            message: "Insert BlogPost successful.",
            data: newBlogPost
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Insert BlogPost failed. Error: ${error}`
        })
    }
})

router.get('/queryBlogPosts', async (req, res) => {
    let { text } = req.query
    try {
        let blogPosts = await queryBlogPosts(text)
        res.json({
            result: "ok",
            message: "Query BlogPost successful.",
            data: blogPosts
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Query BlogPost failed. Error: ${error}`
        })
    }
})

router.get('/queryBlogPostsByDateRange', async (req, res) => {
    let { from, to } = req.query
    try {
        let blogPosts = await queryBlogPostsByDateRange(from, to)

        res.json({
            result: "ok",
            message: "Query BlogPost successful.",
            data: blogPosts
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Query BlogPost failed. Error: ${error}`
        })
    }
})

router.get('/getDetailBlogPost', async (req, res) => {
    let { id } = req.query
    try {
        let blogPosts = await getDetailBlogPost(id)

        res.json({
            result: "ok",
            message: "Query BlogPost successful.",
            data: blogPosts
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Query BlogPost failed. Error: ${error}`
        })
    }
})

router.put('/updateBlogPost', async (req, res) => {
    let { id } = req.body
    let updatedBlogPost = req.body
    let tokenKey = req.headers['x-access-token']

    try {
        let blogPost = await updateBlogPost(id, updatedBlogPost, tokenKey)
        res.json({
            result: "ok",
            message: "Update BlogPost successful.",
            data: blogPost
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Update BlogPost failed. Error: ${error}`
        })
    }
})

router.delete('/deleteBlogPost', async (req, res) => {
    let { id } = req.body
    let tokenKey = req.headers['x-access-token']

    try {
        await deleteBlogPost(id, tokenKey)
        res.json({
            result: "ok",
            message: "Delete BlogPost successful.",
        })
    } catch (error) {
        res.json({
            result: "failed",
            message: `Delete BlogPost failed. Error: ${error}`
        })
    }
})

module.exports = router