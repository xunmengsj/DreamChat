angular.module('dreamChatApp', ['ngRoute']);
angular.module('dreamChatApp').config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider.
        when('/room', {
            templateUrl: '/templates/room.html',
            controller: 'RoomController'
        }).
        when('/login', {
            templateUrl: '/templates/login.html',
            controller: 'LoginController'
        }).
        otherwise({
            redirectTo: '/login'
        })
});
angular.module('dreamChatApp').
    run(function ($window, $rootScope, $http, $location) {
        $http.get("/api/validate")
            .success(function (user) {
                $rootScope.me = user;
                if($location.path() === "/login") {
                    $rootScope.logout();
                }
                if($location.path() === "/") {
                    $location.path('/room')
                }
            })
            .error(function (data) {
                $location.path('/login')
            });
        $rootScope.logout = function () {
            $http.get("/api/logout")
                .success(function () {
                    $rootScope.me = null;
                    $location.path('/login');
                });
        };
        $rootScope.$on('login', function (evt, me) {
            $rootScope.me = me;
        });
    });
