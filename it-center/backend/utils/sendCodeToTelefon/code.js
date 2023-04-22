const sendCode = (number)=>{
    console.log(number);
    const code = Array(5).fill(false).map(e=>Math.floor(Math.random() * 10)).join("")
    return code
}

module.exports = sendCode