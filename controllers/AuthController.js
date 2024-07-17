const jwt = require('jsonwebtoken');
const ExpiredToken = require('../models/ExpiredToken');
const secret = '*@SeCrEt@242628asd@*';

module.exports = async function(req, res, next){
    const authToken = req.headers['authorization'];
    try{
        if(!authToken){
            res.status(403).send("You are not authenticated");
            return;
        };
    
        const bearer = authToken.split(' ');
        const token = bearer[1];
    
        const decoded = jwt.verify(token, secret);

        const tokenIsExpired = await ExpiredToken.findByToken(token);
        
        if(tokenIsExpired){
            res.status(403).send("Token is invalid"); 
            return;
        };

        if(!decoded.role == 1){
            res.status(403).send("You do not have permission"); 
            return;
        };
    
        console.log(decoded);
        next();
    } catch(err){
        res.status(403).send("You are not authenticated"); 
    }
};