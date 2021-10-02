var jwt = require('jsonwebtoken')
var {sucRes, failRes} = require('../helper/resFormat.js')
const User = require('../model/user.js')

function auth(req, res, next){
    let bearerToken = req.headers.authorization
    if (!bearerToken) return res.status(401).json(failRes("Token Not Available"))
    let splitToken = bearerToken.split(" ")//only 2nd array will read
    try {
        jwt.verify(splitToken[1], 'xyz', function(err, decoded){ //decoded means, change user ID encoded into original ID
            req.user = decoded._id
            //console.log(decoded)
            User.findById (
                req.user, (err, data) => {
                    if (!data) return res.status(410).json(failRes("User Gone Due to Already Deleted")) //check if user already delete account
                    //res.status(201).json(sucRes(data, "data ready"))// if use this, can cause crash due to re send to header again, but data success create 
                }
            )
            next()
        })
    } catch {
        res.status(400).json(failRes("Invalid Token"))
        
    }
}
module.exports = auth
