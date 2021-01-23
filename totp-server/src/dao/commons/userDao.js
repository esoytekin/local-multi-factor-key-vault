const User = require("../../model/user");
const bcrypt = require('bcrypt-nodejs');


class UserDao {

    findByUsername(username) {

        let sqlRequest = "select id,username, password, name, surname, email, create_date from c_user where enabled = 'Y' and username=$username";
    
        let sqlParams = {$username : username};

        return this.common.findOne(sqlRequest, sqlParams).then(row => {
            let user = new User(row.id,row.username, row.password ,row.name, row.surname, row.email, row.create_date);

            return user;
        })
        .catch(err => {
            console.log(`userDAO: error occured for username ${username} - ${(err)}`);
            console.log(`userDAO: error occured ${JSON.stringify(err)}`);
        
        });

    }

    create(newUser){
        let sqlRequest = "insert into c_user (username, password, name, surname, email, create_date, enabled ) values ($username, $password,$name,$surname,$email,$date, $enabled)";
        let date = new Date();

        let dcPassword = newUser.lgPassword;

        const salt = bcrypt.genSaltSync(10);
        let encPassword = bcrypt.hashSync(dcPassword,salt);

        let sqlParams = {
            $username : newUser.lgUsername,
            $password : encPassword,
            $name : newUser.lgFirstName,
            $surname: newUser.lgLastName,
            $email: newUser.lgEmail,
            $date : date,
            $enabled: 'Y'
        
        }

        return this.common.run(sqlRequest, sqlParams).then (result => {
            return result;
        
        })

    
    }

}

module.exports = UserDao;

