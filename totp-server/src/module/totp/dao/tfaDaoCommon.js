const database = require("../db/tfaDb");
const Common = require("../../../dao/commons/daoCommon");

class TfaDaoCommon extends Common {
    constructor(){
        super();
        this.db = database;
    }
}

module.exports = TfaDaoCommon;
