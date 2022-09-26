const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { findUser, eventByID } = require('./helper')

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
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
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        const event = await Event.findById(args.eventId)
        const booking = new Booking({
            user: req.userId,
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
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
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