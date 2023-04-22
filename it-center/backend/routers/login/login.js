const router = require('express').Router()
const _ = require("lodash")
const { default: mongoose } = require('mongoose')
const { generateToken, reGenerateToken } = require('../../jwt/jwt')
const errCookie = require('../../utils/error/cookie/errCookie')
const { online, ofline } = require('./schema/schema')
const loginValidation = require('./validation/validation')
const menejerSchema = require("../reg/schema/register.schema")[1]
const ticherSchema = require("../reg/schema/register.schema")[2]

/* 
*                                                           login
*  router  /login/student
*  desc   =>  studentlarni login qilish
*
*/ 


router.post('/student', async (req, res) => {
    const cookie = req.cookies['student']
    if (cookie) {
        const student = reGenerateToken(cookie , "student")
        const objID = mongoose.Types.ObjectId.isValid(student._id)
        if(objID){    
            const onlineBaza = await online.findById(student._id)
            const oflineBaza = await ofline.findById(student._id)
            if ((onlineBaza.name == student.name && onlineBaza.telNumber == student.telNumber) || (oflineBaza.name == student.name && oflineBaza.telNumber == student.telNumber)) throw new Error("siz allaqachon tizimdasiz")
            errCookie("student")
        }
        errCookie("student")
    }
    const { error, value } = loginValidation.validate(_.pick(req.body, ["telNumber", "password"]))
    if (error) throw error
    const onTheBaseOnline = await online.findOne(
        {
            telNumber: value.telNumber,
            password: value.password
        }
    )

    const onTheBaseOfline = await ofline.findOne(
        {
            telNumber: value.telNumber,
            password: value.password
        }
    )

    if (!onTheBaseOfline && !onTheBaseOnline) throw new Error("telefon raqam yoki parol hato")
    if (onTheBaseOfline && onTheBaseOnline) await online.findByIdAndDelete(onTheBaseOnline._id)

    const token = generateToken(_.pick(onTheBaseOfline ? onTheBaseOfline : onTheBaseOnline, ["_id", "name", "firstName", "telNumber"]))
    res
        .cookie("student", token, { maxAge: 60 * 60 * 24 * 30 })
        .status(200)
        .json(
            {
                status: "succes",
                message: "login amalga oshdi"
            }
        )
})

/*
*                                                           login menejer
*       router   /login/menejer
*       
*       desc  => menejerlarni login qilish
*
*/

router.post("/menejer" , async (req, res)=>{
    const cookie = req.cookies['menejer']
    if (cookie) {
        const menejer = reGenerateToken(cookie , "menejer")
        const objID = mongoose.Types.ObjectId.isValid(menejer._id)
        if(objID){    
            const onTheBase = await menejerSchema.findById(menejer._id)
            if(onTheBase){
                throw new Error("siz allaqachon loginni amalga oshirgansiz")
            }
            errCookie("menejer")
        }
        errCookie("menejer")
    }

    const { error, value } = loginValidation.validate(_.pick(req.body, ["telNumber", "password"]))
    if(error) throw error

    const menejer = await menejerSchema.findOne(value)
    if(!menejer) {
        return(
            res
                .status(200)
                .json(
                    {
                        status:"err",
                        message:"telefon raqam yoki parol hato"
                    }
                )
        )
    }

    const token = generateToken(_.pick(menejer , ["_id" , "name" , "telNumber"]))
    res.
        cookie("menejer" , token , { maxAge : 60 * 60 * 24 * 30 })
        .status(200)
        .json(
            {
                status:"success",
                message:"login amalga oshda"
            }
        )

})


/*
*                                                           login ticher
*       router   /login/ticher
*       
*       desc  => mutahasislarni login qilish
*
*/


router.post("/ticher" , async ( req , res ) => {
    const cookie = req.cookies['ticher']
    if (cookie) {
        const ticher = reGenerateToken(cookie ,"ticher")
        const objID = mongoose.Types.ObjectId.isValid(ticher._id)
        if(objID){    
            const onTheBase = await ticherSchema.findById(ticher._id)
            if(onTheBase){
                throw new Error("siz allaqachon loginni amalga oshirgansiz")
            }
            errCookie("ticher")
        }
        errCookie("ticher")
    }
    const { error, value } = loginValidation.validate(_.pick(req.body, ["telNumber", "password"]))
    if(error) throw error

    const ticher = await ticherSchema.findOne(value)
    if(!ticher) {
        return(
            res
                .status(200)
                .json(
                    {
                        status:"err",
                        message:"telefon raqam yoki parol hato"
                    }
                )
        )
    }

    const token = generateToken(_.pick(ticher , ["_id" , "name" , "telNumber"]))
    res.
        cookie("ticher" , token , { maxAge : 60 * 60 * 24 * 30 })
        .status(200)
        .json(
            {
                status:"success",
                message:"login amalga oshda"
            }
        )

})

module.exports = router