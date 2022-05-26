import express from 'express'

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.json())

io.on('connection', (socket: any) => {
  socket.on('sender', (user: string, msg: string) => {
    io.emit('reciever', user, msg)
  })
})

http.listen(8080)

export default {
  path: '/api/',
  handler: app,
}
