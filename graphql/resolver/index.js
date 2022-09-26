const authResolver = require('./auth')
const bookingResolver = require('./booking')
const userResolver = require('./user')
const eventResolver = require('./events')

const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver,
    ...userResolver
}

module.exports = rootResolver