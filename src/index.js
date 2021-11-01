const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

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
    socket.emit('message', generateMessage('Welcome!'))
    // eventul se trimite la toti inafara de ala care s-a conectat
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('join', ({username, room}) => {
        // join -> iti pune la dispozitie 2 noi moduri de a face emit la eventuri
        // 1. io.to.emit -> ne permite sa trimitem un mesaj catre toate socketurile care sunt intr-un room fara sa le trimita la alea care nu sunt in room-ul respectiv
        // 2. socket.broadcast.to.emit -> la toti cu exceptia clientului actual dar limiteaza la un room specific
        socket.join(room)


    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        // se trimite la toti
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage('https://google.com/maps?q=' + location.latitude+","+location.longitude))
        callback()
    })

    // are loc atunci cand un client se deconecteaza
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
});
