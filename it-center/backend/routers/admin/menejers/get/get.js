const { default: mongoose } = require('mongoose')

const router = require('express').Router()
const menejerSchema = require("../../../reg/schema/register.schema")[1]

router.get("/all" , async (req, res) =>{
    const allMenejers = await menejerSchema.find().lean()
    res
        .status(200)
        .json(allMenejers)
})

router.get("/one/:id" , async ( req , res ) => {
    const id = req.params.id
    const objId = mongoose.Types.ObjectId.isValid(id)
    if(!objId){
        return(
            res
                .status(200)
                .json(
                    {
                        status:"warn",
                        message:"siz malumotlar bazasiga tegishli id kliritmadingiz"
                    }
                )
        )
    }

    const menejer = await menejerSchema.findById(id)
    if(!menejer) {
        return(
            res
                .status(200)
                .json(
                    {
                        status:"err",
                        message:"bu id menejerlaga tegishli emas !"
                    }
                )
        )
    }
    return(
        res
        .status(200)
        .json(
            {
                status:"success",
                message:"menejer topildi",
                data:menejer
            }
        )
    )
})


module.exports  = router