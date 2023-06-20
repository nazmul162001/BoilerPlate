import mongoose from 'mongoose'
import app from './app'
import config from './config/config'

const dbConnection = async () => {
  try {
    await mongoose.connect(config.database_url as string)
    console.log('🌐 Database Connection Successful')

    app.listen(config.port, () => {
      console.log(`🔥Application is running on port ${config.port}`)
    })
  } catch (error) {
    console.log(`Failed to connect database ${error}`)
  }
}

dbConnection()
