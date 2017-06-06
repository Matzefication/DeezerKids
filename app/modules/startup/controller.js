(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('StartupController', StartupController);

    StartupController.$inject = ['$http', '$rootScope', '$location'];

    function StartupController($http, $rootScope, $location) {

        // Declarations
        var vm = this;
        vm.path = $location.path();

        (function initController() {
            // reset globals on startup
            $rootScope.globals = {};
        })();
    }
})();
