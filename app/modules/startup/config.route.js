(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/startup', {
                templateUrl: 'app/modules/startup/startup.view.html',
                controller: 'StartupController',
                controllerAs: 'vm'
            })
    }

    run.$inject = [];

    function run() {}

})();
