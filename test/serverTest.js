process.env.NODE_ENV = 'test';
const server = require ('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Task = require ('../model/task.js')
const should = chai.should();

chai.use(chaiHttp);

//positive test
describe('/GET root path', () => {
    it ("should return true in root path", (done) => {
        chai.request(server).get('/').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('success').equal(true);
            res.body.should.have.property('messages').equal("Welcome to ToDo API With Authentication");
            done();
        })
    })
})

//negative test
describe('/GET endpoint error message', () => {
    it ("should show message url not found if wrong enter endpoint", (done) => {
        chai.request(server).get('/api/todaytask').end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.an('object');
            done();
        })
    })
})
