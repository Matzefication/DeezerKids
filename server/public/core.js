var DeezerKids = angular.module('DeezerKids', []);

function mainController($scope, $http) {
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

}

