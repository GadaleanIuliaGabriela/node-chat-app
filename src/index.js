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

let count = 0
// event care se numeste connection si care are loc atunci cand un client se conecteaza la server
io.on('connection', (socket) => {
    console.log('New wev socket connection')
    // cand lucram cu sokcetio transferam date(trimitem/primim) prin events
    // aici trimitem un event de la server si vrem sa primim eventul pe client
    // aici folosim un event custom
    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++

        // nu functioneaza pentru ca trimite raspunsul numai la socket-ul actual
        // socket.emit('countUpdated', count)

        // asa se trimite update-ul la toate socket-urile existente
        io.emit('countUpdated', count)
    })
})


server.listen(port, () => {
    console.log('Server is up on port ' + port)
});
