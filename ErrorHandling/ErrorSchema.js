const Joi = require("joi")
module.exports = Joi.object({
data:Joi.object({
    name:
    Joi.string()
    .required(),

    description:
    Joi.string()
    .required(),

    date:
    Joi.any().optional(),

    time:
    Joi.any().optional()
})
})


