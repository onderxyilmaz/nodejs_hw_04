const Joi = require('joi');
const { isValidObjectId } = require('mongoose');
const HttpError = require('../helpers/HttpError');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return next(new HttpError(400, error.message));
    }
    
    next();
  };
};

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  
  if (!isValidObjectId(contactId)) {
    return next(new HttpError(400, 'Invalid ID format'));
  }
  
  next();
};

// Contact validation schemas
const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  contactType: Joi.string().valid('personal', 'work', 'family', 'other').default('personal'),
  isFavourite: Joi.boolean().default(false),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string(),
  contactType: Joi.string().valid('personal', 'work', 'family', 'other'),
  isFavourite: Joi.boolean(),
}).min(1);

module.exports = {
  validateBody,
  isValidId,
  contactAddSchema,
  contactUpdateSchema,
};