import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
const router = express.Router()

// create new user
router.post(
  '/',
  validateRequest(UserValidation.userValidationSchema),
  UserController.createUser
)
router.get('/', UserController.getUsers)
router.get('/:id', UserController.getSingleUser)
router.delete('/:id', UserController.deleteUser)
router.patch('/:id', UserController.updateUser)
export const UserRoutes = router
