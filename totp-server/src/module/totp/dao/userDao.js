const UserDao = require("../../../dao/commons/userDao");
const daoCommon = require('./tfaDaoCommon');

class TfaUserDao extends UserDao{

    constructor() {
        super();
        this.common = new daoCommon();
    }


}

module.exports = TfaUserDao;

