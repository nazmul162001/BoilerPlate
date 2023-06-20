import { Schema, model } from 'mongoose'
import { IUser } from './user.interface'

// Creating a user schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
)

const User = model<IUser>('users', userSchema)
export default User
