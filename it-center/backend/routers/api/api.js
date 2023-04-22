const router = require('express').Router()

const shaharlarRouter = require("./shaharlar/shaharlar")

router.use('/shaharlar' , shaharlarRouter)




module.exports  = router