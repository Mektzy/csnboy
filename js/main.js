// main.js - login, balance, common helpers
const STORAGE_USER = 'simcasino_user_v1';

// helpers
function saveUser(user){
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}
function loadUser(){ try{ return JSON.parse(localStorage.getItem(STORAGE_USER)); }catch(e){return null;} }
function ensureLogin(){
  const user = loadUser();
  if(!user) { if(location.pathname.indexOf('index.html')===-1) location.href = 'index.html'; return null;}
  return user;
}
function setBalanceDisplay(){
  const u = loadUser();
  if(!u) return;
  const name = u.name;
  const bal = u.credits;
  if(document.getElementById('balance')) document.getElementById('balance').textContent = bal;
  if(document.getElementById('userDisplay')) document.getElementById('userDisplay').textContent = name + ' • ' + bal;
  if(document.getElementById('userName')) document.getElementById('userName').textContent = name;
}
function changeCredits(delta){
  const user = loadUser(); if(!user) return;
  user.credits = Math.max(0, Math.floor(user.credits + delta));
  saveUser(user);
  setBalanceDisplay();
  return user.credits;
}

// login on index.html
if(document.getElementById('loginBtn')){
  document.getElementById('loginBtn').addEventListener('click', ()=>{
    const name = (document.getElementById('username').value || '').trim();
    const start = Math.max(0, parseInt(document.getElementById('startCredits').value||0));
    if(!name){ alert('Masukkan nama'); return; }
    saveUser({ name: name.slice(0,20), credits: start || 5000});
    location.href = 'lobby.html';
  });
  document.getElementById('guestBtn').addEventListener('click', ()=>{
    saveUser({ name: 'Guest', credits: 5000});
    location.href = 'lobby.html';
  });
}

// global actions on other pages
document.addEventListener('DOMContentLoaded', ()=>{
  const user = loadUser();
  if(user){
    setBalanceDisplay();
    const logout = document.getElementById('logout');
    if(logout) logout.addEventListener('click', ()=>{ if(confirm('Logout?')){ localStorage.removeItem(STORAGE_USER); location.href='index.html'; }});
  } else {
    // redirect to index on pages that need login
    if(location.pathname.indexOf('index.html')===-1) location.href='index.html';
  }
});
