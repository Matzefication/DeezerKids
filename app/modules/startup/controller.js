var async               = require("async"),
    wifi_manager        = require("./helper/wifi_manager")(),
    dependency_manager  = require("./helper/dependency_manager")(),
    
    logger              = require("./helper/logger")(),
    
    express             = require('express'),
    app                 = express(),
    morgan              = require('morgan'),
    bodyParser          = require('body-parser'),
    methodOverride      = require('method-override'),
    
    config              = require("./config.json");

(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('StartupController', StartupController);

    StartupController.$inject = ['$http', '$rootScope', '$location'];

    function StartupController($http, $rootScope, $location) {

        // Declarations
        var vm = this;
        
        (function initController() {
            async.waterfall([
                /////////////////////////////////////////////////////////////////////
                // STEP 1: Check if we have the required dependencies installed
                /////////////////////////////////////////////////////////////////////
                function test_deps(next_step) {
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
                function test_is_wifi_enabled(result, next_step) {
                    // Prüfung nur durchlaufen, wenn vorherige Prüfung erfolgreich war
                    if (!result) next_step(null, false);

                    logger.info("checking wifi connection on WLAN0");
                    wifi_manager.is_wifi_enabled(function(error, result_ip) {
                        if (result_ip) {
                            logger.success("Wifi is enabled, and IP " + result_ip + " assigned");
                            next_step(null, true);
                        } else {
                            logger.error("Wifi is not enabled, enabling setup-mode");
                            next_step(null, false);
                        }
                        next_step(error, null);
                    });                        
                },      

                /////////////////////////////////////////////////////////////////////
                // STEP 3: Check if device-ID already set
                /////////////////////////////////////////////////////////////////////
                function test_deviceID(result, next_step) {
                    // Prüfung nur durchlaufen, wenn vorherige Prüfung erfolgreich war
                    if (!result) next_step(null, false);

                    logger.info("checking device-ID");
                    
                    if (config.device.ID) {
                        next_step(null, true);
                    } else {
                        next_step(null, false);
                    }
                },

                /////////////////////////////////////////////////////////////////////
                // STEP 4: Validate AccessToken
                /////////////////////////////////////////////////////////////////////
                function test_deviceID(result, next_step) {
                    // Prüfung nur durchlaufen, wenn vorherige Prüfung erfolgreich war
                    if (!result) next_step(null, false);

                    logger.info("checking access-token");
                    next_step(null, true);
                },
                
                /////////////////////////////////////////////////////////////////////
                // STEP 5: Validate Playlist
                /////////////////////////////////////////////////////////////////////
                function test_deviceID(result, next_step) {
                    // Prüfung nur durchlaufen, wenn vorherige Prüfung erfolgreich war
                    if (!result) next_step(null, false);

                    logger.info("checking playlist");
                    next_step(null, true);
                },                
                
         ], function(error, result) {
                if (error) {
                    logger.error(error);
                } else {
                    
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

        });

        // create device and send back after creation
        app.post('/api/device', function(req, res) {

        });        
        
        // reset the device
        app.delete('/api/device', function(req, res) {

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
                    
                    
                    
                    
                    
                    
                    
                    
                    if (result) {
                        vm.mode = 'player';
                    } else {
                        vm.mode = 'setup';
                    }
                    
                    logger.info('Starte im Modus:' + vm.mode);
                }
            });  
        })();
    }
})();
