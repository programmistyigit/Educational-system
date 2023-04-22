const joi = require("joi")

const courseValidation = joi.object({
    name: joi.string().required(),
    video:joi.string().required(),
    description: joi.string().required(),
    images: joi.string().required(),
    duration: joi.string().required()
})
const courseUpgradeValidation = courseValidation.concat(joi.object({
    id: joi.string().required()
}))


module.exports = { courseValidation, courseUpgradeValidation }