const { User, BlogPost, Comment, Product } = require('./models')
const { ObjectId } = require('mongoose').Types

const insertUser = async (name, age, email) => {
    try {
        const newUser = new User()
        newUser.name = name
        newUser.age = age
        newUser.email = email
        await newUser.save()
        console.log(`Insert user ${JSON.stringify(newUser)} successfully`)
    } catch (error) {
        console.log(`Cannot insert user. Error: ${error}`)
    }
}

const findUserById = async (userId) => {
    try {
        let foundUser = await User.findById(userId)
        console.log(`foundUser = ${JSON.stringify(foundUser)}`)
    } catch (error) {
        console.log(`Not found user. Error: ${error}`)
    }
}

const findSomeUsers = async () => {
    try {
        let foundUsers = await User.find(
            {}
        )

        foundUsers.forEach(user => {
            console.log(`User ${user}`)
        })
    } catch (error) {
        console.log(`Not found user. Error: ${error}`)
    }
}

/*const updateUser = async (userId, name, email, age) => {
    try {
        let newUser = {}

        if (name !== undefined) {
            newUser.name = name
        }

        if (email !== undefined) {
            newUser.email = email
        }

        if (age !== undefined) {
            newUser.age = age
        }

        let updatedUser = await User.findOneAndUpdate(
            { _id: ObjectId(userId) },
            newUser
        )

        if (updateUser != null) {
            console.log(`Update successfully. user=${JSON.stringify(newUser)}`)
        }
        else {
            console.log('Cannot update user')
        }

    } catch (error) {
        console.log(`Cannot update user. Error:${error}`)
    }
}
*/

const updateUser = async (userId, name, email, age) => {
    try {
        let foundUser = await User.findById(userId)

        if (!foundUser) {
            console.log(`Ko tim thay user=${userId}`)
            return
        }

        foundUser.name = (name !== undefined) ? name : foundUser.name
        foundUser.email = (email !== undefined) ? email : foundUser.email
        foundUser.age = (age !== undefined) ? age : foundUser.age

        await foundUser.save()
        console.log(`Update successfully. user=${JSON.stringify(foundUser)}`)
    } catch (error) {
        console.log(`Cannot update user. Error:${error}`)
    }
}

const deleteUser = async (userId) => {
    try {
        await User.deleteOne({ _id: ObjectId(userId) })
        console.log(`Xoa thanh cong user=${JSON.stringify(userId)}`)
    } catch (error) {
        console.log(`Cannot delete user. Error${error}`)
    }
}


//Tạo ra 1 user, user này viết 5 bài viết
const createSomeUserAndPosts = async () => {
    try {
        const personOne = new User({
            name: 'Quynh',
            email: 'quynh@gmail.com',
            age: 24,
            blogPost: []
        })

        const newBlogPost1 = new BlogPost({
            title: 'Bai viet 5',
            content: 'Day la content cua bai viet 5',
            date: Date.now(),
            author: personOne
        })

        await newBlogPost1.save()
        await personOne.blogPost.push(newBlogPost1)
        await personOne.save()

    } catch (error) {
        console.log(`Khong the tao dc ban ghi. Error:${error}`)
    }
}

//Hiện danh sách Users, kèm chi tiết các bài blogPost
//Cần join 2 collections: "users" & "blogpost"
const populateUsers = async () => {
    try {
        let foundUsers = await User.find({
            age: { $gte: 24 }
        }).populate({
            path: 'blogPosts', // Populate trường tham chiếu 
            select: ['title', 'content'],
            // match: {content: /bài viết/i} //insensitive-case
        }).exec()

        foundUsers.forEach(user => {
            console.log(`user=${user}`)
        })
    } catch (error) {
        console.log(`Operation failed. Error: ${error}`)
    }
}

//Populate theo chiều ngược lại => Hiện danh sách blogPost => kèm chi tiết author 
const populateBlogPosts = async () => {
    try {
        let foundBlogPosts = await BlogPost.find({})
            .populate({
                path: 'author',
                select: ['name', 'email']
            })
            .exec()

        foundBlogPosts.forEach(blogPost => {
            console.log(`BlogPost = ${blogPost}`)
        })
    } catch (error) {
        console.log(`Operation failed. Error: ${error}`)
    }
}

const populateComments = async () => {
    try {
        //Lay ra object
        const person1 = await User.findById('5ee8ad9b4036061f51ce24e3')

        //Person1 viet 1 comment len 1 blogpost
        const aBlogPost = await BlogPost.findById('5ee8ad9b4036061f51ce24e4')

        const comment1 = await Comment.create({
            body: 'This is a comment for Quynh',
            author: person1,
            commentOn: aBlogPost,
            onModel: 'BlogPost'
        })
        aBlogPost.comments.push(comment1)
        await comment1.save()
        await aBlogPost.save()

        //Comment thứ 2 lên 1 'product'
        const book = await Product.create({
            name: 'NodeJS',
            yearOfProduction: 2020
        })
        const comment2 = await Comment.create({
            body: 'THis is comment 2',
            author: person1,
            commentOn: book,
            onModel: 'Product'
        })
        book.comments.push(comment2)
        await comment2.save()
        await book.save()

        console.log('Operation success')
    } catch (error) {
        console.log(`Operation failed. Error: ${error}`)
    }
}

module.exports = {
    insertUser,
    findUserById,
    findSomeUsers,
    updateUser,
    deleteUser,
    createSomeUserAndPosts,
    populateUsers,
    populateBlogPosts,
    populateComments
}