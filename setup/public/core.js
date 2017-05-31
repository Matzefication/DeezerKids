var LOGNS = 'DeezerKids:';
var APP_ID = '236482';

var DeezerKids = angular.module('DeezerKids', ["firebase"]);

DeezerKids.controller('AppController', function($scope, $rootScope, $http, $firebaseObject) {
	
	$scope.completed = false;	// Setup not yet completed

	//////////////////////////////////////////////////////
	// STEP 1: check WLAN settings
	//////////////////////////////////////////////////////
	$scope.step = 1;
	$scope.checkConnectivity();

	//////////////////////////////////////////////////////
	// STEP 2: check connectivity and connect to firebase
	//////////////////////////////////////////////////////
	$scope.checkConnectivity = function() {
		$scope.step = 2;
		
		var ref = firebase.database().ref();
		$scope.checkDeviceID();
	};

	//////////////////////////////////////////////////////
	// STEP 3: check device id
	//////////////////////////////////////////////////////	
	$scope.checkDeviceID = function() {
		$scope.step = 3;
		
		$http.get('/api/device').then(
			function(result) {
				if (result.data == null) {
					console.log(LOGNS, 'Creating Device-ID');
					// ToDo create device-id from firebase and save to internal mongoDB
					$scope.device.id = '123456';
					$http.post('/api/device', $scope.device).then(
						function(result) {
							console.log(LOGNS, 'Device saved to database', result);
							$scope.completed = true;
						},
						function(error) {
							console.log(LOGNS, 'Error while saving device: ' + error);
							$scope.completed = false;
						});
					
					$scope.connectAccount();				
				} else {
					console.log(LOGNS, 'Device-ID already set');
					$scope.device = result;
				}
			},
			function(error) {
				console.log(LOGNS, 'Error: ' + error);
			});
	};
	
	//////////////////////////////////////////////////////
	// STEP4: connect to Deezer account
	//////////////////////////////////////////////////////
	$scope.connectAccount = function() {
		$scope.step = 4;
		
		DZ.init({
			appId: APP_ID,
			channelUrl: 'http://www.beup2date.com/DeezerKids/devices/' + $scope.device.id + '/setAccessToken'
		});
		console.log(LOGNS, 'Deezer-API initialiazed successfully');
		
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
	
	//////////////////////////////////////////////////////
	// STEP5: select playlist from Deezer account
	//////////////////////////////////////////////////////
	$scope.selectPlaylist = function() {
		$scope.step = 5;
	};

	//////////////////////////////////////////////////////
	// STEP6: save account data to firebase
	//////////////////////////////////////////////////////
	$scope.saveAccount = function() {
		$scope.step = 6;
	};
	
	//////////////////////////////////////////////////////
	// COMPLETED: setup already completed
	//////////////////////////////////////////////////////
	$scope.deleteAccount = function deleteAccount() {
		$http.delete('/api/account').then(
			function(result) {
				$scope.account = { };
				console.log(LOGNS, 'Account successfully deleted');
				$scope.login = false;
			},
			function(error) {
				console.log(LOGNS, 'Error while deleting account: ' + error);
			});
	};
});
