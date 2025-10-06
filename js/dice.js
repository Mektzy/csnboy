// dice.js
(function(){
  const user = ensureLogin();
  if(!user) return;
  const display = document.getElementById('diceDisplay');
  const betInput = document.getElementById('diceBet');
  const choiceEl = document.getElementById('diceChoice');
  const status = document.getElementById('diceStatus');

  function randInt(n){ return Math.floor(Math.random()*n); }

  document.getElementById('rollDice').addEventListener('click', async ()=>{
    const bet = Math.max(1, parseInt(betInput.value||1));
    const u = loadUser();
    if(bet > u.credits){ alert('Saldo tidak cukup'); return; }
    changeCredits(-bet);
    status.textContent = 'Rolling…';
    for(let i=0;i<8;i++){ display.textContent = ['🎲','🎲','🎲'][randInt(3)]; await new Promise(r=>setTimeout(r,80)); }
    const outcome = randInt(6) + 1;
    display.textContent = String(outcome);
    const choice = parseInt(choiceEl.value);
    if(outcome === choice){
      const win = bet * 6;
      changeCredits(win);
      status.textContent = `Menang ${win} (hasil ${outcome})`;
    } else {
      status.textContent = `Kalah (hasil ${outcome})`;
    }
  });
})();
