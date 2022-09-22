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
type RootQuery{
    events:[Event!]
    users: [User!]
}
type RootMutation{
    createEvent(input:CreateEventInput): Event
    createUser(input: createUser): User
}
schema{
    query: RootQuery
    mutation: RootMutation
}
`)