// ================= User Management =================
function showSignup(){document.getElementById('login-box').style.display='none';document.getElementById('signup-box').style.display='block';}
function showLogin(){document.getElementById('login-box').style.display='block';document.getElementById('signup-box').style.display='none';}

function signup(){
  const name=document.getElementById('signup-name').value;
  const phone=document.getElementById('signup-phone').value;
  const pass=document.getElementById('signup-pass').value;
  if(!name || !phone || !pass){alert('Fill all'); return;}
  const id = 'U'+Math.floor(Math.random()*99999);
  localStorage.setItem(phone, JSON.stringify({name, phone, pass, id, coins:0, lastDaily:0}));
  alert('Account created!'); showLogin();
}
function login(){
  const phone=document.getElementById('login-phone').value;
  const pass=document.getElementById('login-pass').value;
  const user=JSON.parse(localStorage.getItem(phone));
  if(user && user.pass===pass){
    localStorage.setItem('currentUser', phone);
    window.location='slot.html';
  } else {alert('Invalid');}
}

// ================= Slot Logic ===================
const symbols = ['👌','👉','👶','🤳','💧','💃','🕺','👩‍❤️‍👨','🧘','🙍','🛌','🤵','👰','🍆','🥨','😍','🥰','🤩','🤏','🪡','🗿','🚨','🍿','🍑','🥕','🍒','🦆','🍌','🍎'];
const rows=6, cols=5;
let freeSpins=0;

document.addEventListener('DOMContentLoaded',()=>{
  const currentUser = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser')));
  if(!currentUser) { window.location='index.html'; return; }
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-id').textContent = currentUser.id;
  document.getElementById('user-coins').textContent = currentUser.coins;
  
  const container = document.getElementById('slot-container');
  for(let r=0;r<rows;r++){
    const rowDiv=document.createElement('div');
    rowDiv.classList.add('slot-row');
    for(let c=0;c<cols;c++){
      const cell=document.createElement('div');
      cell.classList.add('slot-cell');
      cell.textContent = symbols[Math.floor(Math.random()*symbols.length)];
      rowDiv.appendChild(cell);
    }
    container.appendChild(rowDiv);
  }
});

// Spin function with 3D animation
function spin(){
  const container = document.getElementById('slot-container');
  const currentUserKey = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(localStorage.getItem(currentUserKey));
  
  container.querySelectorAll('.slot-cell').forEach(cell=>{
    cell.classList.add('animate');
    cell.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    setTimeout(()=>{cell.classList.remove('animate');},500);
  });
  
  // Check free spin win for 🗿
  let count=0;
  container.querySelectorAll('.slot-cell').forEach(cell=>{if(cell.textContent==='🗿') count++;});
  if(count===3){freeSpins+=5;}
  else if(count===4){freeSpins+=15;}
  else if(count>=5){freeSpins+=20;}
  document.getElementById('free-spins').textContent = freeSpins;
}

// Daily rewards
const dailyRewards=[5000,10000,6000,7000,8000,9000,10000];
function claimDaily(){
  const currentUserKey = localStorage.getItem('currentUser');
  const currentUser = JSON.parse(localStorage.getItem(currentUserKey));
  const today = new Date().getDay();
  if(currentUser.lastDaily === today){alert('Already claimed today'); return;}
  const reward = dailyRewards[today%7];
  currentUser.coins += reward;
  currentUser.lastDaily = today;
  localStorage.setItem(currentUserKey, JSON.stringify(currentUser));
  document.getElementById('user-coins').textContent = currentUser.coins;
  alert(`You got ${reward} Kyat!`);
}
