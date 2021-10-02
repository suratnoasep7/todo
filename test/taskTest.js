process.env.NODE_ENV = 'test';
const User = require('../model/user.js')
const Task = require('../model/task.js')
const server = require ('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker')
const should = chai.should()
const jwt = require('jsonwebtoken')

chai.use(chaiHttp)

let userTest = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
}
let userTest2 = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
}

let taskTest = {
    name: faker.random.word(),
    date: faker.date.future(),
    note: faker.random.words(),
    priority: 'none',
    status: false
}
let taskTest2 = {
    name: faker.random.word(),
    date: faker.date.future(),
    note: faker.random.words(),
    priority: 'none',
    status: false
}
let negativeTaskTest = {
    name: faker.random.word(),
    date: faker.date.future(),
    note: faker.random.words(),
    priority: 'none',
    status: 12345
}


describe('/Create, Show, Update and Delete Task', () => {
    beforeEach((done) => { //beforeEach register means make register early before run test
        chai.request(server)
            .post('/api/user/register')
            .send(userTest)
            .end(function (err, res) {
                dataUser1 = res.body.results
                //console.log(dataUser1)
            done()
            })
    })

    beforeEach((done) => {
        chai.request(server)
            .post('/api/user/login')
            .send(userTest) 
            .end(function (err, res) {
                if(err) console.log(err)
                token1 = res.body.results                 
            done()
            })
    })

    // after((done)=>{
    //     Task.remove({}, (err)=>{ //to remove task after all done. database will empty
    //         done()
    //     })
    // })


//positive test
    it("should show all todolist", done=>{
        chai.request(server)
            .get('/api/task/index')
            .set('authorization', `Bearer ${token1}`)
            .end((err,res)=>{
                res.should.have.status(200)
            done()
        })
    })

    it("should create todolist", done=>{
        chai.request(server)
            .post('/api/task/create')
            .send(taskTest)
            .set('authorization', `Bearer ${token1}`)
            .end((err, res)=> { // res mean result or data after create not response
               // console.log(res.body.results._id)
                task1 = res.body.results //this is results create task contain ID object and ID User will use to next test
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('results') //must match as respon formatter
            done()
        })
    })

    it("should update todotask based on id object", done=>{
        chai.request(server)
            .put('/api/task/update/' + task1._id)
            .send({
                priority: "medium",
                status: false
            })
            .set('authorization', `Bearer ${token1}`)
            .end((err,res)=> {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('results') //must match as respon formatter
            done()
        })
    })

    it("should show todotask based on id object", done=> {
        //console.log(zzz)
        chai.request(server)
            .get('/api/task/show/' + task1._id) // zzz is using data from test create
            .set('authorization', 'Bearer ' + token1)
            .end((err,res)=> {
                res.should.have.status(200)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('results') //must match as respon formatter
            done()
        })
    })


//negative test
    it("can't show all task because invalid token", done => {
        chai.request(server)
            .get('/api/task/index')
            .set('authorization', 'Bearer 1nv4l1dt0k3n')
            .end((err, res) =>{
                chai.expect(res).to.have.status(400) //status code from auth
            done()
        })
    })

    it("can't create new task due to wrong type ", done => {
        chai.request(server)
            .post('/api/task/create')
            .send(negativeTaskTest)
            .set('authorization', 'Bearer ' + token1)
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
            done()
        })
    })

    it("can't update task due to wrong type", done => {
        chai.request(server)
            .put('/api/task/update/' + task1._id)
            .send(negativeTaskTest)
            .set('authorization', `Bearer ${token1}`)
            .end((err,res) =>{
                chai.expect(res).to.have.status(400)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('results')
            done()
        })
    })

    it("can't update task due to ID task not found", done => {
        chai.request(server)
            .put('/api/task/update/' + 'IDT45kN0tF0und')
            .send({
                priority: "medium",
                status: false
            })
            .set('authorization', `Bearer ${token1}`)
            .end((err,res) =>{
                chai.expect(res).to.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('results')
            done()
        })
    })

    it("can't show a task due to ID task not found", done =>{
        chai.request(server)
            .get('/api/task/show/' + 'IDT45kN0tF0und')
            .set('authorization', 'bearer ' + token1)
            .end((err, res) =>{
                chai.expect(res).to.have.status(404)
            done()
        })
    })

    it("can't delete a task due to ID task not found", done =>{
        chai.request(server)
            .delete('/api/task/delete/' + 'IDT45kN0tF0und')
            .set('authorization', 'bearer ' + token1)
            .end((err, res) =>{
                chai.expect(res).to.have.status(404)
            done()
            })
    })


//make new user, login and create a task to negative test for 2nd user
    it("should register 2nd user", (done) => {
        chai.request(server) 
            .post('/api/user/register')
            .send(userTest2)
            .end((err, res) =>{
                dataUser2 = res.body.results
                //console.log(userTest2)
                //console.log(dataUser2)
                done()
            })
    })

    it("should login 2nd user", (done) => {
        chai.request(server)
            .post('/api/user/login')
            .send(userTest2)
            .end((err, res) =>{
                token2 = res.body.results
                //console.log(token2)
                done()
            })
    })

    it("should create todotask 2nd user", done=>{
        chai.request(server)
            .post('/api/task/create')
            .send(taskTest2)
            .set('authorization', `Bearer ${token2}`)
            .end((err, res)=> { // res mean result or data after create, not response
                task2 = res.body.results //this is results create task contain ID object and ID User will use to next test
                res.should.have.status(201)
                res.body.should.have.property('success').equal(true)
                res.body.should.have.property('results') //must match as respon formatter
            done()
        })
    })

    it("can't update a task due to not your task", done => {
        chai.request(server)
            .put('/api/task/update/' + task2._id)
            .send({
                priority: "medium",
                status: false
            })
            .set('authorization', `Bearer ${token1}`)
            .end((err,res) =>{
                chai.expect(res).to.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('results')
            done()
        })
    })

    it("can't show a task due to not your task", done => {
        chai.request(server)
            .get('/api/task/show/' + task2._id)
            .set('authorization', `Bearer ${token1}`)
            .end((err,res) =>{
                chai.expect(res).to.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('results')
            done()
        })
    })

    it("can't delete a task due to not your task", done => {
        chai.request(server)
            .delete('/api/task/delete/' + task2._id)
            .set('authorization', `Bearer ${token1}`)
            .end((err,res) =>{
                chai.expect(res).to.have.status(404)
                res.body.should.have.property('success').equal(false)
                res.body.should.have.property('results')
            done()
        })
    })

//positive test for delete
    const deleteTodo = it("should delete todotask based on id object", done=> {
        setTimeout(() => {
            chai.request(server)
                .delete('/api/task/delete/' + task1._id)
                .set('authorization', 'Bearer ' + token1)
                .end((err,res)=> {
                    chai.expect(res).to.have.status(200)
                    res.body.should.have.property('success').equal(true)
                    res.body.should.have.property('results') //must match as respon formatter
                done()
            })
        }, 10)
    })
    //using async await
    // async function del(){
    //     await deleteTodo()
    // }
    // del()


})
