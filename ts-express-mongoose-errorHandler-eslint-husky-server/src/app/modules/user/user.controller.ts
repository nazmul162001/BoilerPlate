import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { UserService } from './user.services'
import httpStatus from 'http-status'

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const {...userData } = req.body
    const result = await UserService.createUser(userData)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    })
  }
)

export const UserController = {
  createUser,
}
