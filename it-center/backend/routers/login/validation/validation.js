const joi = require("joi")

const loginValidation = joi.object({
    telNumber:joi.string().required(),
    password:joi.string().required()
})


module.exports = loginValidation