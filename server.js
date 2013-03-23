var restify = require('restify');
var _ = require('underscore');
var levelup = require('levelup');
var mm = require('multimethod');
var mailer = require('nodemailer');
var request = require('request');

var db = levelup('./notifydb', { encoding: 'json' });

var app = module.exports = function(config) {
  var server = restify.createServer({ name: 'notify' });
  var port = config.port || 3000;
  var smtp = mailer.createTransport("SMTP", config.smtp);

  // setup body Parser
  server.use(restify.bodyParser());

  // get all channels
  server.get('/', function(req, res, next) {
    db.createReadStream().pipe(res);
    return next();
  });

  // get channel info
  server.get('/:channel', function(req, res, next) {
    db.get(req.params.channel, function(err, channel) {
      if (err) { res.send(404); return next(); }
      res.send(channel);
      return next();
    })
  });

  // publish
  server.post('/publish/:channel', function(req, res, next) {
    // validate subscriber
    if (!req.params.title) { 
      res.send(500, { error: 'publish title is required!'}); 
      return next();
    }
    if (!req.params.msg) { 
      res.send(500, { error: 'publish msg is required!'}); 
      return next();
    }

    db.get(req.params.channel, function(err, channel) {
      if (err) { res.send(404); return next(); }
      notify(req.params, channel.subscriptions);
      res.send(200);
      return next();
    });
  });

  // subscribe
  server.post('/subscribe/:channel', function(req, res, next) {
    // validate subscriber
    if (!req.params.name) { 
      res.send(500, { error: 'subscriber name is required!'}); 
      return next();
    }
    if (!req.params.service) { 
      res.send(500, { error: 'subscriber service is required!'}); 
      return next();
    }
    // fetch channel data
    db.get(req.params.channel, function(err, channel) {
      // if not found then create new channel
      if (err) { channel = { name: req.params.channel, subscriptions: []}; }
      // fetch subscription
      var subscription = _(channel.subscriptions).findWhere({name: req.params.name});
      // if not found add subscription to channel
      if (!subscription) { 
        channel.subscriptions.push(req.params);
      } else {
        // otherwise update subscription with new information
        _(subscription).extend(req.params);
      }
      // save channel to db
      db.put(channel.name, channel, function(err) {
        if (err) { res.send(500); return next(); }
        // send success
        res.send(200);
        return next();
      });
    });
  });

  // remove channel
  server.del('/:channel', function(req, res, next) {
    db.del(req.params.channel, function(err) {
      res.send(200);
    });
  });

  server.listen(port, function() {
    console.log('~ notify ~');
    console.log('listening on %s', port);
  });

  function notify(info, list) {
    _(list).each(function(item) { send(item, info); });
  };

  var send = mm()
    .dispatch(function(contact, msg) {
      return contact.service;
    })
    .when("email", function(contact, info) {
      mail(contact.address, info);
    })
    .when("http", function(contact, info) {
      post(contact.href, info);
    })
    .when("sms", function(contact, info) {
      console.log('POST' + contact.phone);
    })
    ;

  var post = function(href, info) {
    request.post(href, {json: info}, function(e,r,b) {
      if (e) { return console.log(e); }
      console.log('Msg Sent: ' + b);
    });
  };
  
  // email notification
  var mail = function(toAddress, info) {
    var mailOptions = {
        from: config.smtp.fromAddress, // sender address
        to: toAddress, // list of receivers
        subject: info.title, // Subject line
        text: info.msg // plaintext body
    };

    // send mail with defined transport object
    smtp.sendMail(mailOptions, function(err, res){
        if(err){ return console.log(error); } 
        console.log("Message sent: " + res.message);
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });  
  };
};

if (!module.parent) {
  app({});
}