let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let UserDao = require("../dao/userDao");

let userDao = new UserDao();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function(req,res){
    console.log(`incoming post request for ${JSON.stringify(req.body)} `);

    if (req.body.lgUsername) {
        userDao.create(req.body).then(result => {
            res.status(200).send();
        })
    }
});

module.exports = router;
