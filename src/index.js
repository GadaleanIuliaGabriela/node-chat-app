const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory))


// event care se numeste connection si care are loc atunci cand un client se conecteaza la server
io.on('connection', () => {
    console.log('New wev socket connection')


})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
});
