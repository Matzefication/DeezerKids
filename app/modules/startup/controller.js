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

    StartupController.$inject = ['$http', '$rootScope', '$location', '$q'];

    function StartupController($http, $rootScope, $location, $q) {

        // Declarations
        var vm = this;

        (function initController() {
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
                
            ], function(error, mode) {
                if (error) {
                  logger.error(error);
                } else if (mode == "setup") {
                  // start Setup-Mode
                } else if (mode == "player") {
                  // start Player-Mode
                }
            });            
            
        })();
        
        function asyncGreet(name) {
          // perform some asynchronous operation, resolve or reject the promise when appropriate.
          return $q(function(resolve, reject) {
            setTimeout(function() {
              if (okToGreet(name)) {
                resolve('Hello, ' + name + '!');
              } else {
                reject('Greeting ' + name + ' is not allowed.');
              }
            }, 1000);
          });
        }        
    }
})();
