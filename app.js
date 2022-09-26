const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose')
const gqlSchema = require('./graphql/schema/index')
const gqlResolver = require('./graphql/resolver/index')
const isAuth = require('./middleware/auth')
const app = express()
app.use(express.json())
app.use(isAuth)
app.use('/graphql', graphqlHTTP({
    schema: gqlSchema,
    rootValue: gqlResolver,
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