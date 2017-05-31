var LOGNS = 'DeezerKids:';
var APP_ID = '236482';

var DeezerKids = angular.module('DeezerKids', ["firebase"]);

DeezerKids.controller('AppController', function($scope, $rootScope, $http, $firebaseObject) {
	
	$scope.completed = false;	// Setup not yet completed
	
	//////////////////////////////////////////////////////
	// STEP 1: check WLAN settings
	//////////////////////////////////////////////////////
	$scope.step = 1;
	
	//////////////////////////////////////////////////////
	// STEP 2: check connectivity and connect to firebase
	//////////////////////////////////////////////////////	
	$scope.step = 2;
	var ref = firebase.database().ref();

	//////////////////////////////////////////////////////
	// STEP 3: check device id
	//////////////////////////////////////////////////////	
	$scope.step = 3;
	$http.get('/api/account').then(
		function(result) {
			if (result.data == null) {
				console.log(LOGNS, 'Creating Device-ID');
				$scope.completed = false;
				$scope.step = 2;
			} else {
				console.log(LOGNS, 'Device-ID already set');
				$scope.account = result;
				$scope.completed = true;
			}
			console.log(LOGNS, result);
		},
		function(error) {
			console.log(LOGNS, 'Error: ' + error);
		});	
	
	//////////////////////////////////////////////////////
	// STEP4: connect to Deezer account
	//////////////////////////////////////////////////////
	$scope.connectAccount = function() {
		DZ.init({
			appId: APP_ID,
			channelUrl: 'http://www.beup2date.com/DeezerKids/devices/' + $scope.deviceid + '/setAccessToken'
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
	// STEP4: select playlist from Deezer account
	//////////////////////////////////////////////////////
	$scope.selectPlaylist = function() {

	};

	//////////////////////////////////////////////////////
	// STEP5: save account data to mongodb
	//////////////////////////////////////////////////////
	$scope.saveAccount = function() {
		$http.post('/api/accounts', $scope.account).then(
			function(result) {
				console.log(LOGNS, 'Account saved to database', result);
				$scope.completed = true;
			},
			function(error) {
				console.log(LOGNS, 'Error while saving account: ' + error);
				$scope.completed = false;
			});
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
