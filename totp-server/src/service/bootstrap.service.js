const BootstrapDAO = require("../module/totp/dao/bootstrap.dao");

class BootstrapService {

    constructor(){
        this.bootstrapDao = new BootstrapDAO();
    }

    initializeDB(){
        console.log("initializing db...");
        this.bootstrapDao.initializeDB();
    }



}

module.exports = BootstrapService;