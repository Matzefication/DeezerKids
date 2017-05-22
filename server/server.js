    // set up ========================
    var express = require('express');
    var app = express();                              // create our app w/ express
    var mongoose = require('mongoose');               // mongoose for mongodb
    var morgan = require('morgan');                   // log requests to the console (express4)
    var bodyParser = require('body-parser');          // pull information from HTML POST (express4)
    var methodOverride = require('method-override');  // simulate DELETE and PUT (express4)

    // configuration =================
    console.log("Deezer.Kids connecting to local database");
    mongoose.connect('mongodb://DeezerKids/DeezerKids');     // connect to mongoDB database

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Deezer.Kids succesful connect to database");
        // we're connected!
        // define model =================
        var DeezerAccount = mongoose.model('DeezerAccount', {
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
        app.get('/api/accounts', function(req, res) {

            // use mongoose to get all accounts in the database
            DeezerAccount.find(function(err, accounts) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                res.json(accounts); // return all accounts in JSON format
            });
        });

        // create account and send back all accounts after creation
        app.post('/api/accounts', function(req, res) {

            // create a account, information comes from AJAX request from Angular
            DeezerAccount.create({
                accessToken : req.body.text,
                expire : '12345',
                userID : 'Matzefication'
            }, function(err, account) {
                if (err)
                    res.send(err);

                // get and return all the accounts after you create another
                DeezerAccount.find(function(err, accounts) {
                    if (err)
                        res.send(err)
                    res.json(accounts);
                });
            });

        });

        // delete a account
        app.delete('/api/accounts/:account_id', function(req, res) {
            DeezerAccount.remove({
                _id : req.params.account_id
            }, function(err, account) {
                if (err)
                    res.send(err);

                // get and return all the todos after you create another
                DeezerAccount.find(function(err, accounts) {
                    if (err)
                        res.send(err)
                    res.json(accounts);
                });
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
