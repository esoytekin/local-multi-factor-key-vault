const AppKey = require("../model/appkey");

const daoCommon = require('./tfaDaoCommon');

class AppKeyDao {

    constructor() {
        this.common = new daoCommon();
    }


    findByUserId(userId) {


        let start = new Date().getMilliseconds();
        let sqlRequest = "select id,site,secret,user_id,enabled from app_key where user_id = $userId and enabled = 'Y'";
    
        let sqlParams = {$userId : userId};

        return this.common.findAll(sqlRequest, sqlParams).then(rows => {
            let appKeys = [];
            for (const row of rows) {
                appKeys.push(new AppKey(row.id, row.site, row.secret, row.user_id, row.enabled));
            }

            let end = new Date().getMilliseconds();

            let total = ( end - start ) / 1000;

            console.log(`appkeydao: find by userId took ${total} seconds!`);

            return appKeys;
        })
        .catch(err => {
            console.log(err);
        
        })

    }


    addAppKey(body, user){
        let sqlRequest = "insert into app_key (site, secret, user_id, enabled) values ($site,$secret,$userId,'Y')";
        let sqlParams = {
            $site : body.site,
            $secret: body.secret,
            $userId : user.id
        };

        return this.common.run(sqlRequest, sqlParams).then(result => {
            return result;
        });
    }

    delete(id) {
        let sqlRequest = "delete from app_key where id = $id";
        let sqlParams = {$id:id};

        return this.common.run(sqlRequest, sqlParams).then (result => {
            return result;
        })
    }

}

module.exports = AppKeyDao;

