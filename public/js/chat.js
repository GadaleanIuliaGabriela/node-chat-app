const socket = io()

const messageFrom = document.querySelector('#message-form')

socket.on('message', (message) => {
    console.log(message)
})

messageFrom.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})



