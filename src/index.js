const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory))

// event care se numeste connection si care are loc atunci cand un client se conecteaza la server
io.on('connection', (socket) => {
    console.log('New wev socket connection!!!')

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({
            id:socket.id,
            username,
            room
        })

        if(error) {
            return callback(error)
        }

        // join -> iti pune la dispozitie 2 noi moduri de a face emit la eventuri
        // 1. io.to.emit -> ne permite sa trimitem un mesaj catre toate socketurile care sunt intr-un room fara sa le trimita la alea care nu sunt in room-ul respectiv
        // 2. socket.broadcast.to.emit -> la toti cu exceptia clientului actual dar limiteaza la un room specific
        socket.join(user.room)

        // se trimite la ala care s-a coectat
        socket.emit('message', generateMessage('Welcome!'))
        // eventul se trimite la toti inafara de ala care s-a conectat
        socket.broadcast.to(room).emit('message', generateMessage(`${user.username} has joined`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        // se trimite la toti
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        console.log(user)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, 'https://google.com/maps?q=' + location.latitude+","+location.longitude))
        callback()
    })

    // are loc atunci cand un client se deconecteaza
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
});
