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
io.on('connection', (socket) => {
    console.log('New wev socket connection')

    // se trimite la ala care s-a coectat
    socket.emit('message', 'Welcome')

    // eventul se trimite la toti inafara de ala care s-a conectat
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message) => {
        // se trimite la toti
        io.emit('message', message)
    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
});
