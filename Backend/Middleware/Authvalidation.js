const joi = require("joi");

const signupValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(30).required(),
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    next();
};

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        // name: joi.string().min(3).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(30).required(),
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    next();
};


module.exports = {
    signupValidation,
    loginValidation
}