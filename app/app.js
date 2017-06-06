(function () {
    'use strict';

    angular
        .module('DeezerKids', [
            // Angular modules.
            'ngRoute',
            'ngCookies',
            'ngAnimate',
            'ngMaterial',
            'ngMessages'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$mdDateLocaleProvider', '$mdThemingProvider'];

    function config($routeProvider, $locationProvider, $mdDateLocaleProvider, $mdThemingProvider) {
        $routeProvider.otherwise({
            redirectTo: '/startup'
        });

        $mdDateLocaleProvider.months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        $mdDateLocaleProvider.shortMonths = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        $mdDateLocaleProvider.days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        $mdDateLocaleProvider.shortDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        // Can change week display to start on Monday.
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        // Example uses moment.js to parse and format dates.
        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'DD.MM.YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('DD.MM.YYYY');
        };
        $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
            return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
        };
        // In addition to date display, date components also need localized messages
        // for aria-labels for screen-reader users.
        $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
            return 'Woche ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Kalender';
        $mdDateLocaleProvider.msgOpenCalendar = 'Kalender öffnen';

        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('blue-grey');
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

    function run($rootScope, $location, $cookieStore, $http) {
        $rootScope.mode = null;
        
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to startup procedure if no mode is set
            var restrictedPage = $.inArray($location.path(), ['/startup']) === -1;
            var mode = $rootScope.mode;
            if (restrictedPage && mode == null) {
                $location.path('/startup');
            }
        });
    }
})();
