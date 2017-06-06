(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('PlayerController', PlayerController);

    PlayerController.$inject = ['$rootScope', '$scope', '$location'];

    function PlayerController($rootScope, $scope, $location) {

        //--- Declarations ---//
        var vm = this; // Der Controller selbst

        // Modus
        vm.mode = {};
    }

})();
