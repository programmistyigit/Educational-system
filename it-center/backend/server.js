require("express-async-errors")
require("dotenv").config()

const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_HREF)
    .then(() => {
        console.log(`Server connected to MongoDB...`);
    })
    .catch(() => console.log(`Server is not connected to MongoDB...`));

const cookieParser = require("cookie-parser");
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

// require routers
const regRouter = require("./routers/reg/reg")
const loginRouter = require("./routers/login/login");
const courseRouter = require("./routers/course/course")
const apiRouters = require("./routers/api/api")
const adminRouter = require("./routers/admin/admin");
const confirmAdminMiddleware = require("./middleware/admin/confirmAdmin");
const profileRouter = require("./routers/profile/profile")
// routers 

app.use("/reg", regRouter)
app.use("/login", loginRouter)
app.use("/course" , courseRouter)
app.use("/api" , apiRouters)
app.use("/admin" , confirmAdminMiddleware , adminRouter)
app.use("/profile" , profileRouter)



// routers



// error middleware
app.use((err, req, res, next) => {
    if(err.name == "json"){
        const error = JSON.parse(err.error.message)
        return (
            res
                .clearCookie(error.path)
                .send(
                    {
                        status:"err",
                        message:error.message
                    }
                )
        )
    }
    if(err) console.log(err);
    err ? res.send({ err : err.message }) : next()
})


const port = process.env.PORT || 5000
app.listen(port, () => console.log('> Server is up and running on port : ' + port))