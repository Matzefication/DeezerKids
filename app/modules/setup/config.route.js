(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/setup', {
                templateUrl: 'app/modules/setup/setup.view.html',
                controller: 'SetupController',
                controllerAs: 'vm'
            })
    }

    run.$inject = [];

    function run() {}

})();
