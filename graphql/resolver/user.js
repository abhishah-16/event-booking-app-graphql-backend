const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')
const { events } = require('./helper')

module.exports = {
    createUser: async (args) => {
        try {
            const checkuser = await User.findOne({ email: args.input.email })
            if (checkuser) {
                throw new Error('User Already Exists')
            }
            const hashpassword = await bcrypt.hash(args.input.password, 12)
            const user = new User({
                name: args.input.name,
                email: args.input.email,
                password: hashpassword
            })
            await user.save()
            return {
                ...user._doc,
                createdEvents: events.bind(this, user.createdEvents)
            }
        } catch (error) {
            console.log(error);
        }
    },
}