angular.module('dreamChatApp').controller("LoginController", function ($scope, $http, $location) {
    $scope.login = function () {
        $http.post("/api/login", {"email": $scope.email})
            .success(function (user) {
                $scope.$emit('login', user)
                $location.path('/room')
            }).error(function (data) {
                $location.path('/login')
            })
    }
});