const express = require('express')

const UserRouter = express.Router()

UserRouter.get('/', function(req, res){
    return res.status(200).json({message:"test"})
})

module.exports = UserRouter