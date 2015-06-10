var server = require('../server.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);



describe('server', function() {
  it('should return an ok code echoed back from /notes/1', function(done) {
    chai
    .request('http://localhost:3001')
    .get('/notes/1')
    .end(function(err, response) {
      expect(response).to.have.status(200);
      done();
    });
  });
  it('should return 200 code from post', function(done) {
    chai
    .request('http://localhost:3001')
    .post('/notes')
    .send({'id': 1, 'name': 'firstNote'})
    .end(
      function(err, response) {
      expect(response).to.have.status(200);
      done();
    });
  });
  it('should expect object at notes/1 to be named firstNote', function(done) {
    chai
    .request('http://localhost:3001')
    .get('/notes/1')
    .end(function(err, response) {
      expect(response.body.name).to.be.eql('firstNote');
      done();
    });
  });
  it('should write out a POST request to the notes page', function(done) {
    chai
    .request('http://localhost:3001')
    .post('/notes')
    .send({'id': 2, 'name': 'secondNote'})
    .end(
      function(err, response) {
      expect(response).to.have.status(200);
      done();
    });
  });
  it('should expect object at notes/2 to be named secondNote', function(done) {
    chai
    .request('http://localhost:3001')
    .get('/notes/2')
    .end(function(err, response) {
      expect(response.body.name).to.be.eql('secondNote');
      done();
    });
  });
  it('should update second objects name to modifiedNote', function(done) {
    chai
    .request('http://localhost:3001')
    .put('/notes/2')
    .send({'id': 2, 'name': 'modifiedNote'})
    .end(
      function(err, response) {
      expect(response.body.name).to.be.eql('modifiedNote');
      done();
    });
  });
  it('should expect object at notes/2 has been deleted', function(done) {
    chai
    .request('http://localhost:3001')
    .delete('/notes/2')
    .end(function(err, response) {
      expect(response.body).to.be.eql({});
      done();
    });
  });
  it('should update first objects name to patchedNote', function(done) {
    chai
    .request('http://localhost:3001')
    .patch('/notes/1')
    .send({'id': 1, 'name': 'patchedNote'})
    .end(
      function(err, response) {
      expect(response.body.name).to.be.eql('patchedNote');
      done();
    });
  });
  it('should post username/password to agent,return user get', function(done) {
    var agent = chai.request.agent('http://localhost:3001');
    agent
    .post('/login')
    .send({'username': 'Jon', 'password': 'miguel'})
    .then(function(res) {
      expect(res).to.have.cookie('sessionid');
      return agent.get('/')
        .then(function(res) {
          expect(res.body).to.be.eql('Hello There: Jon');
          done();
        });
    });
    done();
  });
});
