const router = require('express').Router()
const getMenejer = require("./get/get")
const tasdiqlashMenejer = require("./tasdiqlash/tasdiqlash")
router.use("/get" , getMenejer)

router.use('/confirm' , tasdiqlashMenejer)




module.exports  = router