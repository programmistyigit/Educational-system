const router = require('express').Router()


router.get('/' , (req , res)=>{
    // router code here
})


router.get("/logout" , (req, res) =>{
    res
        .clearCookie("ticher")
        .status(200)
        .json(
            {
                status:"success",
                message:">logout"
            }
        )
})

module.exports  = router