"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("./user.model"));
const user_constant_1 = require("./user.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createNewUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check duplicates entries
        const existingUser = yield user_model_1.default.findOne(payload);
        if (existingUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
        }
        const createUser = yield user_model_1.default.create(payload);
        return createUser;
    }
    catch (error) {
        throw error;
    }
});
// get all user
// get allCows
const getUsers = (filters, paginationOptions, priceQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters
    // shortCut way
    , ["searchTerm"]);
    // shortCut way
    const andConditions = [];
    // price filter
    if (priceQuery.minPrice !== undefined && priceQuery.maxPrice !== undefined) {
        const minPrice = Number(priceQuery.minPrice);
        const maxPrice = Number(priceQuery.maxPrice);
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            andConditions.push({
                price: {
                    $gte: minPrice,
                    $lte: maxPrice,
                },
            });
        }
    }
    else if (priceQuery.minPrice !== undefined) {
        const minPrice = Number(priceQuery.minPrice);
        if (!isNaN(minPrice)) {
            andConditions.push({
                price: { $gte: minPrice },
            });
        }
    }
    else if (priceQuery.maxPrice !== undefined) {
        const maxPrice = Number(priceQuery.maxPrice);
        if (!isNaN(maxPrice)) {
            andConditions.push({
                price: { $lte: maxPrice },
            });
        }
    }
    // search term
    if (searchTerm)
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    // exact filter
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: {
                    $regex: new RegExp(`\\b${value}\\b`, 'i'),
                },
            })),
        });
    }
    // Same filter in a Normal way
    // const andConditions = [
    //   {
    //     $or: [
    //       {
    //         location: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //       {
    //         breed: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //       {
    //         category: {
    //           $regex: searchTerm,
    //           $options: 'i',
    //         },
    //       },
    //     ],
    //   },
    // ]
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield user_model_1.default.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield user_model_1.default.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get single user
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(userId);
        return user;
    }
    catch (error) {
        throw error;
    }
});
// delete user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
    }
    catch (error) {
        throw error;
    }
});
// update user
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByIdAndUpdate(id, payload, { new: true });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.userService = {
    createNewUser,
    getUsers,
    getSingleUser,
    deleteUser,
    updateUser,
};
