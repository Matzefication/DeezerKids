var LOGNS = 'DeezerKids:';
var APP_ID = '236482';

var DeezerKids = angular.module('DeezerKids', ["firebase"]);

DeezerKids.controller('AppController', function($scope, $rootScope, $http, $firebaseObject) {
	
	$scope.completed = false;	// Setup not yet completed

	function connectAccount() {
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

	
	function checkDeviceID() {
		$http.get('/api/device').then(
			function(result) {
				if (result.data == null) {
					console.log(LOGNS, 'Creating Device-ID');
					// ToDo create device-id from firebase and save to internal mongoDB
					$scope.device.id = '123456';
					$http.post('/api/device', $scope.device).then(
						function(result) {
							console.log(LOGNS, 'Device saved to database', result);
							connectAccount();
						},
						function(error) {
							console.log(LOGNS, 'Error while saving device: ' + error);
						});

					$scope.connectAccount();				
				} else {
					console.log(LOGNS, 'Device-ID already set');
					$scope.device = result;
					connectAccount();
				}
			},
			function(error) {
				console.log(LOGNS, 'Error: ' + error);
			});
	};
	
	function checkConnectivity() {
		var ref = firebase.database().ref();
		checkDeviceID();
	};
	
	function deleteAccount() {
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
	
	//////////////////////////////////////////////////////
	// STEP 1: check WLAN settings
	//////////////////////////////////////////////////////

	//////////////////////////////////////////////////////
	// STEP 2: check connectivity and connect to firebase
	//////////////////////////////////////////////////////
	checkConnectivity();
	
	//////////////////////////////////////////////////////
	// STEP 3: check device id
	//////////////////////////////////////////////////////	
	
	//////////////////////////////////////////////////////
	// STEP4: connect to Deezer account
	//////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////
	// STEP5: select playlist from Deezer account
	//////////////////////////////////////////////////////

	//////////////////////////////////////////////////////
	// STEP6: save account data to firebase
	//////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////
	// COMPLETED: setup already completed
	//////////////////////////////////////////////////////

});
