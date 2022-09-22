const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')
const app = express()
app.use(express.json())

const events = [

]

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input CreateEventInput{
            title: String
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery{
            events:[Event!]
        }
        type RootMutation{
            createEvent(input:CreateEventInput): Event
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.input.title,
                description: args.input.description,
                price: +args.input.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: true
}))

app.get('/', (req, res, next) => {
    res.send('GRAPHQL-APP')
})
app.listen(4000, () => {
    console.log('SERVER IS RUNNING ON 4000');
})