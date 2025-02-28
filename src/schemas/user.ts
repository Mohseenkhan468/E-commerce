import Joi from "joi";
export const signupValidation = async (body: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().optional().allow(""),
    password: Joi.string().min(6).required(),
  });
  return await schema.validate(body, { abortEarly: false });
};
export const loginValidation = async (body: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return await schema.validate(body, { abortEarly: false });
};

export const addAddressValidation = async (body: any) => {
  const schema = Joi.object({
    line_one: Joi.string().required(),
    line_two: Joi.string().optional(),
    city: Joi.string().required(),
    country: Joi.string().required(),
  });
  return await schema.validate(body, { abortEarly: false });
};

export const updateUserValidation = async (body: any) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    default_shipping_address: Joi.number().optional(),
    default_billing_address: Joi.number().optional(),
  });
  return await schema.validate(body, { abortEarly: false });
};
