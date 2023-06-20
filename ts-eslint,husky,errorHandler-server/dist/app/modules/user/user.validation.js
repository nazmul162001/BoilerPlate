"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
        price: zod_1.z.number({
            required_error: 'Number is required',
        }),
    }),
});
exports.UserValidation = {
    userValidationSchema,
};
