(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .factory('FlashService', FlashService);

    FlashService.$inject = ['$rootScope', '$timeout', '$mdDialog'];

    function FlashService($rootScope, $timeout, $mdDialog) {
        var service = {};

        initService();

        service.Success = function (message, keepAfterLocationChange) {
            setAlert('success', message, keepAfterLocationChange);
        }

        service.Info = function (message, keepAfterLocationChange) {
            setAlert('info', message, keepAfterLocationChange);
        }

        service.Warning = function (message, keepAfterLocationChange) {
            setAlert('warning', message, keepAfterLocationChange);
        }

        service.Error = function (message, keepAfterLocationChange) {
            setAlert('error', message, keepAfterLocationChange);
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Ups ... es ist ein Fehler aufgetreten.')
                .textContent(message.message)
                .ok('Oki Doki')
            );
        }

        service.Clear = function () {
            clearFlashMessage();
        }

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });
        }

        function setAlert(type, message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: type,
                keepAfterLocationChange: keepAfterLocationChange,
                expired: false
            };

            //$timeout(atTimeout, 2000);
        }

        function clearFlashMessage() {
            if ($rootScope.flash) {
                if (!$rootScope.flash.keepAfterLocationChange) {
                    delete $rootScope.flash;
                } else {
                    // only keep for a single location change
                    $rootScope.flash.keepAfterLocationChange = false;
                }
            }
        }

        function atTimeout() {
            $rootScope.flash.expired = true;
        }
    }

})();
