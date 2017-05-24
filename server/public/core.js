var LOGNS = 'DeezerKids:';
var APP_ID = '236482';
var CHANNEL_URL = 'http://www.beup2date.com/DeezerKids/channel.html';

var DeezerKids = angular.module('DeezerKids', []);

DeezerKids.controller('AppController', function($scope, $rootScope, $http) {
	
	//////////////////////////////////////////////////////
	// STEP1: check if device setup already completed
	//////////////////////////////////////////////////////
	$scope.completed = false;
	$scope.step = 1;
	$http.get('/api/account').then(
		function(data) {
			if (data) {
				console.log(LOGNS, 'DeezerKids setup already completed');
				$scope.account = data;
				$scope.completed = true;
			} else {
				console.log(LOGNS, 'Starting DeezerKids setup');
				$scope.completed = false;
				$scope.step = 2;
			}
			console.log(LOGNS, data);
		},
		function(data) {
			console.log(LOGNS, 'Error: ' + data);
		});	

	//////////////////////////////////////////////////////
	// STEP2: setup WLAN connection
	//////////////////////////////////////////////////////
	$scope.setupWLAN = function() {
	};
	
	//////////////////////////////////////////////////////
	// STEP3: connect to Deezer account
	//////////////////////////////////////////////////////
	$scope.connectAccount = function() {
		$http.get('http://beup2date.com/DeezerKids/devices/123')
			.success(function(data) {
				console.log(LOGNS, data);
			})
			.error(function(data) {
				console.log(LOGNS, 'Error: ' + data);
			});	
	};
	
	//////////////////////////////////////////////////////
	// STEP4: select playlist from Deezer account
	//////////////////////////////////////////////////////
	$scope.selectPlaylist = function() {
		DZ.init({
			appId: APP_ID,
			channelUrl: CHANNEL_URL
		});	
		console.log(LOGNS, 'Deezer-API initialiazed successfully');

		console.log(LOGNS, 'login clicked');	
	};

	//////////////////////////////////////////////////////
	// STEP5: save account data to mongodb
	//////////////////////////////////////////////////////
	$scope.saveAccount = function() {
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
	
	//////////////////////////////////////////////////////
	// COMPLETED: setup already completed
	//////////////////////////////////////////////////////
	$scope.deleteAccount = function deleteAccount() {
		$http.delete('/api/account')
			.success(function(data) {
				$scope.account = { };
				console.log(LOGNS, 'Account successfully deleted', data);
				$scope.login = false;
			})
			.error(function(data) {
				console.log(LOGNS, 'Error while deleting account: ' + data);
			});
	};		


	// --------------------------------------------------- Methods

	$scope.doLogin = function() {
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
});
