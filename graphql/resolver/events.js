const Event = require('../../models/event')
const User = require('../../models/user')
const { findUser } = require('./helper')

module.exports = {
    events: async (args, req) => {
        try {
            const events = await Event.find()
            const e = events.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event.date).toISOString(),
                    creator: findUser.bind(this, event.creator)
                }
            })
            return e
        } catch (error) {
            console.log(error);
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const event = new Event({
                title: args.input.title,
                description: args.input.description,
                price: args.input.price,
                date: new Date(args.input.date),
                creator: req.userId
            })
            await event.save()
            const user = await User.findById(req.userId)
            user.createdEvents.push(event)
            await user.save()
            return {
                ...event._doc,
                creator: findUser.bind(this, event.creator)
            }
        } catch (error) {
            console.log(error);
        }
    }
}