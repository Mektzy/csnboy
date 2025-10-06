// blackjack.js
(function(){
  const user = ensureLogin();
  if(!user) return;

  const dealerHandEl = document.getElementById('dealerHand');
  const playerHandEl = document.getElementById('playerHand');
  const dealerValueEl = document.getElementById('dealerValue');
  const playerValueEl = document.getElementById('playerValue');

  let deck = [], dealerHand = [], playerHand = [], currentBet = 0, inRound = false;

  function createDeck(){
    const suits = ['♠','♥','♦','♣'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const d = [];
    for(const s of suits) for(const r of ranks) d.push({suit:s,rank:r});
    return d;
  }
  function shuffleDeck(d){
    for(let i=d.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [d[i],d[j]]=[d[j],d[i]]; }
    return d;
  }
  function cardText(c){ return c.rank + c.suit; }
  function handValue(hand){
    let total=0, aces=0;
    for(const c of hand){
      if(c.rank==='A'){ aces++; total+=11; }
      else if(['J','Q','K'].includes(c.rank)) total+=10;
      else total+=Number(c.rank);
    }
    while(total>21 && aces>0){ total-=10; aces--; }
    return total;
  }
  function renderHands(hideDealerHole=true){
    dealerHandEl.innerHTML=''; playerHandEl.innerHTML='';
    for(let i=0;i<dealerHand.length;i++){
      const c=dealerHand[i]; const el=document.createElement('div'); el.className='card-face'; el.style.minWidth='56px';
      if(i===0 && hideDealerHole && inRound) el.textContent='🂠'; else el.textContent=cardText(c);
      dealerHandEl.appendChild(el);
    }
    for(const c of playerHand){
      const el=document.createElement('div'); el.className='card-face'; el.style.minWidth='56px'; el.textContent=cardText(c);
      playerHandEl.appendChild(el);
    }
    if(inRound && hideDealerHole){ const visible=dealerHand.slice(1); dealerValueEl.textContent = 'Dealer shows: ' + handValue(visible) + ' + ?'; }
    else dealerValueEl.textContent = 'Dealer: ' + handValue(dealerHand);
    playerValueEl.textContent = 'Player: ' + handValue(playerHand);
  }

  document.getElementById('dealBtn').addEventListener('click', ()=>{
    if(inRound) return alert('Round sedang berlangsung');
    const bet = Math.max(1, parseInt(document.getElementById('blackjackBet').value||1));
    const u = loadUser(); if(bet>u.credits) return alert('Saldo tidak cukup');
    currentBet = bet; changeCredits(-bet);
    inRound=true; deck=shuffleDeck(createDeck()); dealerHand=[]; playerHand=[];
    playerHand.push(deck.pop()); dealerHand.push(deck.pop()); playerHand.push(deck.pop()); dealerHand.push(deck.pop());
    document.getElementById('hitBtn').disabled=false; document.getElementById('standBtn').disabled=false;
    renderHands(true);
    // immediate blackjack check
    const pVal=handValue(playerHand), dVal=handValue(dealerHand);
    const playerBlackjack = pVal===21 && playerHand.length===2;
    const dealerBlackjack = dVal===21 && dealerHand.length===2;
    if(playerBlackjack || dealerBlackjack){
      document.getElementById('hitBtn').disabled=true; document.getElementById('standBtn').disabled=true;
      inRound=false; renderHands(false);
      if(playerBlackjack && !dealerBlackjack){
        const win = Math.floor(currentBet * 2.5); changeCredits(win);
        alert('Blackjack! Kamu menang ' + win);
      } else if(!playerBlackjack && dealerBlackjack){
        alert('Dealer blackjack. Kamu kalah.');
      } else {
        changeCredits(currentBet);
        alert('Both blackjack: push (taruhan dikembalikan).');
      }
    }
  });

  document.getElementById('hitBtn').addEventListener('click', ()=>{
    if(!inRound) return;
    playerHand.push(deck.pop()); renderHands(true);
    if(handValue(playerHand)>21){
      inRound=false; document.getElementById('hitBtn').disabled=true; document.getElementById('standBtn').disabled=true;
      renderHands(false); alert('Bust! Kamu kalah.');
    }
  });

  document.getElementById('standBtn').addEventListener('click', async ()=>{
    if(!inRound) return;
    document.getElementById('hitBtn').disabled=true; document.getElementById('standBtn').disabled=true;
    renderHands(false);
    while(handValue(dealerHand) < 17){
      await new Promise(r=>setTimeout(r,600));
      dealerHand.push(deck.pop()); renderHands(false);
    }
    const pVal=handValue(playerHand), dVal=handValue(dealerHand);
    if(dVal>21){ const win = currentBet * 2; changeCredits(win); alert('Dealer busts — kamu menang ' + win); }
    else {
      if(pVal > dVal){ const win = currentBet * 2; changeCredits(win); alert('Kamu menang ' + win); }
      else if(pVal < dVal){ alert('Kamu kalah'); }
      else { changeCredits(currentBet); alert('Push — taruhan dikembalikan'); }
    }
    inRound=false; renderHands(false);
  });

})();
