const { mongoose } = require('../database')
const { Schema } = mongoose
const { verifyJWT } = require('./User')

const BlogPostSchema = new Schema({
    title: { type: String, default: 'Haha', unique: true },
    content: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    //Trường tham chiếu, 1 blogpost do 1 người viết
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

//Quan hệ 1 User - n BlogPost
const BlogPost = mongoose.model('BlogPost', BlogPostSchema)

//Một user thêm mới bài viết:
// User phải đăng nhập(hoặc có token Key) 
const insertBlogPost = async (title, content, tokenKey) => {
    try {
        //Kiem tra token con han ko
        let signedInUser = await verifyJWT(tokenKey)
        let newBlogPost = await BlogPost.create({
            title,
            content,
            date: Date.now(),
            author: signedInUser
        })

        await newBlogPost.save()
        signedInUser.blogPosts.push(newBlogPost)
        await signedInUser.save()
        return newBlogPost
    } catch (error) {
        throw error
    }
}

const queryBlogPosts = async (text) => {
    try {
        let blogPosts = await BlogPost.find({
            $or: [
                {
                    title: new RegExp(text, "i")
                },
                {
                    content: new RegExp(text, "i")
                }
            ],

        })

        return blogPosts
    } catch (error) {
        throw error
    }
}

const queryBlogPostsByDateRange = async (from, to) => {
    let fromDate = new Date(parseInt(from.split('-')[2]),
        parseInt(from.split('-')[1]) - 1,
        parseInt(from.split('-')[0]))
    let toDate = new Date(parseInt(to.split('-')[2]),
        parseInt(to.split('-')[1]) - 1,
        parseInt(to.split('-')[0]))

    try {
        let blogPosts = await BlogPost.find({
            date: { $gte: fromDate, $lte: toDate }
        })
        return blogPosts
    } catch (error) {
        throw error
    }
}

const getDetailBlogPost = async (blogPostId) => {
    try {
        let blogPost = await BlogPost.findById(blogPostId)
        if (!blogPost) {
            throw `Cannot find blog post ${blogPostId}`
        }
        return blogPost
    } catch (error) {
        throw error
    }
}

const updateBlogPost = async (blogPostId, updatedBlogPost, tokenKey) => {
    try {
        let signedInUser = await verifyJWT(tokenKey)
        let blogPost = await BlogPost.findById(blogPostId)

        if (!blogPost) {
            throw `Cannot find blogPost ${blogPostId}`
        }

        if (signedInUser.id !== blogPost.author.toString()) {
            throw "Cannot update blogPost because you not author."
        }

        blogPost.title = !updatedBlogPost.title ?
            blogPost.title : updatedBlogPost.title

        blogPost.content = !updatedBlogPost.content ?
            blogPost.content : updatedBlogPost.content
        blogPost.date = Date.now()
        await blogPost.save()
        return blogPost
    } catch (error) {
        throw error
    }
}

//Xóa bản ghi blog post
//Cập nhật trường tham chiếu "blogPosts" trong bảng Users

const deleteBlogPost = async (blogPostId, tokenKey) => {
    try {
        let signedInUser = await verifyJWT(tokenKey)
        let blogPost = await BlogPost.findById(blogPostId)

        if (!blogPost) {
            throw `Cannot find blogPost ${blogPostId}`
        }

        if (signedInUser.id !== blogPost.author.toString()) {
            throw "Cannot delete blogPost because you not author."
        }

        await BlogPost.deleteOne({ _id: blogPostId })
        signedInUser.blogPosts = await signedInUser.blogPosts
            .filter(eachBlogPost => {
                return blogPost._id.toString() !== eachBlogPost._id.toString()
            })
        await signedInUser.save()
    } catch (error) {
        throw error
    }
}

const deleteBlogPostByAuthor = async (authorId) => {
    try {
        await BlogPost.deleteMany({
            author: authorId
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    BlogPost,
    insertBlogPost,
    queryBlogPosts,
    queryBlogPostsByDateRange,
    getDetailBlogPost,
    updateBlogPost,
    deleteBlogPost,
    deleteBlogPostByAuthor
}
