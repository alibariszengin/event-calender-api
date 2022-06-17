const brcrypt = require("bcryptjs")

const validateUserInput = (username, password)=>{

    return (username && password)
}

const comparePassword = (password,hashedPassword) =>{

    return brcrypt.compareSync(password,hashedPassword);
}
module.exports = {validateUserInput,comparePassword};