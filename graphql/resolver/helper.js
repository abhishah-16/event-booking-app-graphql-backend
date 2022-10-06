const User = require('../../models/user')
const Event = require('../../models/event')
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

const eventByID = async (eventid) => {
    try {
        const event = await Event.findById(eventid)
        return {
            ...event._doc,
            creator: findUser.bind(this, event.creator)
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    findUser,
    events,
    eventByID
}