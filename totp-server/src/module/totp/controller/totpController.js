let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
const TOTP = require('../util/totp');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let AppKeyDao = require('../dao/appKeyDao');

let appKeyDao = new AppKeyDao();


router.get('/', function(req, res){
    console.log("incoming request for get app key");
    let userId = req.session.user.id;
    appKeyDao.findByUserId(userId).then( result => {
        res.status(200);
        if (result)
            res.json(result);
        else
            res.send();

        
    })
});

router.get('/:site', (req, res) => {

    let userId = req.session.user.id;

    appKeyDao.findByUserId(userId).then (keyList => {

        for (let key of keyList) {
            if (key.site === req.params.site)  {

                const otp = TOTP.getOTP(key.secret);
                res.status(200).send(otp);
                return;
            }

        }

        res.status(404).send("key not found!");

    }) ;

});

router.delete('/:id', function(req,res) {
    let id = req.params.id;

    appKeyDao.delete(id).then(result => {
        res.status(200).send(`Delete successfull for ${id}`);
    
    });

});

router.post('/', function(req, res){
    //let site = req.body.site;
    //let secret = req.body.secret;
    let body = req.body;
    let user = req.session.user;

    //console.log(`site: ${site}, secret: ${secret}`);
    //
    appKeyDao.addAppKey(body,user).then(result => {
        res.status(200).send();
    })
});

module.exports = router;
