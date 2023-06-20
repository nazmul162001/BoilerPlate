import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { Server } from 'http'

process.on('uncaughtException', err => {
  console.log(err)
  process.exit(1)
})

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    console.log(`🌐 Connected to Mongo`)

    server = app.listen(config.port, () => {
      console.log(`🔥 Example app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(`🔥 Server connection error: ${error}`)
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

main()

process.on('SIGTERN', () => {
  console.log('SIGTERM is received')
  if (server) {
    server.close()
  }
})
