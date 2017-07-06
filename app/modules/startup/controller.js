var wifi_manager        = require("./helper/wifi_manager")(),
    dependency_manager  = require("./helper/dependency_manager")(),
    logger              = require("./helper/logger")(),
    config              = require("./config.json");

(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('StartupController', StartupController);

    StartupController.$inject = ['$http', '$rootScope', '$location', '$q'];

    function StartupController($http, $rootScope, $location, $q) {

        // Declarations
        var vm = this;
        
        /////////////////////////////////////////////////////////////////////
        // STEP 1: Check if we have the required dependencies installed
        /////////////////////////////////////////////////////////////////////        
        function test_deps() {
            return $q(function (resolve, reject) {
                logger.info("STARTUP STEP 1: checking required dependencies installed");
                dependency_manager.check_deps({
                    "binaries": ["dhcpd", "hostapd", "iw"],
                    "files":    ["/etc/init.d/isc-dhcp-server"]
                }, function(error) {
                    if (error) {
                        logger.error("STARTUP STEP 1: dependency error, did you run `sudo npm run-script provision`?");
                        reject(error);
                    } else {
                        logger.success("STARTUP STEP 1: dependencies successfully installed");
                        resolve();
                    }
                });                
            });
        }

        /////////////////////////////////////////////////////////////////////
        // STEP 2: Check if wifi is enabled / connected
        /////////////////////////////////////////////////////////////////////        
        function test_is_wifi_enabled() {
            return $q(function (resolve, reject) {
				logger.info("STARTUP STEP 2: checking wifi connection on WLAN0");
				wifi_manager.is_wifi_enabled(function(error, result_ip) {
					if (result_ip) {
						logger.success("STARTUP STEP 2: Wifi is enabled, and IP " + result_ip + " assigned");
						resolve();
					} else {
						logger.error("STARTUP STEP 2: Wifi is not enabled, enabling setup-mode");
						reject(error);
					}
				});  			
            });
        }

        /////////////////////////////////////////////////////////////////////
        // STEP 3: Check if device-ID already set
        /////////////////////////////////////////////////////////////////////
        function test_deviceID() {
            return $q(function (resolve, reject) {
                logger.info("STARTUP STEP 3: checking device-ID");
                logger.success("STARTUP STEP 3: device-ID already set");
                resolve();
                /*if (config.device.ID) {
                    next_step(null, true);
                } else {
                    next_step(null, false);
                }*/
            });
        }

        /////////////////////////////////////////////////////////////////////
        // STEP 4: Validate AccessToken
        /////////////////////////////////////////////////////////////////////
        function test_accesstoken() {
            return $q(function (resolve, reject) {
                logger.info("STARTUP STEP 4: checking access-token");
                logger.success("STARTUP STEP 4: access-token is valid");
                resolve();
            });
        }

        /////////////////////////////////////////////////////////////////////
        // STEP 5: Validate Playlist
        /////////////////////////////////////////////////////////////////////
        function test_playlist() {
            return $q(function (resolve, reject) {
                logger.info("STARTUP STEP 5: checking playlist");
		logger.success("STARTUP STEP 5: playlist is set and valid");
                resolve();
            });
        }             
        
        /////////////////////////////////////////////////////////////////////
        // Start SETUP Mode
        /////////////////////////////////////////////////////////////////////        
        function start_setup() {
            /*logger.info("starting webserver for user-interfaces");
            app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
            app.use(morgan('dev'));                                         // log every request to the console
            app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
            app.use(bodyParser.json());                                     // parse application/json
            app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
            app.use(methodOverride());

            // application -------------------------------------------------------------
            app.get('*', function(req, res) {
                res.sendfile('../../../pu/index.html'); // load the single view file (angular will handle the page changes on the front-end)
            });

            // listen (start app with node server.js) ======================================
            app.listen(config.server.port);
            logger.success("listening on port " + config.server.port);*/

            vm.mode = 'setup';
            logger.info('Starte im Modus:' + vm.mode);
	    $location.path('/setup');
        }
        
        /////////////////////////////////////////////////////////////////////
        // Start PLAYER Mode
        /////////////////////////////////////////////////////////////////////        
        function start_player() {
            vm.mode = 'player';
            logger.info('Starte im Modus:' + vm.mode);
	    $location.path('/player');
        }

        /////////////////////////////////////////////////////////////////////
        // Workflow
        /////////////////////////////////////////////////////////////////////        
        test_deps()
        .then(test_is_wifi_enabled())
        .then(test_deviceID())
        .then(test_accesstoken())
        .then(test_playlist())
        .then(start_player(), start_setup());
    }
})();
