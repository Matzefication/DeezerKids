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
