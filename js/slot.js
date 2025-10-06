// slot.js
(function(){
  const user = ensureLogin();
  if(!user) return;

  const symbols = ['🍒','🍋','🔔','🍉','⭐','7️⃣'];
  const reels = [document.getElementById('r0'), document.getElementById('r1'), document.getElementById('r2')];
  const spinBtn = document.getElementById('spinBtn');
  const betInput = document.getElementById('slotBet');
  const status = document.getElementById('slotStatus');

  function randInt(n){ return Math.floor(Math.random()*n); }

  if(document.getElementById('maxBet')){
    document.getElementById('maxBet').addEventListener('click', ()=>{
      const u = loadUser(); betInput.value = Math.max(1, Math.floor(u.credits/10));
    });
  }

  spinBtn.addEventListener('click', async ()=>{
    const bet = Math.max(1, parseInt(betInput.value||1));
    const u = loadUser();
    if(bet > u.credits){ alert('Saldo tidak cukup'); return; }
    changeCredits(-bet);
    status.textContent = 'Spinning...';
    // simple spin
    const res = [];
    for(let i=0;i<3;i++){
      for(let t=0;t<12 + i*4; t++){
        reels[i].textContent = symbols[randInt(symbols.length)];
        await new Promise(r=>setTimeout(r, 25 + i*6));
      }
      res[i] = symbols[randInt(symbols.length)];
      reels[i].textContent = res[i];
    }
    // payout logic
    let win = 0;
    if(res[0]===res[1] && res[1]===res[2]){
      const s=res[0];
      win = bet * (s==='7️⃣' ? 12 : 6);
      status.textContent = `JACKPOT! ${res.join(' ')} → Menang ${win}`;
    } else if(res[0]===res[1]||res[1]===res[2]||res[0]===res[2]){
      win = bet*2;
      status.textContent = `Pair ${res.join(' ')} → Menang ${win}`;
    } else {
      status.textContent = `Kalah ${res.join(' ')}. Coba lagi.`;
    }
    if(win) changeCredits(win);
  });
})();
