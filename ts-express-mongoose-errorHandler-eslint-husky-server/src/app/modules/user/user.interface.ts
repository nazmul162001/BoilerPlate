import { Model } from 'mongoose'

export type IUser = {
  email: string
  password: string
}
export type UserModel = Model<IUser, Record<string, unknown>>
