const loginbutton = document.getElementById("loginButton")
const loginui = document.getElementById("welcomeScreen")
const dashui = document.getElementById("loggedInDash")
const genDiscButton = document.getElementById("genDiscChat")
const sendButton = document.getElementById('sendChat')
const passwordfield = document.getElementById('password')
const usernamefield = document.getElementById('username')
const settingsButton = document.getElementById('optionsButton')
const chattingBox = document.getElementById('chattingBox')
var  url = config.url
var customUrl= ""
var debugMode = false
import * as config from "../../config.js"
const DOMPurify = require('dompurify')

const settingsUI = document.getElementById('settings')
var status;
var token;
var username;
var displayName;
var time = 0
var channel = 0
var community = 0
const msgBox = document.getElementById('chatBox');
const windowStatus = document.getElementById("title")
windowStatus.innerHTML = "ArcChat - Login"
var messages = ''
document.getElementById('beta').innerHTML = "BETA "+config.version

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }  

function sendMessage() {
    const http = new XMLHttpRequest();
    http.open("POST", url + "/sendmsg")
    http.setRequestHeader('token', token)
    http.setRequestHeader('community', 0)
    http.setRequestHeader('channel', 1)

    // <img src='https://media1.tenor.com/m/_RZWxr9IPg8AAAAd/goose-silly.gif'></img>
    window.console.log(message)


    var message = msgBox.value;
    
    message = DOMPurify.sanitize(message)
    
    const checkWhitespace = str => !str.replace("/\s/g", '').length

    const msgTime = new Date().getTime();

    message = message.replace(new RegExp(escapeRegExp("\\"), "g"), "<backslash>")

    var assembledMsg = JSON.stringify(
        {
            "username":username,
            "name": displayName,
            "time":msgTime+150,
            "text":message
        }
    )

    window.console.log(assembledMsg)

    msgBox.value = ""

    msgBox.focus()

    if (checkWhitespace(message)) {
        return;
    }

    window.console.log(message)

    messages=messages+"\\"+assembledMsg

    http.setRequestHeader("message", assembledMsg)
    http.send()
}

usernamefield.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        passwordfield.focus()
    }
})

passwordfield.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        loginbutton.click()
    }
})

msgBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        sendButton.click();
    }
})

sendButton.addEventListener('click', sendMessage)

function updateMessages() {
    const http = new XMLHttpRequest();
    http.open("GET", url + "/getmsgs", true)
    http.timeout = 15000
    http.setRequestHeader('token', token)
    http.setRequestHeader('community', 0)
    http.setRequestHeader('channel', channel)
    const prerequest = new Date()
    http.onload = (e) => {

        const afterrequest = new Date()
        const ping = afterrequest - prerequest
        if (http.readyState == 4 && http.status == 200) {
            window.console.log("AIOSJDOAIJDOIASJDOIAJDSO")
        const msgList = document.getElementById('chattingBox')

    var messagesTable = http.responseText.split('\\');

    // window.console.log(time)

    var i = 0

    for (i in messagesTable) {
        // window.console.log(messagesTable)

        var decodedMsg;
        try { decodedMsg = JSON.parse(messagesTable[i].replaceAll('<backslash>','\\\\')) }
        catch(err) { //window.console.log("Error: "+err+"\n Message: "+messagesTable[i]); decodedMsg = "This message couldn't be displayed. Try again later."
            }
        console.log(decodedMsg)
        console.log(http.status)
        console.log(http.responseText)

        // window.console.log(decodedMsg)
        console.log(ping)
        if (Number(decodedMsg['time'] + ping > time)) {
            var newChat = document.createElement("div")
            var message = decodedMsg["text"] //.replaceAll("\\","")
            if (decodedMsg["username"] == username) {
                newChat.className = "userchatbox"
            } else {
                newChat.className = "foreignchatbox"
            }

            msgList.appendChild(newChat)
            
            if (decodedMsg["name"]) {
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                var msgdate =  daysOfWeek[(new Date(decodedMsg["time"])).getDay()] +" "+ (new Date(decodedMsg["time"])).getDate() + ", " + monthsOfYear[(new Date(decodedMsg["time"])).getMonth()] + " - " +(new Date(decodedMsg["time"])).getHours()+":"+(new Date(decodedMsg["time"])).getMinutes()
                newChat.innerHTML = "<small><strong> " + decodedMsg["name"] + " </strong> • "+msgdate+" </small><br> " + message + ""
            } else {
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                var msgdate =  daysOfWeek[(new Date(decodedMsg["time"])).getDay()] +" "+ (new Date(decodedMsg["time"])).getDate() + ", " + monthsOfYear[(new Date(decodedMsg["time"])).getMonth()] + " - " +(new Date(decodedMsg["time"])).getHours()+":"+(new Date(decodedMsg["time"])).getMinutes()
                
                newChat.innerHTML = "<small><strong> " + decodedMsg["username"] + " </strong> • "+msgdate+" </small><br> " + message + ""
            }

            msgList.scrollTop = msgList.scrollHeight;

            if (!document.hasFocus()) {
                new Notification("ArcChat - "+decodedMsg["name"] + " (" + decodedMsg["username"]+")",{body:decodedMsg["text"]})
            }
        }
    }
    
    
    
    
    const date = new Date()
    time = date.getTime()
}
}
http.send(null)
}

