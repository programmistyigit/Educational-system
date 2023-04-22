const { default: mongoose } = require("mongoose")
const { reGenerateToken } = require("../../jwt/jwt")
const errCookie = require("../../utils/error/cookie/errCookie")
const menejerSchema = require("../../routers/reg/schema/register.schema")[1]
const menejerMiddleware = async (req, res, next)=>{
    const token = req.cookies["menejer"]
    if(!token) {
        return (
            res
                .status(200)
                .json(
                    {
                        status:"err",
                        message:"siz menejer emassiz siz uchun bu sahifaga kirish taqiqlangan"
                    }
                )
        )
    }

    const menejer = reGenerateToken(token , "menejer")
    const confirmObjId = mongoose.Types.ObjectId.isValid(menejer._id)
    if(!confirmObjId) errCookie("menejer")
    const menejerByDb = await menejerSchema.findById(menejer._id)
    if(!menejerByDb) errCookie("menejer")
    req.id = menejerByDb._id
    next()
}

module.exports = menejerMiddleware