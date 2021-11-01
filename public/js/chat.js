const socket = io()

// Elements
const $messageFrom = document.querySelector('#message-form')
const $messageFromInput = $messageFrom.querySelector('input')
const $messageFromButon = $messageFrom.querySelector('button')
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

$messageFrom.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable the button
    $messageFromButon.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFromButon.removeAttribute('disabled')
        $messageFromInput.value = ''
        $messageFromInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log("Message delivered!")
    })
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log("Location shared!")
        })
    })
})


