var expect = require('expect.js');
var request = require('request');
var server = require('../server');

server({port: 3000});

var publish = {
  title: 'Alert! App did not check in',
  msg: 'The Foobar application has not checked in to the checkin server in the last 15 minutes'
};

describe('POST /publish/:channel', function() {
  before(function(done) {
    // create channel
    request.post('http://localhost:3000/subscribe/bar', 
      {json: {name: 'Foo', service: 'http', href: 'http://echo.com'}},
      function(e,r,b) { expect(r.statusCode).to.be(200); done(); }
    );
  });
  it('should be successful', function(done) {
    request.post('http://localhost:3000/publish/bar', { json: publish }, 
      function(e,r,b) {
        expect(r.statusCode).to.be(200);
        done();
      });
  });
  it('should require title', function(done) {
    request.post('http://localhost:3000/publish/bar', { json: {} }, 
      function(e,r,b) {
        expect(r.statusCode).to.be(500);
        expect(b.error).to.be('publish title is required!');
        done();
      });
  });
  it('should require msg', function(done) {
    request.post('http://localhost:3000/publish/bar', { json: { title: 'foo' } }, 
      function(e,r,b) {
        expect(r.statusCode).to.be(500);
        expect(b.error).to.be('publish msg is required!');
        done();
      });
  });
  after(function(done) {
    request.del('http://localhost:3000/bar', {json: true }, function(e,r,b) {
      expect(r.statusCode).to.be(200);
      done();
    });  
  });
});