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
