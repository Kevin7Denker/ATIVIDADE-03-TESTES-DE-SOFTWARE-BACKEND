const { z } = require('zod');

const idParamSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, 'id deve ser numérico')
    .transform((value) => Number.parseInt(value, 10))
    .refine((value) => Number.isSafeInteger(value) && value > 0, {
      message: 'id deve ser um inteiro positivo',
    }),
});

module.exports = {
  idParamSchema,
};
