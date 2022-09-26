const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error('Invalid Credentials')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Invalid Credentials')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'rtfwa5425GRFG34655ghji6dYytrrj', {
            expiresIn: '1h'
        })
        return {
            userid: user.id,
            token: token,
        }
    }
}