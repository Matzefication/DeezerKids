var config  = require("../config.json");

(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .factory('LoggerService', LoggerService);

    LoggerService.$inject = ['$rootScope'];

    function LoggerService($rootScope) {
        var service = {};
        
        service.Error = function (message) {
            logMessage('Error', message);
        }
        
        return service;
        
        function logMessage(type, message) {
            console.log(config.logger.message + type + ":\t" + message);
        }        
    }

})();
