(function () {
    'use strict';

    angular
        .module('DeezerKids')
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider.when('/player', {
            templateUrl: 'app/modules/player/player.view.html',
            controller: 'PlayerController',
            controllerAs: 'vm'
        });
    }

    run.$inject = [];

    function run() {}

})();
