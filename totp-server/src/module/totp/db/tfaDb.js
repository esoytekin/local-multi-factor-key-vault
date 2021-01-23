const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./schema/totp.db',  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,(err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("connected to db : tfa");
});

module.exports = db;
