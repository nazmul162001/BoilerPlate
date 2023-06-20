/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { IGenericErrorMessage } from '../../interfaces/error'
import config from '../../config'
import handleValidationError from '../../errors/handleValidationError'
import ApiError from '../../errors/ApiError'
import { ErrorRequestHandler } from 'express-serve-static-core'
import { ZodError } from 'zod'
import handleZodError from '../../errors/handleZodError'
import handleCastError from '../../errors/handleCastError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  // eslint-disable-next-line no-unused-expressions
  config.env === 'development'
    ? console.log('Global Error Handler', err)
    : console.log('globalErrorHandler', err)

  let statusCode = 500
  let message = 'something went wrong'
  let errorMessages: IGenericErrorMessage[] = []

  if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessage
  } else if (err instanceof ApiError) {
    statusCode = err?.statusCode
    message = err.message
    errorMessages = err?.message
      ? [
          {
            path: 'errors',
            message: err?.message,
          },
        ]
      : []
  } else if (err instanceof Error) {
    message = err?.message
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : []
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? err?.stack : undefined,
  })
}

export default globalErrorHandler
