(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$http', '$cookieStore', '$rootScope', '$location', 'Auth', 'FlashService', '$mdDialog', 'LoadingService'];

    function LoginController($http, $cookieStore, $rootScope, $location, Auth, FlashService, $mdDialog, LoadingService) {

        // Declarations
        var vm = this;
        vm.path = $location.path();

        (function initController() {
            // reset login status
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        })();

        // Public functions
        vm.login = function () {
            // Ladesymbol anzeigen
            LoadingService.Start();

            Auth.$signInWithEmailAndPassword(vm.username, vm.password)
                .then(function (firebaseUser) {
                    $rootScope.globals = {
                        currentUser: {
                            username: firebaseUser.email,
                            name: firebaseUser.displayName,
                            uid: firebaseUser.uid
                        }
                    };

                    $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.uid
                    $cookieStore.put('globals', $rootScope.globals);

                    $location.path('/');
                })
                .catch(function (error) {
                    // Ladesymbol ausblenden
                    LoadingService.Stop();

                    FlashService.Error(error);
                });
        };

        vm.register = function () {
            // Ladesymbol anzeigen
            LoadingService.Start();

            // Benutzer registrieren
            Auth.$createUserWithEmailAndPassword(vm.username, vm.password)
                .then(function (firebaseUser) {
                    firebaseUser.updateProfile({
                            displayName: vm.name
                        })
                        .then(function () {
                            $rootScope.globals = {
                                currentUser: {
                                    username: firebaseUser.email,
                                    name: firebaseUser.displayName,
                                    uid: firebaseUser.uid
                                }
                            };

                            $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.uid
                            $cookieStore.put('globals', $rootScope.globals);

                            $location.path('/');
                        })
                        .catch(function (error) {
                            // Ladesymbol ausblenden
                            LoadingService.Stop();

                            FlashService.Error(error);
                        });
                })
                .catch(function (error) {
                    // Ladesymbol ausblenden
                    LoadingService.Stop();

                    FlashService.Error(error);
                });
        };

        vm.newpwd = function () {
            // Ladesymbol anzeigen
            LoadingService.Start();

            Auth.$sendPasswordResetEmail(vm.username)
                .then(function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Passwort-Reset erfolgreich.')
                        .textContent('Wir haben Ihnen eine E-Mail mit einer Anleitung zum Zurücksetzen Ihres Passwortes zugeschickt.')
                        .ok('Oki Doki')
                    );

                    // Ladesymbol ausblenden
                    LoadingService.Stop();

                    $location.path('/login');
                }).catch(function (error) {
                    // Ladesymbol ausblenden
                    LoadingService.Stop();

                    FlashService.Error(error);
                });
        };
    }
})();
