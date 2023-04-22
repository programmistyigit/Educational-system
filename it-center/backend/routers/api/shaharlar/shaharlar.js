const Joi = require("joi")
const shaharlar = require("../../../utils/api/shaharlar/list_tuma_viloyat_shahar")
const menejerChema = require("../../reg/schema/register.schema")
const router = require('express').Router()
const _ = require("lodash")


router.get('/' , (req , res)=>{
    res.send(shaharlar)
})
router.post("/get-tuman" ,async (req, res)=>{
    const {value , error} = Joi.object({
        region:Joi.string().valid(...shaharlar.map(e=>e.viloyat)).required()
    }).validate(_.pick(req.body , ["region"]))
    if(error) throw error 

    const fillials = await menejerChema[1].find()
    const bazadaBortumanlar = fillials.filter(item=>item.location.region == value.region).map(y=>y.location.tuman)
    const tumanGetaLL = shaharlar.filter(item=>item.viloyat == value.region)[0].tumanlar

    res
        .status(200)
        .json(
            {
                bazadaBortumanlar,
                tumanGetaLL
            }
        )
})



module.exports  = router