// zeus.js - Zeus Jackpot
(function(){
  const user = ensureLogin();
  if(!user) return;

  const symbols = ['🍇','🍋','⚡','⭐','7️⃣'];
  const reels = [document.getElementById('z0'),document.getElementById('z1'),document.getElementById('z2')];
  const spinBtn = document.getElementById('zeusSpin');
  const betInput = document.getElementById('zeusBet');
  const status = document.getElementById('zeusStatus');

  function randInt(n){ return Math.floor(Math.random()*n); }

  spinBtn.addEventListener('click', async ()=>{
    const bet = Math.max(1, parseInt(betInput.value||1));
    const u = loadUser();
    if(bet > u.credits){ alert('Saldo tidak cukup'); return; }
    changeCredits(-bet);
    status.textContent = 'Zeus is charging... ⚡';
    const res = [];
    for(let i=0;i<3;i++){
      for(let t=0;t<10 + i*6; t++){
        reels[i].textContent = symbols[randInt(symbols.length)];
        await new Promise(r=>setTimeout(r, 30 + i*12));
      }
      const pick = Math.random() < 0.08 ? '⚡' : symbols[randInt(symbols.length)];
      res[i] = pick;
      reels[i].textContent = res[i];
    }
    // Payout: triple lightning huge; triple 7 large; pair small
    let win = 0;
    if(res.every(s=>s==='⚡')){
      win = bet * 50; // mega jackpot
      status.textContent = `TRIPLE ⚡⚡⚡ — ZEUS JACKPOT! Menang ${win}`;
    } else if(res.every(s=>s==='7️⃣')){
      win = bet * 20;
      status.textContent = `Triple 7! Menang ${win}`;
    } else if(res[0]===res[1] || res[1]===res[2] || res[0]===res[2]){
      win = bet * 3;
      status.textContent = `Pair! Menang ${win}`;
    } else {
      status.textContent = `Tidak ada kombinasi — ${res.join(' ')}`;
    }
    if(win) changeCredits(win);
  });
})();
