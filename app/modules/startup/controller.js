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

    device              = {};           // initialize an empty device

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
                
                
         ], function(error, result) {
                if (error) {
                    logger.error(error);
                } else {
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
