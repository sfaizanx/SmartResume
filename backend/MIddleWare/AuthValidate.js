const joi = require('joi');

const sigupValidation = (req,res,next) =>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10)
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400)
        .json({ message: "bad request", error})
    }
    next();
}

const loginValidation = (req,res,next) =>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required()
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400)
        .json({ message: "bad request", error})
    }
    next();
}

module.exports = {sigupValidation, loginValidation }