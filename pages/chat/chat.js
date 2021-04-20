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
const ws = io();
const typing = {};
ws.on('server', msg => {
  msg = createMsg(msg);
  chat_body.append(msg);
  msg.scrollIntoView();
});
ws.on('typing', msg => {
  const name = msg.sender.name;
  if (typing[name]) {
    clearTimeout(typing[name].timer);
    typing[name].timer = window.setTimeout(() => {
      chat_body.removeChild(typing[name].elem);
      delete typing[name];
    }, 1000);
  } else {
    typing[name] = { elem: createMsg(msg) };
    typing[name].timer = window.setTimeout(() => {
      chat_body.removeChild(typing[name].elem);
      delete typing[name];
    }, 1000);
    chat_body.append(typing[name].elem);
    typing[name].elem.scrollIntoView();
  }
});

start_btn.addEventListener('click', e => {
  e.preventDefault();
  if (start_name.value === '') {
    start_name.focus();
  } else {
    user.name = start_name.value;
    user.liter = user.name[0].toUpperCase();
    user.color = start_color.value;
    ws.emit('user data', user);

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

sending_btn.addEventListener('click', e => {
  e.preventDefault();
  if (sending_msg.value === '') {
    sending_msg.focus();
  } else {
    ws.emit('message', sending_msg.value);
    sending_msg.value = '';
  }
});

sending_msg.addEventListener('input', e => {
  ws.emit('typing');
});

function createMsg(msg) {
  const wrap = document.createElement('div');
  wrap.classList.add('message');
  const body = document.createElement('div');
  body.classList.add('message__body');
  body.textContent = msg.body;

  wrap.append(body);

  if (msg.sender === 'server') {
    wrap.classList.add('message--server');
  } else {
    const icon = document.createElement('div');
    icon.textContent = msg.sender.liter;
    icon.classList.add('message__icon');
    icon.style.backgroundColor = msg.sender.color;
    icon.addEventListener('click', () => {
      icon.textContent = msg.sender.name;
      icon.style.width = 'auto';
    });

    if (msg.sender.name === user.name) {
      wrap.classList.add('message--mine');
      wrap.insertBefore(icon, body);
    } else {
      wrap.append(icon);
    }
  }

  return wrap;
}
