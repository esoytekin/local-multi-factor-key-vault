class AppKey {

    constructor(id, site, secret, userId, enabled){
        this.id = id;
        this.site = site;
        this.secret = secret;
        this.userId = userId;
        this.enabled = enabled;
    }

}

module.exports = AppKey;
