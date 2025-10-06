// coin.js
(function(){
  const user = ensureLogin();
  if(!user) return;
  const display = document.getElementById('coinDisplay');
  const betInput = document.getElementById('coinBet');
  const choiceEl = document.getElementById('coinChoice');
  const status = document.getElementById('coinStatus');

  document.getElementById('flipCoin').addEventListener('click', async ()=>{
    const bet = Math.max(1, parseInt(betInput.value||1));
    const u = loadUser();
    if(bet > u.credits){ alert('Saldo tidak cukup'); return; }
    changeCredits(-bet);
    status.textContent = 'Flipping…';
    // animation
    for(let i=0;i<8;i++){ display.textContent = Math.random()<0.5 ? '🪙' : '🪙'; await new Promise(r=>setTimeout(r,80)); }
    const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
    display.textContent = outcome === 'heads' ? '🤴' : '👸';
    if(outcome === choiceEl.value){
      const win = bet * 2;
      changeCredits(win);
      status.textContent = `Menang ${win} (hasil ${outcome})`;
    } else {
      status.textContent = `Kalah (hasil ${outcome})`;
    }
  });
})();
