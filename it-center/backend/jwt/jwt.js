const jwt = require("jsonwebtoken")
const errCookie = require("../utils/error/cookie/errCookie")
const jwtSecret = process.env.JWTSECRET

const generateToken = (obj) => {
    return jwt.sign(obj, jwtSecret)
}


const reGenerateToken = (token , path=null) => {
    try {
        return jwt.verify(token, jwtSecret)
    } catch (error) {
        if(path){
            errCookie(path)
        }
        throw new Error("cookie hatoligi")    
    }
}



module.exports = { generateToken, reGenerateToken }