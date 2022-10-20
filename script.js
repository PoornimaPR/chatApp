let hostname = location.hostname;
let port = location.port;
let socket = io();
//const socket = io(`http://${hostname}:${port}`,{ transports : ['websocket'] });
const msgForm = document.getElementById("send-container");
const msgContainer = document.getElementById("message-container");
const msgInput = document.getElementById("message-input");
const nameForm = document.getElementById("name-form");
const nameInp = document.getElementById("name-input");


nameForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById("name-container").style.display = "none";
    document.getElementById("heading").style.display = "none";
    msgContainer.style.display = "block";

    const name = nameInp.value;
    socket.emit('send-name',name);
});


window.onload = function(){
    msgContainer.style.display = "none";
}


//const name = prompt("Enter your name");
appendMsg("You joined");
//socket.emit('new-user', name);


socket.on('chat-message', data => {
    appendMsg(`${data.name} : ${data.message} `);
});

socket.on('user-connected', name => {
    appendMsg(`${name} joined `);
});

msgInput.addEventListener('input', e => {
    //console.log('pressed');
    e.preventDefault();
    socket.emit('typing', nameInp.value);
});

socket.on('getTypingStatus', name => {
    document.getElementById("typing").innerHTML = name +' '+ 'is typing';
    setTimeout(() => {
        document.getElementById("typing").innerHTML = "";
      }, 3000);
  });

socket.on('user-disconnected', name => {
    appendMsg(`${name} left `);
});

msgForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = msgInput.value;
    appendMsg(`You : ${message}`);
    socket.emit('send-chat-msg',message);
    msgInput.value = '';
});

function appendMsg(message){
    const msgElement = document.createElement('div');
    msgElement.innerText = message;
    msgContainer.append(msgElement);
}