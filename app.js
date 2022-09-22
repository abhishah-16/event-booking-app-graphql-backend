const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res, next) => {
    res.send('GRAPHQL-APP')
})
app.listen(4000, () => {
    console.log('SERVER IS RUNNING ON 4000');
})