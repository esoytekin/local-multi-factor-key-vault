'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'core.keys',
    'monospaced.qrcode'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    template : '<view1-ctrl></view1-ctrl>'
  });
}])

.component('view1Ctrl',{

    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
})

.directive('focus', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focus);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
})


.controller('View1Ctrl', ['$injector' , function($injector) {

    var $interval = $injector.get('$interval');
    var $rootScope = $injector.get("$rootScope");
    var Keys = $injector.get("Keys");
    var User = $injector.get("User");
    var AuthenticationService = $injector.get("AuthenticationService");
    var $location = $injector.get("$location");


    var self = this;
    self.loading = false;
    self.showInfoLabel = false;
    var totpObj = new TOTP();



    if (!$rootScope.globals){
        if (window.localStorage.getItem("user")) {
            var username = window.localStorage.getItem('user');
            var auth = window.localStorage.getItem('authData');
            $rootScope.globals = {
                currentUser:{
                    username: username,
                    authData: auth
                }
            };

        } else {
            window.location.href = "#!/login";
            return;

        }
    }
    var currentUser = $rootScope.globals.currentUser;
    var authData = currentUser.authData;

    if (!window.localStorage.getItem('user')) {
        // $location.path("#!/login");
        window.location.href = "#!/login";
        return;
    }


    self.loading = true;
    getFromRemote(self, Keys, totpObj, authData, function(){
        getUser(self,User, authData);
    });



    $interval(function(){
        updateKeys(self.keys);
    }, 1000);



    self.delete = function(){

        var selectedItems = self.keys.filter(function(elem,index,self){return elem.selected});
        if (!confirm("Delete " + selectedItems.length + " items?" )){
            return;
        }

        self.keys = self.keys.filter(function(elem,index,self){
            return !selectedItems.includes(elem);
        });

        var currentUser = $rootScope.globals.currentUser;
        var authData = currentUser.authData;

        angular.forEach(selectedItems,function(item){
            Keys.restricted(authData).delete({id: item.id}).$promise.then(function(response){
                console.log(response);
            });
        });

    };

    self.checked = function(item){

        self.selected = self.keys.filter(function(elem,index,self){return elem.selected}).length>0;
    };

    self.keyCopy = function(keyEvent, filtered) {
        if (keyEvent.which === 13) {
            if (filtered.length<1)
                return;

            self.copy(filtered[0]);
            self.queryFilter = "";
        }
    };

    self.copy = function(item){


        var lblInfo;
        if( copyToClipboard(item.totp)) {
            lblInfo = item.site + " Copied...";
        } else {
            lblInfo ="Couldn't copy " + item.site + "!";
        }

        self.lblInfo = lblInfo;

        self.secs = 3;
        self.showInfoLabel = true;
        var labelTimer = $interval(function(){
            self.secs--;
            if (self.secs === 0){
                self.showInfoLabel = false;
                $interval.cancel(labelTimer);

            }

        },1000);

    };

    self.logout = function(){
        AuthenticationService.logout();
    };


    self.createQr = function(key) {
        var email = self.user.email;
        self.qrString = "otpauth://totp/"+key.site + ":" +email+"?secret=" + key.secret + "&issuer="+key.site;
        self.key = key;
        self.formattedKey = key.secret.replace(/\B(?=(?:.{4})+(?!.))/g,"-");
    };


}]);


var updateKeys = function(keys){
    var totpObj = new TOTP();
        angular.forEach(keys,function(result){
            result.time = totpObj.getTime();
            // result.totp = totpObj.getOTP(result.secret);
            if (result.time === 30){
                result.totp = totpObj.getOTP(result.secret);
            }

        });

};


var getFromRemote = function(self, Keys, totpObj,authData, callback) {
    if (!window.localStorage.getItem("authData"))
        return;
    Keys.restricted(authData).query().$promise.then(function(results){
        self.loading = false;

        if (results.length < 1){
            window.location.href="#!/view2";
        } else {
            angular.forEach(results,function(result){
                result.time = totpObj.getTime();
                result.totp = totpObj.getOTP(result.secret);

            });
            self.keys= results;
            callback();

        }
    }, function error(response){

        console.log(response.statusText);
        self.logout();

    });

};

var getUser = function(self, User, authData) {
    if (!window.localStorage.getItem("user"))
        return;
  User.restricted(authData).query().$promise.then(function(result){
      self.loading = false;
      self.user = result;
  }, function error(response){
      console.log(response.statusText);
      self.logout();
  });
};


function copyToClipboard(elem) {
    if (elem === undefined) {
        return false;
    }
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var origSelectionStart, origSelectionEnd;
        // must use a temporary form element for the selection and copy
    var target = document.createElement("textarea");
    target.style.position = "absolute";
    target.style.left = "-9999px";
    target.style.top = "0";
    target.id = targetId;
    document.body.appendChild(target);
    target.textContent = elem;
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
        // clear temporary content
    target.textContent = "";
    return succeed;
}

