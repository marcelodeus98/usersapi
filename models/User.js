const knex = require('../database/connection');
const bcrypt = require('bcrypt');

class User{
    async findAll(){
        try{
            const result = await knex.select(["id", "name", "email", "role"]).table("users");
            return result;
        } catch(err){
            console.log(err);
            return [];
        };
    };

    async findById(id){
        try{
            const result = await knex.select(["id", "name", "email", "role"]).where({id:id}).table("users");
            
            if(!result.length > 0){
                return undefined;
            };
                
            return result[0];
        
        } catch(err){
            console.log(err);
            return undefined;
        };
    };

    async findByEmail(email){
        try{
            const result = await knex.select(["id", "name", "email", "password", "role"]).where({email:email}).table("users");
            
            if(!result.length > 0){
                return undefined;
            };
            
            return result[0];
        } catch(err){
            console.log(err);
            return undefined;
        };
    };

    async create(name, email, password, role){
        try{
            const hash = await bcrypt.hash(password, 10);

            await knex.insert({ name, email, password: hash, role }).table("users");
        } catch(err){
            console.log(err);
        };
    };

    async findEmail(email){
        try{
            const result = await knex.select("*").from("users").where({email:email});

            if(!result.length > 0){
                return false;
            };
            
            return true;
        } catch(err){  
            console.log(err);
        };
    };

    async update(id, name, email, role){
        const user = await this.findById(id);

        if(!user){
            return {status: false, err: "The user not exist"};
        };
        
        const editUser = {};

        if(email){
            const result = await this.findEmail(email);
            
            if(result){
                return {status: false, err: "Email is already in use."};
            };
            
            editUser.email = email;
        };

        if(name){
            editUser.name = name;
        };

        if(role){
            editUser.role = role;
        };

        try{
            await knex.update(editUser).where({id: id}).table("users");
            return {status: true};
        } catch(err){
            return {status: false, err: err};
        };
    };

    async passwordUpdate(newPassword, id, token){
        try{
            const hash = await bcrypt.hash(newPassword, 10);
            await knex.update({password: hash}).where({id: id}).table("users");
        } catch(err){
            console.log(err);
        }
    }

    async delete(id){
        try{
            await knex.select("*").from("users").where({id: id}).del();
        } catch(err){
            console.log(err);
        };
    };
};

module.exports = new User();