(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/modules/login/login.view.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
    }

    run.$inject = [];

    function run() {}

})();
