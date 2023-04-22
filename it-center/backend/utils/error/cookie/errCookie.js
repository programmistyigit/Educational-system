const errCookie = (path)=>{
    const error = new Error(JSON.stringify(
        {
            name:"cookie hatoligi",
            path,
            message:"sizda yaroqsiz cookie aniqlandi , cookie malumotlaringiz ochirildi ! qayta amalga oshiring"
        }
    ))
    throw {error , name:"json"} 
}


module.exports = errCookie