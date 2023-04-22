const router = require('express').Router()
const menejerProfileRouter = require("./menejer/menejer")
const studentProfileRouter = require("./student/student")
const adminProfileRouter = require("./admin/admin")
const ticherProfileRouter = require("./ticher/ticher")
const confirmAdminMiddleware = require('../../middleware/admin/confirmAdmin')
const menejerMiddleware = require('../../middleware/menejer/menejerMiddleware')
const studentMiddleware = require('../../middleware/student/studentMiddleware')
const ticherMiddleware = require('../../middleware/ticher/ticherMiddleware')

router.use("/menejer" , menejerMiddleware , menejerProfileRouter)
router.use("/student" , studentMiddleware , studentProfileRouter)
router.use("/admin" , confirmAdminMiddleware, adminProfileRouter)
router.use("/ticher" , ticherMiddleware , ticherProfileRouter)



module.exports  = router