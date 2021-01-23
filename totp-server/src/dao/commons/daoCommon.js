//const database = require("../../db/db");

/* Load bluebird Promise */
const Promise = require('bluebird');

const DaoError = require('./daoError');


class Common {
    
    findAll(sqlRequest, sqlParams){
    
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.all(sqlRequest, sqlParams, function (err, rows) {
                if (err) {
                    reject(
                        new DaoError(20, "Internal server error")
                    );
                } else {
                    resolve(rows);
                }
            })
        
        });
    }

    findOne(sqlRequest, sqlParams) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(sqlRequest, sqlParams, function(err, row) {
                if (err) {
                    reject(
                        new DaoError(20, "Internal server error")
                    );
                } else if(row === null) {
                    reject(
                        new DaoError(21, "Entity not found : " + JSON.stringify(sqlParams))
                    );
                } else {
                    resolve(row);
                }

                
            })
            
        });
    
    }

    run(sqlRequest, sqlParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let stmt = self.db.prepare(sqlRequest);
            stmt.run(sqlParams, function (err) {
                if (this.changes === 1) {
                    if (this.lastID){
                        resolve(this.lastID);
                    } else {
                        resolve(true);
                    }
                } else if (this.changes === 0) {
                    reject(
                        new DaoError(21, "Entity not found")
                    )
                } else {
                    reject(
                        new DaoError(11, "Invalid arguments")
                    )
                }
            })
        });
    }


}

module.exports = Common;
