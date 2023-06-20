import ApiError from '../../../errors/ApiError'
import { IPriceFilters, IUser, IUserFilters } from './user.interface'
import httpStatus from 'http-status'
import User from './user.model'
import { IPaginationOptions } from '../../../interfaces/paginations'
import { IGenericResponse } from '../../../interfaces/common'
import { userSearchableFields } from './user.constant'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { SortOrder } from 'mongoose'

const createNewUser = async (payload: IUser): Promise<IUser> => {
  try {
    // check duplicates entries
    const existingUser = await User.findOne(payload)
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
    }
    const createUser = await User.create(payload)
    return createUser
  } catch (error) {
    throw error
  }
}

// get all user
// get allCows
const getUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
  priceQuery: IPriceFilters
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters
  // shortCut way
  const andConditions = []

  // price filter
  if (priceQuery.minPrice !== undefined && priceQuery.maxPrice !== undefined) {
    const minPrice = Number(priceQuery.minPrice)
    const maxPrice = Number(priceQuery.maxPrice)

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      andConditions.push({
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      })
    }
  } else if (priceQuery.minPrice !== undefined) {
    const minPrice = Number(priceQuery.minPrice)

    if (!isNaN(minPrice)) {
      andConditions.push({
        price: { $gte: minPrice },
      })
    }
  } else if (priceQuery.maxPrice !== undefined) {
    const maxPrice = Number(priceQuery.maxPrice)

    if (!isNaN(maxPrice)) {
      andConditions.push({
        price: { $lte: maxPrice },
      })
    }
  }
  // search term
  if (searchTerm)
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })

  // exact filter
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          $regex: new RegExp(`\\b${value}\\b`, 'i'),
        },
      })),
    })
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

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

// get single user
const getSingleUser = async (userId: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(userId)
    return user
  } catch (error) {
    throw error
  }
}
// delete user
const deleteUser = async (id: string): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      throw new Error('User not found')
    }
  } catch (error) {
    throw error
  }
}
// update user
const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndUpdate(id, payload, { new: true })
    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNewUser,
  getUsers,
  getSingleUser,
  deleteUser,
  updateUser,
}
