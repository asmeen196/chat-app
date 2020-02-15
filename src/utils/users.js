const users = []

const addUser = ({id,username,room})=>{
    username  = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || ! room) {
        return {
            "error":"Room and Username is required"
        }
    }
    const exestingUser = users.find((user)=>{
            return user.room === room && user.username === username
    })

    //Validate username

    if(exestingUser){
        return {
            "error":"Username is in use"
        }
    }

    //store user
    const user = {id,username,room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index = users.indexOf((user)=>{
        return user.id === id
    })

    if(index !== 1){
        return users.splice(index,1)[0] // showing [0] element of the removed elements
    }
}

const getUser = (id)=>{
    return users.find((user)=> user.id === id )
}

const getUserInRoom = (room)=>{
    return users.filter((user)=> user.room === room)
}

module.exports = {
    
    addUser,
    getUser,
    getUserInRoom,
    removeUser

}