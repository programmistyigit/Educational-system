const { online, ofline } = require('../../login/schema/schema')

const router = require('express').Router()
const menejerChema = require("../../reg/schema/register.schema")[1]
const ticherChema = require("../../reg/schema/register.schema")[2]

router.get('/' , async (req , res)=>{
    const menejer = await menejerChema.findById(req.id)
    const tichers = await ticherChema.find({location :menejer.location})
    const onlineStudent = await online.find({location :menejer.location})
    const oflineStudent = await ofline.find({location :menejer.location})
    res.send(
        {
            menejer,
            tichers,
            students:{
                online:onlineStudent,
                ofline:oflineStudent
            }
        }
    )
})

router.get("/logout" , (req, res) =>{
    res
        .clearCookie("menejer")
        .status(200)
        .json(
            {
                status:"success",
                message:">logout"
            }
        )
})


module.exports  = router