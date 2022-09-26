const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

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
    events: async () => {
        try {
            const events = await Event.find()
            const e = events.map((event) => {
                return {
                    ...event._doc,
                    creator: findUser.bind(this, event.creator)
                }
            })
            return e
        } catch (error) {
            console.log(error);
        }
    },
    bookings: async () => {
        try {
            const booking = await Booking.find()
            return booking.map((booking) => {
                return {
                    ...booking._doc,
                    user: findUser.bind(this, booking.user),
                    event: eventByID.bind(this, booking.event),
                    createdAt: new Date(booking.createdAt).toISOString(),
                    updatedAt: new Date(booking.updatedAt).toISOString()
                }
            })
        } catch (error) {
            console.log(error);
        }
    },
    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.input.title,
                description: args.input.description,
                price: args.input.price,
                date: new Date(args.input.date),
                creator: '632c34204a549cb26fae9d97'
            })
            await event.save()
            const user = await User.findById('632c34204a549cb26fae9d97')
            user.createdEvents.push(event)
            await user.save()
            return {
                ...event._doc,
                creator: findUser.bind(this, event.creator)
            }
        } catch (error) {
            console.log(error);
        }
    },
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
    bookEvent: async (args) => {
        const event = await Event.findById(args.eventId)
        const booking = new Booking({
            user: '632c34204a549cb26fae9d97',
            event: event
        })
        const result = await booking.save()
        return {
            ...result._doc,
            user: findUser.bind(this, result.user),
            event: eventByID.bind(this, result.event),
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString()
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = {
                ...booking.event._doc,
                creator: findUser.bind(this, booking.creator),
            }
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (error) {
            throw error
        }
    }
}