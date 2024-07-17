const knex = require('../database/connection');

class ExpiredToken{
    async create(token){
        try{
            await knex.insert({
                token: token,
            }).table('invalidToken');
            return {status: true, token: token};
        } catch(err){
            console.log(err);
            return {status: false, err:err};
        };
    };

    async findByToken(token){
        try{
            const result = await knex.select(["token"]).where({token:token}).table("invalidToken");
            
            if(!result.length > 0){
                return undefined;
            };
                
            return result[0];
        
        } catch(err){
            console.log(err);
            return undefined;
        };
    };

    async 
  
};

module.exports = new ExpiredToken();