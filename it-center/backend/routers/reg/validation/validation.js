const Joi = require("joi");
const course = require("../../course/schema/schema")
const shaharlar = require("../../../utils/api/shaharlar/list_tuma_viloyat_shahar")
const menejerChema = require("../schema/register.schema")[1]
const regValidationStudet = async (region) => {
    const { error } = Joi.object({
        region: Joi.string().valid(...shaharlar.map(e => e.viloyat)).required()
    }).validate({ region })
    if (error) throw error
    const courseByDB = await course.find().lean()
    const courseAll = courseByDB.map(item => item.name)
    const valid = shaharlar.filter(e => e.viloyat == region).map(e => e.tumanlar)[0]
    return Joi.object({
        name: Joi.string().required(),
        firstName: Joi.string().required(),
        telNumber: Joi.string().required(),
        password: Joi.string().min(6).max(12).required(),
        course: Joi.any().required().valid(...courseAll),
        confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
        location: Joi.object({
            region: Joi.string().valid(...shaharlar.map(e => e.viloyat)).required(),
            tuman: Joi.string().valid(...valid).required()
        })
    })
}

const validationMenejer = async (region) => {
    const { error } = Joi.object({
        region: Joi.string().valid(...shaharlar.map(e => e.viloyat)).required()
    }).validate({ region })
    if (error) throw error
    const fillials = await menejerChema.find()
    const locationALL = fillials.map(it => it.location)
    const valid = shaharlar.filter(e => e.viloyat == region).map(e => e.tumanlar)[0].filter(e => !locationALL.map(r => r.tuman).includes(e))
    const courseByDB = await course.find().lean()
    const courseAll = courseByDB.map(item => item.name)



    return Joi.object({
        name: Joi.string().required(),
        firstName: Joi.string().required(),
        telNumber: Joi.string().required(),
        password: Joi.string().min(6).max(12).required(),
        confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
        courses: Joi.array().items(Joi.object( { name: Joi.string().valid(...courseAll).required(), value: Joi.string().required() } )).unique((a, b) => a == b).required(),
        location: Joi.object(
            {
                region: Joi.string().valid(...shaharlar.map(e => e.viloyat)).required(),
                tuman: Joi.string().valid(...valid).required()
            }
        )
    })
}

const validationTicher = async (region) => {
    const { error } = Joi.object({
        region: Joi.string().valid(...shaharlar.map(e => e.viloyat)).required()
    }).validate({ region })


    if (error) throw error
    const valid = shaharlar.filter(e => e.viloyat == region).map(e => e.tumanlar)[0]
    const courseByDB = await course.find().lean()
    const courseAll = courseByDB.map(item => item.name)
    return Joi.object({
        name: Joi.string().required(),
        firstName: Joi.string().required(),
        telNumber: Joi.string().required(),
        password: Joi.string().min(6).max(12).required(),
        confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
        jobs: Joi.array().items(Joi.string().valid(...courseAll).required()).required(),
        location: Joi.object(
            {
                region: Joi.string().valid(...shaharlar.map(e => e.viloyat)).required(),
                tuman: Joi.string().valid(...valid).required()
            }
        )
    })
}

module.exports = { regValidationStudet, validationMenejer, validationTicher }