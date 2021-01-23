const express = require('express');
const app = express();

const tfaController = require('./module/totp/controller/tfaController');
//const taskpaperController = require('./module/taskpaper/controller/taskpaperController');
//const lightsController = require('./module/lights/controller/lightsController');
//const hexController = require('./module/hex/controller/hexController');
//const tokenGeneratorController = require("./module/hadi/controller/tokenGeneratorController");

app.use(express.static('app')); //serve static content in 'app' folder
app.use(function(req,res,next){
    // Website you wish to allow to connect
    let origin = req.get("origin");
    res.setHeader('Access-Control-Allow-Origin', origin ? origin : 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});


app.use('/tfa',tfaController);
//app.use('/taskpaper', taskpaperController);
//app.use('/lights', lightsController);
//app.use('/hex', hexController);
//app.use('/hadi', tokenGeneratorController);

module.exports = app;
