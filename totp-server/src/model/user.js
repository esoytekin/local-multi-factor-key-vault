class User {
    
    constructor(id,username, password, name, surname, email, date){
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.date = date;
    }
}

module.exports = User;
