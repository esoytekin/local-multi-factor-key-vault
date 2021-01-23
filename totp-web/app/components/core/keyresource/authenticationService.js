/**
 * Created by emrahsoytekin on 23.10.2017.
 */
angular.module('core.keys').service('AuthenticationService',['$rootScope','$http',function($rootScope,$http){

    this.setCredentials = function setCredentials(username, password){
        var authData = btoa(username+":"+password);
        $rootScope.globals = {
            currentUser:{
                username: username,
                authData: authData
            }
        };

        window.localStorage.setItem('user', username);
        window.localStorage.setItem('authData',authData);

    };

    this.logout = function logout(){

        $http({
            url : `${baseUrl}/logout`,
            method: 'POST',
            withCredentials: true
        
        })
        .then(clearData).catch(function(data){
            console.log(JSON.stringify(data));
            clearData();
        });

    }


    function clearData(){
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('authData');
        if ($rootScope.globals.google) {
            signOut();
        }
        $rootScope.globals = null;
        window.location.href="#!/login";
    }

}]);

