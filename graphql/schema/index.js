const { buildSchema } = require('graphql')
module.exports = buildSchema(`
type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}
input CreateEventInput{
    title: String
    description: String!
    price: Float!
    date: String!
}
type User{
    _id: ID!
    name: String!
    email: String!
    password: String
    createdEvents: [Event!]
}
input createUser{
    name: String!
    email: String!
    password: String!
}
type Booking{
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
type RootQuery{
    events:[Event!]
    users: [User!]
    bookings: [Booking!]

}
type RootMutation{
    createEvent(input:CreateEventInput): Event
    createUser(input: createUser): User
    bookEvent(eventId: ID!): Booking
    cancelBooking(bookingId: ID!): Event!
}
schema{
    query: RootQuery
    mutation: RootMutation
}
`)