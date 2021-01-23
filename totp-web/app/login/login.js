/**
 * Created by emrahsoytekin on 23.10.2017.
 */
'use strict';

angular.module('myApp.login',['ngRoute','core.keys'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        template : '<login-ctrl></login-ctrl>'
    });
}])

.component('loginCtrl',{

    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
})
.controller('LoginCtrl', ['$injector',function($injector) {

    var authenticationService = $injector.get('AuthenticationService');
    var $location = $injector.get("$location");
    var $rootScope = $injector.get("$rootScope");
    var authentication = $injector.get("Authentication");
    var User = $injector.get("User");
    var $scope = $rootScope.$new();

    var self = this;

    self.showLogin = true;



    $rootScope.currentPage = 'login';

    self.login = function(event) {
        event.preventDefault();
        var username = self.username;
        var password = self.password;
        if (!username || !password){
            return;
        }

        authenticationService.setCredentials(username,password);
        $location.path("#!/view1");
        $rootScope.currentPage = null;
    };

    self.showRegister = function(){
        self.showLogin = false;
    };

    self.register = function(){
        authentication.create(self.user, function successful(response){
            authenticationService.setCredentials(self.user.lgUsername,self.user.lgPassword);
            $location.path("#!/view1");
            $rootScope.currentPage = null;

        }, function error(response){
            console.log(response);
        });
    };

    if (window.localStorage.getItem("googleUser") !== null) {
        var googleUser = JSON.parse(window.localStorage.getItem("googleUser"));
        var firstName = googleUser.name.givenName;
        var lastName = googleUser.name.familyName;
        var email = googleUser.emails[0].value;
        var id = googleUser.id;

        authenticationService.setCredentials(email,id);
        var currentUser = $rootScope.globals.currentUser;
        var authData = currentUser.authData;

        $rootScope.globals.google = true;

        User.restricted(authData).query({id: id}).$promise.then(function(result){
            // $location.href="#!/view1";
            window.localStorage.removeItem("googleUser");
            window.location.href = "#!/view1";

        }, function(error){
            if (error.status === 401) {
                self.user = {};
                self.user.lgFirstName = firstName;
                self.user.lgLastName = lastName;
                self.user.lgUsername = email;
                self.user.lgPassword = id;
                self.user.lgEmail = email;
                self.register();
            } else {
                console.log(JSON.stringify(error));
            }
        });



    }

    self.onSuccess = function(googleUser) {
        var profile = googleUser.getBasicProfile();
        gapi.client.load('plus', 'v1', function () {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            //Display the user details
            request.execute(function (resp) {
                window.localStorage.setItem("googleUser", JSON.stringify(resp));
                // window.location.href="#!/login"
                var profileHTML = '<div class="profile"><div class="head">Welcome '+resp.name.givenName+'! <a href="javascript:void(0);" onclick="signOut();">Sign out</a></div>';
                profileHTML += '<img src="'+resp.image.url+'"/><div class="proDetails"><p>'+resp.displayName+'</p><p>'+resp.emails[0].value+'</p><p>'+resp.gender+'</p><p>'+resp.id+'</p><p><a href="'+resp.url+'">View Google+ Profile</a></p></div></div>';
                $('.userContent').html(profileHTML);
                $('#gSignIn').slideUp('slow');
            });
        });
    };
    self.onFailure = function(error) {
        console.log(error);
    };
    self.renderButton = function() {
        gapi.signin2.render('gSignIn', {
            'scope': 'profile email',
            'width': 158,
            'height': 30,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
    };

    self.signOut = function() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            $('.userContent').html('');
            $('#gSignIn').slideDown('slow');
        });
        window.localStorage.removeItem("googleUser");
    }


}]);

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
