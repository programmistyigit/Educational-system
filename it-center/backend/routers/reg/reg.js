const _ = require("lodash")
const { regValidationStudet, validationMenejer, validationTicher } = require("./validation/validation")
const { generateToken, reGenerateToken } = require("../../jwt/jwt")
const router = require('express').Router()
const sendCode = require("../../utils/sendCodeToTelefon/code")
const [schema, menejerChema , ticherSchema] = require("./schema/register.schema")
const { online, ofline } = require("../login/schema/schema")
const { default: mongoose } = require("mongoose")

//                                                      registratsiya
//  registeratsiya student
//  router  /reg/student     method : POST
//  desc  => studentlar uchun registratsiya
//  

router.post('/student', async (req, res) => {
    const cookie = req.cookies.reg
    if (cookie) {
        const user = reGenerateToken(cookie)
        return res.send(
            {
                status: "warn",
                errTarget: "incomplete",
                message: "siz oldingi royhatdan otish jarayonini yakunlamagansiz",
                data: user
            }
        )
    }
    const validation = (await regValidationStudet(req.body?.location?.region)).validate(_.pick(req.body, ["name", "firstName", "telNumber", "password", "confirmPassword", "course", "location"]))
    if (validation.error) throw validation.error

    const telNumberByOnline = await online.findOne({ telNumber: validation.value.telNumber })
    const telNumberByOfline = await ofline.findOne({ telNumber: validation.value.telNumber })
    if (telNumberByOfline || telNumberByOnline) {
        return res.send(
            {
                status: "warn",
                message: "telefon raqam oldin ro'yxatdan o'tilgan"
            }
        )
    }

    const code = sendCode(validation.value.telNumber)

    const regUser = await schema.create({ ..._.pick(validation.value, ["name", "firstName", "telNumber", "password", "course", "location"]), code })
    const token = generateToken({ ...validation.value, id: regUser._id })

    res.cookie("reg", token, { maxAge: 60 * 60 * 24 * 7 })
    res.status(200).json({ ...validation, code }).send()
})

//  registeratsiya student

//                                                              registratsiya menejer
//  router /reg/menejer   method : POST
//  desc  menejerlar royhatdan otish routeri

router.post("/menejer", async (req, res) => {
    const cookie = req.cookies['menejer']
    if (cookie) {
        const menejer = reGenerateToken(cookie)
        const onTheBase = await menejerChema.findById(menejer._id)
        if (onTheBase) throw new Error("siz menejer sifadida ro'yhatdan o'tgansiz" + (!menejer.confirm ? " iltimos admin sizni tasdiqlashini kuting" : ""))
    }

    const validate = (await validationMenejer(req.body?.location?.region)).validate(_.pick(req.body, ["name", "firstName", "telNumber", "password", "courses", "confirmPassword", "location"]))
    if (validate.error) return res.send({ ...validate.error, status: "err", message: `ushbu ${validate.error.details[0].context.value} bazada mavjud` })

    const menejer = await menejerChema.create({ ..._.pick(validate.value, ["name", "firstName", "telNumber", "password", "courses", "location"]) , message :[] })
    const token = generateToken(_.pick(menejer, ["_id", "name", "confirm"]))

    res
        .cookie("menejer", token, { maxAge: 60 * 60 * 24 * 30 })
        .send(menejer)
})


//                                                              registratsiya menejer

//                                                              registratsiya tichers
// router  /reg/ticher/ methos : POST
// desc  => talim boyicha mutahasislarni royhatdan otkazish


router.post("/ticher", async (req, res) => {
    const cookie = req.cookies['ticher']
    if(cookie){
        const ticher = reGenerateToken(cookie)
        const objId = mongoose.Types.ObjectId.isValid(ticher._id)
        if(objId){
            const onTheBase = await ticherSchema.findById(ticher._id)
            if(onTheBase) throw new Error("siz mutahasis sifadida ro'yhatdan o'tgansiz" + (!ticher.confirm ? " iltimos menejeringiz sizni tasdiqlashini kuting" :""))
        }
    }
    const validate = (await validationTicher(req.body?.location?.region)).validate(_.pick(req.body, ["name", "firstName", "telNumber", "password", "jobs", "confirmPassword", "location"]))

    if (validate.error) throw validate.error
    const fillials = await menejerChema.findOne({ location: validate.value.location })
    if (!fillials) {
        return (
            res
                .status(200)
                .json(
                    {
                        status: "err",
                        message: "sizning hududdagi markaz tizimdan hali otmagan shu sababli siz tizimga kira olmaysiz iltimos menejeringizni royhatdan otishini takidlang"
                    }
                )
        )
    }

    validate.value.jobs.forEach(job => {
        if (fillials.courses.map(e=>e.name).includes(job)) return ;
        throw new Error(`sizning mutahasisligingiz ${fillials.location.region} ${fillials.location.tuman} menejeri kurslarni royhatida korsatmagan`)
    })

    const ticher = await ticherSchema.create(_.pick(validate.value , ["name", "firstName", "telNumber", "password", "jobs", "location"]))

    await menejerChema.findByIdAndUpdate(fillials._id , {$push : { tichers : ticher._id}})

    const token = generateToken(_.pick(ticher , ["_id" , "name" , "telNumber"]))
    
    res
    .cookie("ticher" , token , { maxAge : 60 * 60 * 24 * 30 })
    .send(
        {
            status:"success",
            message:"sizning kiritgan malumotingiz menejeringizga yuborildi iltimos sizni tasdiqlashini kuting"
        }
    )
    
})

//                                                              registratsiya tichers












router.post("/sms-code", async (req, res) => {
    const code = req.body.code
    if (!code) throw new Error("siz kod kiritmagansiz")
    const token = req.cookies['reg']
    if (!token) throw new Error("siz sms codni kiritish uchun taklif olmagansiz")

    const user = reGenerateToken(token)
    const onTheBase = await schema.findById(user.id)
    if (!onTheBase) {
        return res
            .status(200)
            .json(
                {
                    status: "err",
                    message: "sizdagi cookie fayl malumotlari yaroqsiz"
                }
            )
    }

    if (onTheBase.code != code) {
        return res
            .status(200)
            .json(
                {
                    status: "err",
                    message: "siz kiritgan kod natogri"
                }
            )
    }

    await schema.findByIdAndDelete(onTheBase._id)

    const userOnlineDBRedirect = await online.create(
        {
            ..._.pick(onTheBase, ["name", "firstName", "telNumber", "password", "cords", "location"]),
            course: [
                {
                    name: onTheBase.course,
                    data: []
                }
            ]
        }
    )

    const fillial = await menejerChema.findOne({ location: { region: userOnlineDBRedirect.location.region, tuman: userOnlineDBRedirect.location.tuman } })
    if (fillial) {
        console.log(fillial);
        const students = fillial.students
        await menejerChema.findByIdAndUpdate(fillial._id, { students: { online: [...students.online, {_id:userOnlineDBRedirect._id , date:new Date()}], ofline: students.ofline } })
    }

    const authToken = generateToken(_.pick(userOnlineDBRedirect, ["_id", "name", "firstName", "telNumber"]))
    res
        .cookie("student", authToken, { maxAge: 60 * 60 * 24 * 30 })
        .clearCookie("reg")
        .status(200)
        .json(
            {
                status: "success",
                message: "maxsus kod togri keldi muvofaqiyatli hisob ochilishi!"
            }
        )
})


module.exports = router