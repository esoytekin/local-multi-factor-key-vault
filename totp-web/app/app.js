'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.login',
    'myApp.header',
    'myApp.version',
    'core',
    'satellizer'
]).config(['$locationProvider', '$routeProvider', '$httpProvider','$authProvider', function ($locationProvider, $routeProvider, $httpProvider, $authProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/view1'});

    $authProvider.google({
        clientId: '724805746810-679jcgi7uu27ujdanv84ilgrci2efcr9.apps.googleusercontent.com'
    })
}]);
