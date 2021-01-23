const AuthService = require('../../../service/authService');
const UserDao = require('../dao/userDao');

class TfaAuthService extends AuthService {
    constructor(){
        super();
        this.userDao = new UserDao();
    }

}

module.exports = TfaAuthService;
