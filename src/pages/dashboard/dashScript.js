const loginbutton = document.getElementById("loginButton")
const loginui = document.getElementById("welcomeScreen")
const dashui = document.getElementById("loggedInDash")
const genDiscButton = document.getElementById("genDiscChat")
const sendButton = document.getElementById('sendChat')
const passwordfield = document.getElementById('password')
const usernamefield = document.getElementById('username')
import * as config from "../../config.js"
const DOMPurify = require('dompurify')
var status;
var token;
var username;
var time = 0
const msgBox = document.getElementById('chatBox');
const windowStatus = document.getElementById("title")
windowStatus.innerHTML = "ArcChat - Login"
var messages = ''

function sendMessage() {

    const http = new XMLHttpRequest();
    http.open("POST", config.sendmsg)
    http.setRequestHeader('token', token)
    http.setRequestHeader('community', 0)
    http.setRequestHeader('channel', 1)
    http.send()

    var message = msgBox.value;
    // <img src='https://media1.tenor.com/m/_RZWxr9IPg8AAAAd/goose-silly.gif'></img>
    window.console.log(message)
    message = DOMPurify.sanitize(message)
    
    const checkWhitespace = str => !str.replace(/\s/g, '').length

    const msgTime = new Date().getTime();

    message = message.replace('"', '\\"')

    var assembledMsg = JSON.stringify(
        {
            "name":username,
            "time":msgTime+1,
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
    http.open("GET", config.getmsgs)
    http.setRequestHeader('token', token)
    http.setRequestHeader('community', 0)
    http.setRequestHeader('channel', 1)
    http.send()
    const msgList = document.getElementById('chattingBox')

    var messagesTable = messages.split('\\')

    // window.console.log(time)

    var i = 0

    for (i in messagesTable) {
        // window.console.log(messagesTable)

        var decodedMsg;
        try { decodedMsg = JSON.parse(messagesTable[i]) }
        catch(err) { window.console.log("Error: "+err+"\n Message: "+messagesTable[i]); decodedMsg = "This message couldn't be displayed. Try again later."}

        // window.console.log(decodedMsg)
        if (Number(decodedMsg['time'] > time)) {
            var newChat = document.createElement("div")

            if (decodedMsg["name"] == username) {
                newChat.className = "userchatbox"
            } else {
                newChat.className = "foreignchatbox"
            }

            msgList.appendChild(newChat)

            newChat.innerHTML = "<small><strong> " + decodedMsg["name"] + " <br></strong></small> " + decodedMsg["text"] + ""

            msgList.scrollTop = msgList.scrollHeight;
        }
    }
    
    const date = new Date()
    time = date.getTime()
}

if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    var userBox = document.getElementById('usernameDisplay')
    const http = new XMLHttpRequest();
    http.open("GET", config.userinforetrieval)
    http.setRequestHeader('token', token)
    http.send()
    var decodedInfo = JSON.parse(http.responseText)
        username = decodedInfo['user'];
        if (status) {
            status.remove();
            status = null;
        }
        loginui.style.display = "none";
        windowStatus.innerHTML = "ArcChat"
        dashui.style.display = "flex";
        userBox.innerHTML = "<h3> " + username + " </h3>"
}

loginbutton.addEventListener('click', function () {

    var http = new XMLHttpRequest()

    http.open("get", config.loginurl, false)
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
        window.console.log("Do fancy login logic here")
        if (status) {
            status.remove();
            status = null;
        }
        loginui.style.display = "none";
        windowStatus.innerHTML = "ArcChat"
        dashui.style.display = "flex";
        userBox.innerHTML = "<h3> " + username + " </h3>"
        localStorage.setItem('token', http.responseText)
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
    setInterval(updateMessages, 100)
}