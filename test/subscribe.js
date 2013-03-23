var expect = require('expect.js');
var request = require('request');
var server = require('../server');

server({port: 3000});

var subscriber1 = {
  name: 'Bob',
  service: 'email',
  address: 'bob@email.com'
};

describe('POST /subscribe/:channel', function() {
  it('should be successful', function(done) {
    request.post('http://localhost:3000/subscribe/foo', { json: subscriber1 }, 
      function(e,r,b) {
        expect(r.statusCode).to.be(200);
        done();
      });
  });
  it('should require name', function(done) {
    request.post('http://localhost:3000/subscribe/bar', { json: {} }, 
      function(e,r,b) {
        expect(r.statusCode).to.be(500);
        expect(b.error).to.be('subscriber name is required!');
        done();
      });
  });
  it('should require service', function(done) {
    request.post('http://localhost:3000/subscribe/bar', { json: { name: 'foo' } }, 
      function(e,r,b) {
        expect(r.statusCode).to.be(500);
        expect(b.error).to.be('subscriber service is required!');
        done();
      });
  });
  after(function(done) {
    request.del('http://localhost:3000/foo', {json: true }, function(e,r,b) {
      expect(r.statusCode).to.be(200);
      done();
    });
  });
});