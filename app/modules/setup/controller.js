(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('SetupController', SetupController);

    SetupController.$inject = ['$http', '$rootScope', '$location'];

    function SetupController($http, $rootScope, $location) {

        // Declarations
        var vm = this;
        vm.path = $location.path();

        (function initController() {

        })();
    }
})();
