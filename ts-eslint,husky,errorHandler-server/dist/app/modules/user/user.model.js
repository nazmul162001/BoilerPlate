"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Creating a user schema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });
const User = (0, mongoose_1.model)('users', userSchema);
exports.default = User;
