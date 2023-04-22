const router = require('express').Router()
const menejerRouter = require("./menejers/menejers")

//                                      controls menejer
// router   /admin/menejer
//desc  =>  menejerlarni boshqarish uchun router

router.use("/menejer" , menejerRouter)
//                                      controls menejer



router.get('/another-route' , (req , res)=>{
    // router code here
})

module.exports  = router