const  jwt = require('jsonwebtoken');
const JWT_secret = "thisismySecretpleasedonttellanyone"


const fetchuser = (req, res , next) =>{
 //getting the user from the jwt token and giving him the id

const token = req.header('auth-token');
if(!token){
    return res.status(401).send({error: "Please authenticate using a valid token"})
}
try {
    const data = jwt.verify(token , JWT_secret);
    req.user = data.user;
    next();
} catch (error) {
    return res.status(401).send({error: "Please authenticate using a valid token"})
    
}


}

module.exports = fetchuser;

