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
    
    mode                = null,         // mode = setup or player
    device              = {};           // initialize an empty device


async.series([
    /////////////////////////////////////////////////////////////////////
    // STEP 1: Check if we have the required dependencies installed
    /////////////////////////////////////////////////////////////////////
    dep: function test_deps(next_step) {
        logger.info("checking required dependencies installed");
        dependency_manager.check_deps({
            "binaries": ["dhcpd", "hostapd", "iw"],
            "files":    ["/etc/init.d/isc-dhcp-server"]
        }, function(error) {
            if (error) {
                logger.error("dependency error, did you run `sudo npm run-script provision`?");
                next_step(error, null);
            } else {
                logger.success("dependencies successfully installed");
                next_step(null, true);
            }
        });
    },
  
    /////////////////////////////////////////////////////////////////////
    // STEP 2: Check if wifi is enabled / connected
    /////////////////////////////////////////////////////////////////////
    wifi: function test_is_wifi_enabled(next_step) {
        logger.info("checking wifi connection on WLAN0");
        wifi_manager.is_wifi_enabled(function(error, result_ip) {
            if (result_ip) {
                logger.success("Wifi is enabled, and IP " + result_ip + " assigned");
                next_step(null, true);
            } else {
                logger.info("Wifi is not enabled, enabling setup-mode");
                next_step(null, false);
            }
            next_step(error, null);
        });
    },      
  
    /////////////////////////////////////////////////////////////////////
    // STEP 3: Check if device-ID already set
    /////////////////////////////////////////////////////////////////////
    function test_deviceID(next_step) {
        logger.info("checking device-ID");
        //logger.info("connecting to local database");
        mongoose.connect('mongodb://localhost/DeezerKids');
        var db = mongoose.connection;

        db.on('error', function() {
            logger.error("Mongo-DB connection error");
            next_step(true, null);
        });

        db.once('open', function() {
            //logger.success("succesfully connected to database");

            device = mongoose.model('Device', {
                ID: String
            });
            device.findOne(function(error, result) {
                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (error) {
                    logger.error("error retrieving data from database");
                    next_step(error, null);
                } else if (result.Data == null) {
                    logger.info("No device-ID found.");
                    next_step(null, false);
                } else {
                    logger.success("Device-ID already set");
                    next_step(null, true);
                }
            });          
        });    
    },

    /////////////////////////////////////////////////////////////////////
    // STEP 4: Validate AccessToken
    /////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////
    // STEP 5: Validate Playlist
    /////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////
    // STEP 6: Host HTTP-Server for User-Inerfaces
    /////////////////////////////////////////////////////////////////////
    function start_http_server(next_step) {
        logger.info("starting webserver for user-interfaces");
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
        logger.success("listening on port " + config.server.port);
        
        next_step(null);
    }    
  
], function(error, mode) {
    if (error) {
      logger.error(error);
    } else if (mode == "setup") {
      // start Setup-Mode
    } else if (mode == "player") {
      // start Player-Mode
    }
});
