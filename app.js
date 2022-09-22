const express = require('express')
const bcrypt = require('bcryptjs')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')
const User = require('./models/user')
const app = express()
app.use(express.json())

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
        type User{
            _id: ID!
            name: String!
            email: String!
            password: String
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
                creater: '632c2d06e91f3a8e7c356b1b'
            })
            await event.save()
            const user = await User.findById('632c2d06e91f3a8e7c356b1b')
            user.createdEvents.push(event)
            await user.save()
            return event
        },
        createUser: async (args) => {
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
            return user
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