import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import routes from './app/routes'
import globalErrorHandlers from './app/middlewares/globalErrorHandler'
const app: Application = express()

// Middleware

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Root directory route

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the digital cow-hut')
})

// application routes
app.use('/api/v1', routes)
//global error handler
app.use(globalErrorHandlers)

// handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'Api Not Found',
      },
    ],
  })
  next()
})

export default app
