var app = require('../index.js'),
expect = require('chai').expect,
request = require('supertest');

var id = null;

describe('POST /register', function() {
  it('user should be registered successfully', function(done) {
  request(app)
    .post('/api/user/register')
    .send({firstname:"API",lastname:"Tester",email: 'apitesters@email.com', password: 'yourpasswrord'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .end(function(err,res){
      id = res.body.user._id;
      expect(res.body.message).to.equal("Successfully registered");
      done();
    });
  });
});

describe('POST /login', function() {
  it('user should be able to login', function(done) {
  request(app)
    .post('/api/user/login')
    .send({email: 'apitesters@email.com', password: 'yourpasswrord'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      expect(res.body.message).to.equal("Successfully logged in");
      done();
    });
  });
});

describe('GET /:id', function() {
  it('get user by id', function(done) {
  request(app)
    .get(`/api/user/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      expect(res.body._id).to.equal(id);
      done();
    });
  });
});

describe('UPDATE /:id', function() {
  it('update user password by id', function(done) {
  request(app)
    .put(`/api/user/${id}`)
    .send({firstname:"API",lastname:"Tester",email: 'apitesters@email.com', password: 'yourpasswrord', newPassword:'yourpasswrordd'})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      expect(res.body.message).to.equal("request completed and password got updated");
      done();
    });
  });
});

describe('DELETE /:id', function() {
  it('delete id', function(done) {
  request(app)
    .delete(`/api/user/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err,res){
      expect(res.body.message).to.equal("user deleted successfully");
      done();
    });
  });
});