const { mongoose } = require('../database/database')
const { User } = require('../database/models/User')

const makeUserBecomeAdmin = async (userId) => {
    try {
        //tìm user với id = userId và update trường permission
        let user = await User.findById(userId)
        
        if (!user) {
            console.log(`Cannot find user with userId=${userId}`)
            return
        }
        user.permission = 2
        user.isBanned = 0
        user.active = 1
        await user.save()
        console.log(`User: ${user._id} is admin`)
    } catch (error) {
        console.log(`Cannot update user with userId:${userId}`)
    }
}

makeUserBecomeAdmin('5eeae9839a127f7530e224d3')