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
            redirectTo: '/login'
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
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.uid;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
})();
