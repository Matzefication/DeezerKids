var LOGNS = 'DeezerKids ::';
var APP_ID = '236482';
var CHANNEL_URL = 'http://www.beup2date.com/DeezerKids/channel.html';

var DeezerKids = angular.module('DeezerKids', []);

DeezerKids.controller("AppController", function($scope, $route, $routeParams, $location, $rootScope) {
    
	$scope.formData = {};

	// when landing on the page, get all accounts and show them
	$http.get('/api/accounts')
		.success(function(data) {
			$scope.accounts = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createAccount = function() {
		$http.post('/api/accounts', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.accounts = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a account after checking it
	$scope.deleteAccount = function(id) {
		$http.delete('/api/accounts/' + id)
			.success(function(data) {
				$scope.accounts = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};    
    
	// Init config
	$scope.logged = false;

	// Global for test purpose
	rootScope = $rootScope;
	scope = $scope;

	DZ.init({
		appId: APP_ID,
		channelUrl: CHANNEL_URL,
		player: {

		}
	});

	// --------------------------------------------------- Methods

	$scope.login = function() {
		console.log(LOGNS, 'login clicked');

		DZ.login(function(response) {
			if (response.authResponse) {
				console.log(LOGNS, 'logged');
				$scope.logged();
			} else {
				console.log(LOGNS, 'not logged');
			}
		}, {scope: 'manage_library,basic_access'});
	};

	$scope.logged = function() {
		$scope.logged = true;
		console.log(LOGNS, 'Player loaded');
		$('#controls').css('opacity', 1);
		$scope.handleRoute();
	};

	// --------------------------------------------------- Angular events

	$scope.$on("$routeChangeSuccess", function($currentRoute, $previousRoute) {
		if ($scope.logged) {
			if ($route.current.action !== 'search') {
				$scope.last_path = $location.path(); // when empty search go to this
			}

			$scope.handleRoute();
		}
	});

	// --------------------------------------------------- DZ events

	DZ.Event.subscribe('player_loaded', function(){
		console.log(LOGNS, 'check login...');

		DZ.getLoginStatus(function(response) {
			if (response.authResponse) {
				console.log(LOGNS, 'check login: logged');
				$scope.logged();
			} else {
				console.log(LOGNS, 'check login: not logged');
				$scope.view = 'login';
			}
			$scope.$apply();
		}, {scope: 'manage_library,basic_access'});
	});
});
