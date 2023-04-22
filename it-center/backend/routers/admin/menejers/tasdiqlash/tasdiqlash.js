const router = require('express').Router()
const menejerChema = require("../../../reg/schema/register.schema")[1]
const mongoose = require("mongoose")
const { online, ofline } = require('../../../login/schema/schema')
router.get('/by/:id' , async (req , res)=>{
    const id = req.params.id
    const objId = mongoose.Types.ObjectId.isValid(id)
    if(!objId){
        return (
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

    
    const menejerUpdate = await menejerChema.findById(id)
    if(!menejerUpdate){
        return(
            res
                .status(200)
                .json(
                    {
                        status:"warn",
                        message:"bunday menejer aniqlanmadi"
                    }
                )
        )
    }

    const onlineSTudentALl = await online.find({location:{region:menejerUpdate.location.region , tuman:menejerUpdate.location.tuman}})
    const oflineSTudentALl = await ofline.find({location:{region:menejerUpdate.location.region , tuman:menejerUpdate.location.tuman}})

    const students = {
        online:onlineSTudentALl.map(st=>({date:new Date() , id:st._id})),
        ofline:oflineSTudentALl.map(st=>({date:new Date() , id:st._id}))
    }

    await menejerChema.findByIdAndUpdate(menejerUpdate._id , {
        confirm:true,
        students
    })

    res
        .status(200)
        .json(

            {
                status:"success",
                message:`${menejerUpdate.name} ${menejerUpdate.firstName} ${menejerUpdate.location.region} ${menejerUpdate.location.tuman} menejeri sifatida qoshildi , unga barcha menejerlik huquqlari berildi va malumotlar bazada ushbu manzilga tegishli fillial royhatdan otgazildi`
            }
        )
})

module.exports  = router