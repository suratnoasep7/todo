const User = require('../model/user.js')
const Task = require('../model/task.js')
const {sucRes, failRes} = require('../helper/resFormat.js')
const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken')

function register(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        User.create(
            {username: req.body.username, email: req.body.email, password: hash, tasks: req.body.tasks} //if use this can't use validate on model. the solution change with req.body. but can't hash password
        ,
        (err, data) => { //data is result of hash. only password which hash. username and email will show original
            if(err) return res.status(422).json(failRes(err.message, "please fill correctly"))
            res.status(201).json(sucRes(req.body, "Register Success")) //if using data not req.body, will show result data register after hash
        })
    })
}

function login(req, res){
    User.findOne({
        email: req.body.email
    }).then(function(user){
        //console.log(user)
        if(!user){
            res.status(401).json(failRes("email not match"))
        } else{
            bcrypt.compare(req.body.password, user.password, function(err, result){
                /* istanbul ignore else  */ 
                if(result == true){
                    jwt.sign({_id: user._id}, "xyz", function(err, token){
                        //if(err) return res.status(400).json(failRes(err, "Wrong"))
                        res.status(200).json(sucRes(token, "login Success")) //without respon formatter
                    })
                } else {
                    res.status(400).json(failRes("", "Invalid Password"))
                }
            })
        }
    })
}

function show(req, res){
    //console.log(req.user) //req.user is original user id after decoded in auth
    User.findById(req.user)
    .populate('tasks')
    .exec(function(err, data){
        //if (err) return res.status(404).json(err) //I comment due to nothing error occure
        res.status(200).json(sucRes(data, "Below Your Data Account"))
    })
}

function deleteUser(req, res) { //delete an user along with tasks
    Task.deleteMany({user: req.user}, (err, tasks) =>{ //delete all task in active user
        User.findByIdAndDelete(req.user, (err, data) =>{ //delete an user
            res.status(200).json(sucRes(data, "Delete an User and all Success"));
        })
    })
}

module.exports = {register, login, show, deleteUser}
