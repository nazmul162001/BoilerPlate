import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { userService } from './user.service'
import ApiError from '../../../errors/ApiError'
import pick from '../../../shared/pick'
import { PriceSearchableFields, userFilterableField } from './user.constant'
import { paginationFields } from '../../../constants/pagination'

// create a new user
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body
    const result = await userService.createNewUser(userData)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    })
  }
)

// get all users
const getUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableField)
    const priceQuery = pick(req.query, PriceSearchableFields)
    const paginationOptions = pick(req.query, paginationFields)

    const result = await userService.getUsers(
      filters,
      paginationOptions,
      priceQuery
    )

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All users retrieved successfully!',
      meta: result.meta,
      data: result.data,
    })
  }
)

// get single user
const getSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await userService.getSingleUser(userId)

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User retrieved successfully!',
      data: user,
    })
  }
)

// delete user
const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    await userService.deleteUser(id)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully!',
    })
  }
)

// update user
const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updateData = req.body
    const updatedUser = await userService.updateUser(id, updateData)

    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully!',
      data: updatedUser,
    })
  }
)
export const UserController = {
  createUser,
  getUsers,
  getSingleUser,
  deleteUser,
  updateUser,
}
