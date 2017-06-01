var async               = require("async"),
    wifi_manager        = require("./helper/wifi_manager")(),
    dependency_manager  = require("./helper/dependency_manager")(),
    
    logger              = require("./helper/logger")(),
    
    express             = require('express'),
    app                 = express(),
    mongoose            = require('mongoose'),
    morgan              = require('morgan'),
    bodyParser          = require('body-parser'),
    methodOverride      = require('method-override'),
    
    config              = require("./config.json"),   
    LOGNS               = 'DeezerKids:';

async.series([
    /////////////////////////////////////////////////////////////////////
    // STEP 1: Check if we have the required dependencies installed
    /////////////////////////////////////////////////////////////////////
    function test_deps(next_step) {
        console.log(LOGNS, "checking required dependencies installed");
        dependency_manager.check_deps({
            "binaries": ["dhcpd", "hostapd", "iw"],
            "files":    ["/etc/init.d/isc-dhcp-server"]
        }, function(error) {
            if (error) console.log(" * Dependency error, did you run `sudo npm run-script provision`?");
            next_step(error);
        });
    },
    
    /////////////////////////////////////////////////////////////////////
    // STEP 2: Connect to internal Mongo-DB
    /////////////////////////////////////////////////////////////////////
    function connect_db(next_step) {
        console.log(LOGNS, "connecting to local database");
        mongoose.connect('mongodb://localhost/DeezerKids');
        var db = mongoose.connection;

        //db.on('error', function() {
        //    console.error.bind(console, LOGNS + 'connection error:');
        //});

        db.once('open', function() {
            console.log(LOGNS, "succesfully connected to database");

            var device = mongoose.model('Device', {
                ID: String
            });
        });    
    },

    /////////////////////////////////////////////////////////////////////
    // STEP 3: Host HTTP-Server for User-Inerfaces
    /////////////////////////////////////////////////////////////////////
    function start_http_server(next_step) {
        console.log(LOGNS, "starting webserver for user-interfaces");
        app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
        app.use(morgan('dev'));                                         // log every request to the console
        app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
        app.use(bodyParser.json());                                     // parse application/json
        app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
        app.use(methodOverride());

        // routes ---------------------------------------------------------------------
        // get the stored device
        app.get('/api/device', function(req, res) {
            // use mongoose to get all accounts in the database
            device.findOne(function(err, result) {
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)
                res.json(result); // return the device in JSON format
            });
        });

        // create device and send back after creation
        app.post('/api/device', function(req, res) {
            // delete existing entries (there should only be one at same time)
            device.deleteMany();
            
            // create device, information comes from AJAX request from Angular
            device.create({
                ID : req.ID
            }, function(err, result) {
                if (err)
                    res.send(err)
                res.json(result); // return all accounts in JSON format
            });
        });        
        
        // reset the device
        app.delete('/api/device', function(req, res) {
            // delete existing entries (there should only be one at same time)
            device.deleteMany();
        });        
        
        // application -------------------------------------------------------------
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });

        // listen (start app with node server.js) ======================================
        app.listen(config.server.port);
        console.log(LOGNS, "listening on port " + config.server.port);
    },
    
    /////////////////////////////////////////////////////////////////////
    // STEP 4: Check if wifi is enabled / connected
    /////////////////////////////////////////////////////////////////////
    function test_is_wifi_enabled(next_step) {
        wifi_manager.is_wifi_enabled(function(error, result_ip) {
            if (result_ip) {
                console.log(LOGNS, "\nWifi is enabled, and IP " + result_ip + " assigned");
                // process.exit(0);
            } else {
                console.log(LOGNS, "\nWifi is not enabled, Enabling AP for self-configure");
            }
            next_step(error);
        });
    },    
    
], function(error, results) {
    if (error) {
        console.log("ERROR: " + error);
    }
});
