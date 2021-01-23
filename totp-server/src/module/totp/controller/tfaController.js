let express = require('express');
const session = require('express-session');
let router = express.Router();
let bodyParser = require('body-parser');

let totpController = require("./totpController");
let userController = require("./userController");
let loginController = require("./loginController");

const AuthService = require('../service/tfaAuthService');
const BootstrapService = require('../../../service/bootstrap.service');

let authService = new AuthService();
const bootstrapService = new BootstrapService();

bootstrapService.initializeDB();

router.use(session({
   genid: function(req) {
      return AuthService.guid() // use UUIDs for session IDs
    },
    secret:"11112",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 999999999,
        path: '/tfa',
        httpOnly: false
    },
    duration: 30 * 60 * 1000, 
    activeDuration: 5 * 60 * 1000,

}));


router.use(function(req,res,next){
    let start = new Date().getMilliseconds();
    let auth = req.headers['authorization'];

    if (req.url === '/login' || req.url === '/logout') {
        next();
        return;
    }

    if (!auth) {
        res.statusCode = 401;
         //res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

        console.log(req.session.id);
        res.end('<html><body>Need some creds son</body></html>');
        //res.end();
        return;
    }



    let tmp = auth.split(' ');
    let buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
    let plain_auth = buf.toString();        // read it back out as a string

    // At this point plain_auth = "username:password" 
    
    let creds = plain_auth.split(':');      // split on a ':'
    let username = creds[0];
    let password = creds[1];
    

    //console.log(`username : ${username}, password: ${password}`);

    authService.login(username, password, req).then(resp => {
        let end = new Date().getMilliseconds();

        let total = (end-start) / 1000;

        console.log(`authentication took ${total} seconds`);

        if (!resp) {
            res.statusCode = 401;
             //res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

            //res.end('<html><body>Provided credentials are not correct!</body></html>');
            res.end();
            return;
            
        }

        console.log(req.session.id);

        sess = req.session;

        next();
        
    })
    .catch(resp => {
        res.statusCode = 401;
        //res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

        res.end('<html><body>Provided credentials are not correct!</body></html>');

    });
});


router.use("/totp", totpController);
router.use("/user", userController);
router.use("/login", loginController);
router.use("/logout",function(req,res){
    AuthService.logout(req, function(err){
        console.log(`logout completed with ${err}`);
        if (err) {
            res.status(500).send("Internal server error! " + JSON.stringify(err));
        } else {
            res.status(200).send();
        }
        
    });

});

module.exports = router;
