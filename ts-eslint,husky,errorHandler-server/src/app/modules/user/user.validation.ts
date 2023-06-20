import { z } from 'zod'

const userValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    price: z.number({
      required_error: 'Number is required',
    }),
  }),
})

export const UserValidation = {
  userValidationSchema,
}
