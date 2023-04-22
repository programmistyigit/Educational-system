const confirmAdminMiddleware = require('../../middleware/admin/confirmAdmin')
const { courseValidation, courseUpgradeValidation } = require('./validation/validate')
const _ = require("lodash")
const schema = require('./schema/schema')
const { default: mongoose } = require('mongoose')

const router = require('express').Router()

//                                                      add new course
// router /course/new-course  method : POST
// desc => yangi kurs qoshish uchun       !! admin uchun !!
// 
router.post('/new-course', confirmAdminMiddleware, async (req, res) => {
    const validate = courseValidation.validate(_.pick(req.body, ["name", "duration", "description", "images" , "video"]))
    if (validate.error) throw validate.error
    const onTheBase = await schema.findOne(
        {
            name: validate.value.name
        }
    )
    if (onTheBase) return res.send(
        {
            status: "err",
            message: "bu kurs oldindan mavjud bu kursni ozgartirishingiz mumkun",
            errorStatus:"pre-existing"
        }
    )
    const course = await schema.create(_.pick(validate.value, ["name", "video", "duration", "description", "images"]))
    res.status(200).send({ status: "success", course })
})
//                                                      add new course


//                                                      upgrade course
// router /course/upgrade-course  method : PUT
// desc joriy mavjud kurslarni yangilash faqat bitta uchun        !! admin uchun !!
// 
router.put("/upgrade-course", confirmAdminMiddleware, async (req, res) => {
    const validate = courseUpgradeValidation.validate(_.pick(req.body, ["name", "duration", "description", "video", "images", "id"]))
    if(validate.error) throw validate.error
    const onTheBase = await schema.findById(validate.value.id)
    if (!onTheBase) return res.send(
        {
            status: "err",
            message: "yaroqsiz id , bazada qidirilayotgan id boyicha kurs topilmadi"
        }
    )
    if (onTheBase.name != validate.value.name){
        const onTheBaseName = await schema.findOne({name:validate.value.name})
        if(onTheBaseName){
            return res
                    .status(200)
                    .json(
                        {
                            status:"warn",
                            message:`${validate.value.name} nomli kursi oldindan mavjud`
                        }
                    )
        }
    }
    await schema.findByIdAndUpdate(validate.value.id, _.pick(validate.value, ["name", "video", "duration", "description", "images"]))
    const course = await schema.findById(validate.value.id)
    
    res.send(
        {
            status: "success",
            message: onTheBase.name + " kurs malumotlari ozgartirildi",
            course
        }
    )
})
//                                                  upgrade course


//                                                  delete course 
//  router   /course/delete/one   method : DELETE
// desc => mavjud kurslarni id orqali ochirish        !! admin uchun !!
// 
router.delete("/delete/one", confirmAdminMiddleware, async (req, res) => {
    const id = req.body.id
    const objId = mongoose.Types.ObjectId.isValid(id)
    if (!objId) {
        return res
            .status(200)
            .json(
                {
                    status: "err",
                    message: "yaroqsiz id"
                }
            );
    }
    const onTheBase = await schema.findById(id)
    if (!onTheBase) {
        return res
            .status(404)
            .json(
                {
                    status: "err",
                    message: "yaroqsiz id , bazada qidirilayotgan id boyicha kurs topilmadi"
                }
            );
    }
    await schema.findByIdAndDelete(id)
    res
        .status(200)
        .json(
            {
                status: "success",
                message: onTheBase.name + " kursi bazdan ochirildi"
            }
        )
})

// router   /course/delete/all   method : DELETE
// desc => mavjud kurslarni hammasini ochirish        !! admin uchun !!

router.delete("/delete/all", confirmAdminMiddleware, async (req, res) => {
    const onTheBase = await schema.find().lean()
    if (onTheBase.length === 0) {
        return res
            .status(200)
            .json(
                {
                    status: "warn",
                    message: "kurslar topilmadi"
                }
            )
    }
    onTheBase.forEach( async course=>{
        await schema.findByIdAndDelete(course._id)
    })
    res
        .status(200)
        .json(
            {
                status:"success",
                message:"hamma kurslar ochirildi"
            }
        )
})


//                                                      delete course 


//  hamma kurslarni olish
//  router   /course/all
//  hamma uchun
// 
router.get("/all", async (req, res) => {
    const courseAll = await schema.find().lean()
    res
        .status(200)
        .json(
            {
                courses: courseAll
            }
        )
})

module.exports = router