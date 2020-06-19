const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema

const UserSchema = new Schema({
    name: { type: String, default: 'null' },
    age: { type: Number, min: 18, index: true },
    email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ },

    //Trường tham chiều ,1 user có thể viết nhiều blogpost
    blogPost: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }]
})

const BlogPostSchema = new Schema({
    title: { type: String, default: 'hello' },
    content: { type: String, default: '' },
    date: { type: Date, default: Date.now },

    //Trường tham chiếu, 1 blogpost do 1 người viết 
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
    ]
})

//Comment
const CommentSchema = new Schema({
    body: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //Dynamic ref
    commentOn: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        require: true,
        enum: ['BlogPost', 'Product']
    }
})


const ProductSchema = new Schema({
    name: { type: String, default: '' },
    yearOfProduction: { type: Number, min: 2000 },
    comments: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
    ]
})

//Chuyen Schema sang Model
// const User = mongoose.model('User', UserSchema)
// const BlogPost = mongoose.model('BlogPost', BlogPostSchema)
const Comment = mongoose.model('Comment', CommentSchema)
const Product = mongoose.model('Product', ProductSchema)

module.exports = { Comment, Product } 