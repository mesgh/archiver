const chat = document.querySelector('.chat');
const start = chat.querySelector('.start');
const start_name = chat.querySelector('.start__name');
const start_color = chat.querySelector('.start__color');
const start_btn = chat.querySelector('.start__btn');
const messaging = chat.querySelector('.messaging');
const messaging_icon = chat.querySelector('.messaging__icon');
const messaging_name = chat.querySelector('.messaging__name');
const messaging_exit = chat.querySelector('.messaging__exit');
const chat_body = chat.querySelector('.chat__body');
const chat_foot = chat.querySelector('.chat__foot');
const sending_msg = chat.querySelector('.sending__msg');
const sending_btn = chat.querySelector('.sending__btn');
const user = {};
let ws;

start_btn.addEventListener('click', e => {
  e.preventDefault();
  if (start_name.value === '') {
    start_name.focus();
  } else {
    user.name = start_name.value;
    user.liter = user.name[0].toUpperCase();
    user.color = start_color.value;
    ws = io();
    ws.emit('user data', user);
    ws.on('server', element => console.log(element));

    messaging_icon.textContent = user.liter;
    messaging_icon.style.backgroundColor = user.color;
    messaging_name.textContent = user.name;

    start.style.display = 'none';
    messaging.style.display = 'flex';
    chat_foot.style.bottom = '0';
  }
});

messaging_exit.addEventListener('click', e => {
  e.preventDefault();
  start_name.value = null;
  messaging.style.display = 'none';
  start.style.display = 'block';
  chat_foot.style.bottom = '-45px';
  ws.emit('close');
});

function msg(sender, message) {
  const div = document.createElement('div');
  const cont = div;
  cont.classList.add('message');
  const body = div
  body.classList.add('message__body');
  body.textContent = message;
  cont.append(body);
  
  return cont;
}
