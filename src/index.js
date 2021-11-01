const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        // se trimite la toti
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', 'https://google.com/maps?q=' + location.latitude+","+location.longitude)
        callback()
    })

    // are loc atunci cand un client se deconecteaza
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
});
