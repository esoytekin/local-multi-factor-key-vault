/**
 * Created by emrahsoytekin on 24.10.2017.
 */
'use strict';

angular.module('myApp.header',['core.keys'])

    .component('header',{

        templateUrl: 'header/header.html',
        controller: 'Header'
    })
    .controller('Header', ['AuthenticationService','$location','$rootScope',function(AuthenticationService,$location,$rootScope) {

        var self = this;


        self.logout = AuthenticationService.logout;



        // self.showLogout = $location.path().indexOf("login") > -1;
        self.showLogout = $rootScope.globals;

        $rootScope.$watch('currentPage', function (newPage, oldPage){
            self.showLogout = newPage !== 'login';

        });

    }]);
