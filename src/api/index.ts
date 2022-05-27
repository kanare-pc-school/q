import express from 'express'

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.json())

io.on('connection', (socket: any) => {
  socket.on('message', (user: string, text: string) => {
    console.info(user, text)
    io.emit('message', user, text)
  })
  socket.on('question', (question: string) => {
    io.emit('question', question)
  })
  socket.on('trash', () => {
    io.emit('trash')
  })
  socket.on('visible', (visible: boolean) => {
    io.emit('visible', visible)
  })
})

http.listen(process.env.API_PORT)

export default {
  path: '/api/',
  handler: app,
}
