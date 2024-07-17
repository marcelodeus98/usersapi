const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const ExpiredToken = require('../models/ExpiredToken');
const emailSending = require('../submitEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = '*@SeCrEt@242628asd@*'

class UserController{
    async login(req, res){
        const {email, password} = req.body;
        try{
            const user = await User.findByEmail(email);

            if(!user){
                res.status(401).json({status: false});
                return;
            };

            const result = await bcrypt.compare(password, user.password);

            if(!result){
                res.status(401).send("Password entered is incorrect");
                return;
            };

            const token = jwt.sign({email: user.email, role: user.role}, secret);
            res.status(200).json({token: token});
        } catch(err){
            res.status(400).json({err});
        };
    };

    async logout(req, res){
        const authToken = req.headers['authorization'];
        if (!authToken) {
            res.status(403).send("You are not authenticated");
            return;
        }
        
        const bearer = authToken.split(' ');
        const token = bearer[1];
    
        try {
            const result = await ExpiredToken.create(token);
            res.status(200).send("Logout successful");
        } catch (err) {
            res.status(403).send("Invalid token");
        }
    };

    async list(req, res){
        try{
            let users = await User.findAll();
            res.json({users});
        } catch(err){
            res.status(400).json({err});
        };
    };

    async listUserId(req, res){
        try{
           const id = req.params.id
           const user = await User.findById(id);
            
            if(!user){
                res.status(404).json({msg: 'User not found'});
                return;
            };
            
            res.status(200).json({user});


        } catch(err){
            res.status(400).json({err});
        };        
    };

    async create(req, res){
       const { name, email, password, role } = req.body;
       const errors = [];
        
        try{
            if(!email){
                errors.push('Email not provided');
            };

            const existEmail = await User.findEmail(email);
            if(existEmail){
                errors.push('Email is already in use.');
            };
            
            if(!password){
                errors.push('Password not provided.');
            };
            
            if(errors.length > 0){
                res.status(400).json({msg: errors});
                return;
            };

            await User.create(name, email, password, role);
            res.status(200).json({msg:'User created'});

        } catch(err){
            res.status(400).json({err});
        };
    };

    async toAlter(req, res){
        try{
           const id = req.params.id;
           const {name, email, role} = req.body;

           const result = await User.update(id, name, email, role);

            if(!result){
                res.status(406).json(result.err);
                return;
            };

            if(!result.status){
                res.status(406).json(result.err);
                return;
            };
            
            res.status(200).json({msg:'Changing the user'});

        } catch(err){
            res.status(400).json({err});
        };
    };

    async delete(req, res){
       const id = req.params.id;
        
        try{
            const existId = await User.findById(id);
            if(!existId){
               res.status(404).json({msg:'ID entered does not exist'});
               return;
            };

            await User.delete(id);
            res.status(200).json({msg:'Deleting the user'});
        } catch(err){
            res.status(400).json({err});
        };
    };

    async recoverPassword(req, res){
       const email = req.body.email;

        try{
            const result = await PasswordToken.create(email);

            if(!result.status){
                return res.status(406).send(result.err);
            };

            const token = result.token.toString();
            emailSending.sendEmail(token, email);
            res.status(200).send(token);
        } catch(err){
            res.status(400).json({err});
       };        
    };

    async changePassword(req, res){
       const token = req.body.token;
       const password = req.body.password;

       try{ 
        const isTokenValid = await PasswordToken.validate(token);

        if(!isTokenValid.status){
           res.status(406).send("Token is invalid.");
           return;
        };

        await User.passwordUpdate(password, isTokenValid.token.userId, isTokenValid.token.token);
        await PasswordToken.setUsed(token);
        res.status(200).send("Password is altered.");
       } catch(err){
        res.status(400).json({err});
       };
    };
};

module.exports = new UserController;