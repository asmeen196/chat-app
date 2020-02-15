const socket = io()
const $messagrForm = document.querySelector('#message-form')
const $messagrFormInput = $messagrForm.querySelector('input')
const $messagrFormButton = $messagrForm.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#message')
//Template

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix : true})

const autoscroll = ()=>{
    //new message element
    const $newMessage = $messages.lastElementChild
    //Height of new message 
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //visble height
    const visbleHeight = $messages.offsetHeight
    //container height
    const containerHeight = $messages.scrollHeight
    //how far we scrolled
    const scrolloffest = $messages.scrollTop + visbleHeight

    if(containerHeight - newMessageHeight <=scrolloffest){
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('message',(message) => {
   const html = Mustache.render(messageTemplate,{
       username : message.username,
       message : message.text,
       createdAt : moment(message.createdAt).format('h:mm a')
   })
   $messages.insertAdjacentHTML('beforeend', html)
   autoscroll()

})

socket.on('locationMessage',(url)=>{
    const html = Mustache.render(locationTemplate,{
        username : url.username,
        url : url.url,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData',({room,users})=>{  
        const html = Mustache.render(sidebarTemplate,{
            room,
            users
        })
        document.querySelector('#sidebar').innerHTML = html
})

$messagrForm.addEventListener('submit',(e)=>{
    $messagrFormButton.setAttribute('disabled','disabled')
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sentMessage',message,(error)=>{
        $messagrFormButton.removeAttribute('disabled')
        $messagrFormInput.value = ''  
        $messagrFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('This message was delivered!!!')
    })
})


//Location button event for sharing location
$locationButton.addEventListener('click',(e)=>{
    if(!navigator.geolocation){
        return alert('Geolocation not supported!!!')
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
             },()=>{
                console.log('Location Shared!!')
         })
    })
    $locationButton.removeAttribute('disabled')
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})
