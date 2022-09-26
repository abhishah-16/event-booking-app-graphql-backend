const Event = require('../../models/event')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error('Invalid Credentials')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Invalid Credentials')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'rtfwa5425GRFG34655ghji6dYytrrj', {
            expiresIn: '1h'
        })
        return {
            userid: user.id,
            token: token,
        }
    }
}