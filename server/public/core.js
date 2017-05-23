var LOGNS = 'DeezerKids:';
var APP_ID = '236482';
var CHANNEL_URL = 'http://www.beup2date.com/DeezerKids/channel.html';

var DeezerKids = angular.module('DeezerKids', ['firebase']);

DeezerKids.controller('AppController', function AppController($scope, $rootScope, $http, $firebaseObject) {
    
	// Init config
	$scope.login = false;

	// when landing on the page, get all accounts and show them
	$http.get('/api/accounts')
		.success(function(data) {
			if (data.length == 1) {
				console.log(LOGNS, 'Account already loggedin');
				$scope.account = data[0];
				$scope.login = true;
			} else {
				console.log(LOGNS, 'Account not loggedin yet');
				$scope.login = false;
			}
			console.log(LOGNS, data);
		})
		.error(function(data) {
			console.log(LOGNS, 'Error: ' + data);
		});

	// Global for test purpose
	rootScope = $rootScope;
	scope = $scope;

	DZ.init({
		appId: APP_ID,
		channelUrl: CHANNEL_URL
	});
	
	console.log(LOGNS, 'Deezer-API initialiazed successfully');

	// --------------------------------------------------- Methods

	$scope.doLogin = function() {
		$http.get('http://beup2date.com/DeezerKids/devices/123')
			.success(function(data) {
				console.log(LOGNS, data);
			})
			.error(function(data) {
				console.log(LOGNS, 'Error: ' + data);
			});		
	};
	
	$scope.doLogin2 = function() {
		console.log(LOGNS, 'login clicked');

		DZ.login(function(response) {
			if (response.authResponse) {
				console.log(LOGNS, 'successfully logged in with Token ', response.authResponse.accessToken);
				$scope.account.accessToken = response.authResponse.accessToken;
				$scope.account.expire = response.authResponse.expire;
				$scope.account.userID = response.userID;				
				createAccount();
			} else {
				console.log(LOGNS, 'login aborded by user');
				$scope.login = false;
			}
		}, {scope: 'basic_access,email,offline_access,manage_library'});
	};

	$scope.doLogout = function() {
		console.log(LOGNS, 'logout clicked');
	};	
	
	// save the account after login
	function createAccount() {
		$http.post('/api/accounts', $scope.account)
			.success(function(data) {
				console.log(LOGNS, 'Account saved to database', data);
				$scope.login = true;
			})
			.error(function(data) {
				console.log(LOGNS, 'Error while saving account: ' + data);
				$scope.login = false;
			});
	};

	// delete the account after logout
	function deleteAccount(id) {
		$http.delete('/api/accounts/' + id)
			.success(function(data) {
				$scope.account = { };
				console.log(LOGNS, 'Account successfully deleted', data);
				$scope.login = false;
			})
			.error(function(data) {
				console.log(LOGNS, 'Error while deleting account: ' + data);
			});
	};	
});
