import fs from 'fs'
import path from 'path'
import express from 'express'

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.json())

io.on('connection', (socket: any) => {
  socket.on('message', (user: string, text: string) => {
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
  socket.on('mode', (mode: string) => {
    io.emit('mode', mode)
  })
  socket.on('marking', (text: string) => {
    io.emit('marking', text)
  })
  socket.on('logout', () => {
    io.emit('logout')
  })
  socket.on('questions', () => {
    const file = path.resolve(__dirname, '../../files', 'q.json')
    if (!fs.existsSync(file)) return
    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    socket.emit('questions', json)
  })
})

http.listen(process.env.API_PORT, () => {
  console.info('listening port ', process.env.API_PORT)
})

export default {
  path: '/api/',
  handler: app,
}
