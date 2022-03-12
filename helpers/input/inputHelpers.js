const brcrypt = require("bcryptjs")

const validateUserInput = (email, password)=>{

    return (email && password)
}

const comparePassword = (password,hashedPassword) =>{

    return brcrypt.compareSync(password,hashedPassword);
}
module.exports = {validateUserInput,comparePassword};