const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
class AuthService {

    constructor(){
        this.passArr = [];
    }


    login(username, password, req) {
        let self = this;
        if (req.session && req.session.user) {
            console.log('authentication service: checking session user');
            return new Promise(function(resolve, reject) {
                let user = req.session.user;

                let result = self.checkCredentials(user, username, password, req);

                if (result){
                    resolve(result);
                } else {
                    console.error("wrong credentials");
                    reject(result)
                }

            })
        }

        console.log('authentication service: fetching user');

        return this.userDao.findByUsername(username).then( user => {
                console.log(`call for check credentials`);
                return self.checkCredentials(user, username, password, req);
        });


    }

    static logout(req, callback) {
        req.session.destroy(callback);
    }
    
    checkCredentials(user, username, password, req){

        if ( !user || user.username !== username)
            return false;

        if (this.passArr[password] && this.passArr[password] === user.password) {
            console.log("authentication service: retreiving from cache..");
            req.session.user = user;
            return true;
        }
        
        if (bcrypt.compareSync(password, user.password)) {

            this.passArr[password] = user.password;
            req.session.user = user;
            return true;
        }

        return false;
    }
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}

module.exports = AuthService;
