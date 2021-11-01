const socket = io()

//aici primim eventul
socket.on('countUpdated', (count) => {
    console.log("The count has been updated!", count)
})

//detectam evenimentul click
document.querySelector('#increment').addEventListener('click', () => {
    console.log('Clicked')

    // emitem un event atunci cand se apasa butonul
    socket.emit('increment')
})

