/* eslint-disable no-useless-catch */
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import { User } from './user.model'

const createUser = async (payload: IUser): Promise<IUser> => {
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

export const UserService = {
  createUser,
}
