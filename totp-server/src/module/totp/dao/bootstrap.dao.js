const TfaDaoCommon = require("./tfaDaoCommon");

class BootstrapDAO {

    constructor(){
        this.tfaDaoCommon = new TfaDaoCommon();
    }

    initializeDB(){
        this.createTableUsers();
        this.createTableAppKey();
    }

    createTableUsers(){
        const sql = `create table if not exists c_user
        (
            id integer
                primary key
                 autoincrement,
            create_date time,
            email text,
            enabled char,
            name text,
            password text,
            surname text,
            username text
        )`;

        return this.tfaDaoCommon.run(sql)
    }

    createTableAppKey() {

        const sql = `create table if not exists app_key
        (
            id integer
                primary key
                 autoincrement,
            site text,
            secret text,
            user_id integer,
            enabled char
        )`;
        return this.tfaDaoCommon.run(sql);
        
    }
}

module.exports = BootstrapDAO;