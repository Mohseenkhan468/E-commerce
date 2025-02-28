import Joi from "joi";

export const AddCartItemValidation = async (body: any) => {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  return await schema.validate(body, { abortEarly: false });
};
export const UpdateCartItemValidation = async (body: any) => {
  const schema = Joi.object({
    quantity: Joi.number().required(),
  });
  return await schema.validate(body, { abortEarly: false });
};
