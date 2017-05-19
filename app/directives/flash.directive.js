(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .directive('spFlash', spFlash);

    function spFlash() {
        return {
            templateUrl: 'app/directives/flash.template.html',
            restrict: 'E',
            scope: {},
            controller: FlashController,
            controllerAs: 'vm'
        };
    }

    FlashController.$inject = ['$rootScope'];

    function FlashController($rootScope, FlashService) {
        var vm = this;

        vm.test = function () {
            alert($rootScope.flash.message);
        }

        vm.getFlash = function () {
            return $rootScope.flash;
        }
    }
})();
