const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

const findUser = async (userid) => {
    try {
        const user = await User.findById(userid)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user.createdEvents)
        }
    } catch (error) {
        console.log(error);
    }
}

const events = async (eventid) => {
    try {
        const events = await Event.find({ _id: { $in: eventid } }).populate('creator')
        return events.map((event) => {
            return {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                creator: findUser.bind(this, event.creator),
            }
        })
    } catch (error) {
        console.log(error);
    }
}

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