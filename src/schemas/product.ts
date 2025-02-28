import Joi from "joi";

export const CreateProductValidation = (body: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().min(1).required(),
    tags: Joi.array().items(Joi.string()).optional(),
  });
  return schema.validate(body,{abortEarly:false})
};

export const UpdateProductValidation = (body: any) => {
    const schema = Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      price: Joi.number().min(1).optional(),
      tags: Joi.array().items(Joi.string()).optional(),
    });
    return schema.validate(body,{abortEarly:false})
  };