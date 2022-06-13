// import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { socketService, SOCKET_EVENT_USER_UPDATED } from './socket.service'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
var gWatchedUser = null;

// _saveLocalUser({ _id: '6245e54524c152b7c822ae91', fullname: 'Amit Miz', username: 'amit', password: '123', imgUrl: 'https://ca.slack-edge.com/T02L3AYJGN4-U02K3QJLCBH-762de20f3035-512', isAdmin: false })

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    getUsers,
    getById,
    remove,
    update,
    changeScore,
    getMiniUser,
    guest
}

// Debug technique
window.userService = userService


function getUsers() {
    // return storageService.query('user')
    return httpService.get(`user`)
}

async function getById(userId) {
    // const user = await storageService.get('user', userId)
    const user = await httpService.get(`user/${userId}`)
    gWatchedUser = user;
    return user;
}
function remove(userId) {
    // return storageService.remove('user', userId)
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    // await storageService.put('user', user)
    user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
    return user;
}

async function login(userCred) {
    try {
        const user = await httpService.post('auth/login', userCred)
        if (user) return _saveLocalUser(user)
    } catch (err) {
        console.log('userService: Error in login user', err)
        throw err
    }
}
async function signup(userCred) {
    try {
        const user = await httpService.post('auth/signup', userCred)
        return _saveLocalUser(user)
    } catch (err) {
        console.log('userService: Error in signup user', err)
        throw err
    }
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // socketService.emit('unset-user-socket');
    return await httpService.post('auth/logout')
}

async function changeScore(by) {
    const user = getLoggedinUser()
    if (!user) throw new Error('Not loggedin')
    user.score = user.score + by || by
    await update(user)
    return user.score
}

async function guest() {
    const user = await login({ username: 'amit', password: '123' })
    return user
    // _saveLocalUser({ _id: '628e28f54c7c7448c470b089', fullname: 'Amit Miz', username: 'amit', imgUrl: 'https://ca.slack-edge.com/T02L3AYJGN4-U02K3QJLCBH-762de20f3035-512', color: '', email: 'amit.am130@gmail.com' })

}

function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
    if (!user) return
    delete user.password
    return user
}

async function getMiniUser(userId) {
    try {
        const user = await getById(userId);
        return {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            color: user.color,
        }
    } catch (err) {
        console.log('userService: Error in getById user', err)
        throw err
    }
}