if (localStorage.getItem("token")) {
    loginui.style.display = "none";
    const chatWindow = document.getElementById('chatWindow')
    const chatBox = document.getElementById('chattingBox')
    dashui.style.display = "none";
    chatWindow.style.display = "block"
    var chatSel = chatWindow.getAttribute('chatSel')
    chatBox.setAttribute('chatSel', 'generalDiscussion')


    startChannel()
    token = localStorage.getItem('token');
    var userBox = document.getElementById('usernameDisplay')
    const http = new XMLHttpRequest();
    http.open("GET", url + "/tokenlogin", true)
    http.setRequestHeader('token', token)
    http.onload = (e) => {
        if (http.readyState ==  4) {
            window.console.log(http.responseText)
            var decodedInfo = JSON.parse(http.responseText)
            username = decodedInfo['user'];
            if (status) {
                status.remove();
                status = null;
            }
            windowStatus.innerHTML = "ArcChat"
            userBox.innerHTML =  username 
        }
    }
    http.send(null)
}

loginbutton.addEventListener('click', function () {

    var http = new XMLHttpRequest()

    http.open("get", url + "/login", false)
    http.setRequestHeader("user", usernamefield.value)
    http.setRequestHeader("pwd", passwordfield.value)
    http.send(null)
    window.console.log(http.status)
    if (http.status != 200 || usernamefield.value.length > 20) {
        if (!status) {
            status = document.createElement("p")
            loginui.appendChild(status)
        }
        
        if (http.status == 403) {
            status.innerHTML = "Incorrect username or password."
        } else if (http.status == "400") {
            status.innerHTML = "Please enter a username or password. If you did, something went wrong."
        } else if (usernamefield.value.length > 20) {
            status.innerHTML = "Usernames cannot be over 20 characters in length. Please contact Izaak or Logan."
        }
        else {
            status.innerHTML = "Something went wrong. Code: " + http.status
        }
    } else {
        var userBox = document.getElementById('usernameDisplay')
        username = usernamefield.value;
        if (status) {
            status.remove();
            status = null;
        }
        token = http.responseText
        loginui.style.display = "none";
        windowStatus.innerHTML = "ArcChat"
        userBox.innerHTML =  username 
        localStorage.setItem('token', http.responseText)
        const chatWindow = document.getElementById('chatWindow')
        const chatBox = document.getElementById('chattingBox')
        dashui.style.display = "none";
        chatWindow.style.display = "block"
        var chatSel = chatWindow.getAttribute('chatSel')
        chatBox.setAttribute('chatSel', 'generalDiscussion')

        startChannel()

        usernamefield.value = ""
        passwordfield.value = ""

        const error = document.getElementById("loginError")

        if (config.errorOnLogin == true) {
            error.style.display = "flex"

            document.getElementById("errorMsg").innerHTML = config.loginErrorString

            document.getElementById("closeError").addEventListener("click", function() {
                error.style.display = "none"
            })
        }
        }
})

genDiscButton.addEventListener('click', function () {
    const chatWindow = document.getElementById('chatWindow')
    const chatBox = document.getElementById('chattingBox')
    dashui.style.display = "none";
    chatWindow.style.display = "block"
    var chatSel = chatWindow.getAttribute('chatSel')
    chatBox.setAttribute('chatSel', 'generalDiscussion')


    startChannel()

})

function startChannel() {
    setInterval(function() {
        if (token != "") {
            updateMessages()
    }}, 1000)
}

settingsButton.addEventListener('click', function() {
    settingsUI.style.display = "flex"
})

const closeSettingsButton = document.getElementById('closeSettings')

closeSettingsButton.addEventListener('click', function() {
    settingsUI.style.display = "none"
})

const logoutButton = document.getElementById('logoutButton')

logoutButton.addEventListener('click', function() {
    localStorage.setItem('token', "")
    token = ""
    settingsUI.style.display = "none"
    chatWindow.style.display = "none"
    loginui.style.display = "flex"
    time = 0
    chattingBox.innerHTML = ""
})

const changeNameButton = document.getElementById("submitName")

changeNameButton.addEventListener("click", function() {
    displayName = document.getElementById("changeNameField").value
    changeNameButton.innerHTML = "Success!"
    setTimeout(function() {
        changeNameButton.innerHTML = "Change Display Name"
    }, 2000)
    var userBox = document.getElementById('usernameDisplay')
    userBox.innerHTML = displayName
})

setInterval(function() {
    window.console.log(debugMode)
}, 1000)

let keysPressed = {}; // Initialize an empty object

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true; // Set the key as true when pressed
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false; // Set the key as false when released
});

const servConnectId = document.getElementById('newServer')

function updateUrl() {
    if (customUrl != "") {
        url = customUrl
    } else {
        url = config.url
    }
}

document.addEventListener('keydown', function() {
if ((keysPressed['Control'] && keysPressed['Alt'] && keysPressed['d']) || (keysPressed['Meta'] && keysPressed['d'])) {
    logoutButton.click()
    keysPressed = {}
    servConnectId.style.display = "flex"
}
})

document.getElementById('connectToExternal').addEventListener('click', function() {
    customUrl = document.getElementById("ipAddress").value
    servConnectId.style.display = "none"
    updateUrl()
})

document.getElementById('clearConnectToExternal').addEventListener('click', function() {
    servConnectId.style.display = "none"
    customUrl = ""
    updateUrl()
})

document.getElementById('cancelConnectToExternal').addEventListener('click', function() {
    servConnectId.style.display = "none"
    updateUrl()
})

document.getElementById("chat1").addEventListener("click", function() {
    channel = 0
    chattingBox.innerHTML = ""
    time = 0
})
document.getElementById("chat2").addEventListener("click", function() {
    channel = 1
    chattingBox.innerHTML = ""
    time = 0
})
document.getElementById("chat3").addEventListener("click", function() {
    channel = 3
    chattingBox.innerHTML = ""
    time = 0
})


