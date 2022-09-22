const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')
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
        events: async () => {
            const events = await Event.find()
            return events
        },
        createEvent: async (args) => {
            const event = new Event({
                title: args.input.title,
                description: args.input.description,
                price: args.input.price,
                date: new Date(args.input.date),
            })
            await event.save()
            return event
        }
    },
    graphiql: true
}))

app.get('/', (req, res, next) => {
    res.send('GRAPHQL-APP')
})

mongoose.connect('mongodb+srv://abhishah0196:abhishah@cluster0.w9drn.mongodb.net/event-booking-graphql', () => {
    console.log('CONNECTED TO MONGODB ATLAS :)');
})
app.listen(4000, () => {
    console.log('SERVER IS RUNNING ON 4000 :)');
})
// mongodb+srv://abhishah0196:<password>@cluster0.w9drn.mongodb.net/test