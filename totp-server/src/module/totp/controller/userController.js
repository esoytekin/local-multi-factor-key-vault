let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', function(req, res){
    let user = req.session.user;
    res.status(200).send(user);
});


module.exports = router;
