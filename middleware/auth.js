const jwt = require('jsonwebtoken');
const auth = async(req,res,next)=>{
    if(!req.header('Authorization')) return res.status(401).send({
        error : true,
        message: "Access Denied"
    });

    const Token = req.header('Authorization').replace('Bearer ', '');

    try {
        const data = jwt.verify(Token, 'the_secret');
        req.data = {
            username : data.username,
            name : data.name,
        }
        next();
    } catch (err) {
        
    }
}

module.exports = auth;