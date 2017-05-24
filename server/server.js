    // set up ========================
    var LOGNS = 'DeezerKids:';
    var express = require('express');
    var app = express();                              // create our app w/ express
    var mongoose = require('mongoose');               // mongoose for mongodb
    var morgan = require('morgan');                   // log requests to the console (express4)
    var bodyParser = require('body-parser');          // pull information from HTML POST (express4)
    var methodOverride = require('method-override');  // simulate DELETE and PUT (express4)

    // configuration =================
    console.log("DeezerKids connecting to local database");
    mongoose.connect('mongodb://localhost/DeezerKids');     // connect to mongoDB database

    var db = mongoose.connection;

    db.on('error', function() {
        console.error.bind(console, 'connection error:');
    });

    db.once('open', function() {
        console.log("DeezerKids succesful connected to database");
        // we're connected!
        // define model =================
        var DeezerAccount = mongoose.model('DeezerAccount', {
            active: Boolean,
            accessToken: String,
            expire: String,
            userID: String
        });

        app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
        app.use(morgan('dev'));                                         // log every request to the console
        app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                                     // parse application/json
        app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        app.use(methodOverride());

        // routes ---------------------------------------------------------------------
        // get all stored accounts
        app.get('/api/account', function(req, res) {
            // use mongoose to get all accounts in the database
            DeezerAccount.findOne(function(err, account) {
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)
                res.json(account); // return all accounts in JSON format
            });
        });

        // create account and send back all accounts after creation
        app.post('/api/account', function(req, res) {
            // delete existing entries (there should only be one at same time)
            DeezerAccount.deleteMany();
            
            // create an account, information comes from AJAX request from Angular
            DeezerAccount.create({
                active : true,
                accessToken : req.accessToken,
                expire : req.expire,
                userID : req.userID
            }, function(err, account) {
                if (err)
                    res.send(err);

                // get and return all the accounts after you create another
                DeezerAccount.findOne(function(err, account) {
                    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                    if (err)
                        res.send(err)
                    res.json(account); // return all accounts in JSON format
                });
            });

        });

        // delete a account
        app.delete('/api/account', function(req, res) {
            DeezerAccount.remove(function(err, account) {
                if (err)
                    res.send(err);
            });
        });

        // application -------------------------------------------------------------
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });

        // listen (start app with node server.js) ======================================
        app.listen(8000);
        console.log("Deezer.Kids listening on port 8000");
    });
