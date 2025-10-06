// roulette.js
(function(){
  const user = ensureLogin();
  if(!user) return;
  const wheelEl = document.getElementById('wheel');
  const betInput = document.getElementById('rouletteBet');
  const choiceEl = document.getElementById('rouletteChoice');
  const status = document.getElementById('rouletteStatus');

  function randInt(n){ return Math.floor(Math.random()*n); }
  function rouletteColor(n){ if(n===0) return 'green'; return (n % 2 === 0) ? 'black' : 'red'; }

  document.getElementById('spinRoulette').addEventListener('click', async ()=>{
    const bet = Math.max(1, parseInt(betInput.value||1));
    const u = loadUser();
    if(bet > u.credits){ alert('Saldo tidak cukup'); return; }
    changeCredits(-bet);
    status.textContent = 'Spinning…';
    for(let i=0;i<10;i++){ wheelEl.textContent = randInt(37); await new Promise(r=>setTimeout(r,60)); }
    const result = randInt(37);
    const color = rouletteColor(result);
    wheelEl.textContent = `${result} (${color})`;
    let win = 0;
    if(color === choiceEl.value){ win = bet * 2; status.textContent = `Menang: ${result} ${color} — menang ${win}`; }
    else status.textContent = `Kalah: ${result} ${color}`;
    if(win) changeCredits(win);
  });
})();
