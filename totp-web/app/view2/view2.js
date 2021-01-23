'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    template : '<view2-ctrl></view2-ctrl>'
  });
}])

.component('view2Ctrl',{
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
})

.controller('View2Ctrl', ['Keys','$rootScope',function(Keys,$rootScope) {
    var totpObj = new TOTP();
    var self = this;


    if(!window.localStorage.getItem('user'))
        window.location.href = "#!/login";

    self.save = function(event){
        event.preventDefault();
    
        if (!self.txtSite || !self.txtSecret){
            alert("fill the required fields");
            return;
        }

        try {
            var sc = self.txtSecret.replace(new RegExp(" ","g"),"");
            var site = self.txtSite.replace(new RegExp(" ","g"),"");

            totpObj.getOTP(sc);


            var obj = {"site": site, "secret":sc };

            // self.keys = addItem(obj);

            var authData = window.localStorage.getItem('authData');
            Keys.restricted(authData).create(obj, function(response){
                window.location.href="#!/view1";
            });

        }catch(e){
            alert(e);
            console.log(e);
        
        }

        self.txtSite = "";
        self.txtSecret = "";

    
    }

}]);

var addItem = function(obj){
        var elems = window.localStorage.getItem("keys");
        var keys = JSON.parse(elems);

        keys.push(obj);
        window.localStorage.setItem("keys",JSON.stringify(keys));
        return keys;


};
