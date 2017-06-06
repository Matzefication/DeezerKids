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
            async.series([
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
                            next_step(null, 'setup');
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
                            next_step(null, 'player');
                        } else {
                            logger.info("Wifi is not enabled, enabling setup-mode");
                            next_step(null, 'player');
                        }
                        next_step(error, null);
                    });
                },      
                
            ], function(error, mode) {
                if (error) {
                    logger.error(error);
                } else if (mode == "setup") {
                    // start Setup-Mode
                    logger.success("Setup wird gestartet");
                } else if (mode == "player") {
                    // start Player-Mode
                    logger.success("Player wird gestartet");
                }
            });            
            
        })();
    }
})();
