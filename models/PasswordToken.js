const knex = require('../database/connection');
const User = require('./User');

class PasswordToken{
    async create(email){
      const user = await User.findByEmail(email);
      if(user != undefined){
        try{
            const token = Date.now();

            await knex.insert({
                userId: user.id,
                used: 0,
                token: token
            }).table('passwordTokens');
            return {status: true, token: token};
        } catch(err){
            console.log(err);
            return {status: false, err:err};
        }
      } else{
        return {status: false, err: 'The email provid was not found in the database.'}
      };
    };

    async validate(token){
      try{
        const result = await knex.select().where({token: token}).table('passwordTokens');

        if(!result.length > 0){
          return {status: false};
        };

        const tk = result[0];

        if(!tk.used){
          return {status: true, token: tk};
        };
        
        return {status: false}; 
     } catch(err){
      console.log(err);
      return {status: false};
     };
    };

    async setUsed(token){
      try{
        await knex.update({used: 1}).where({token: token}).table('passwordTokens');
      } catch(err){
        console.log(err);
        return {status: false};
      };
    };

    async delete(token){
      try{
        await knex.select().from("passwordTokens").where({token: token}).del();
    } catch(err){
        console.log(err);
    };
    }
};

module.exports = new PasswordToken();