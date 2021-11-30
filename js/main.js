//Constants
const pCardsEl = document.querySelector(".pCards"); //Player current cards
const pBankEl = document.querySelector(".pBank"); //Player Bank
const cCardsEl = document.querySelector(".cCards"); //Dealer current cards
const cBankEl = document.querySelector("#cBank"); //Dealer bank
const potEl = document.querySelector("#pot"); //money in the middle
const banner = document.querySelector("header"); //staging for winner
const round = document.querySelector(".round"); //button to start next round
const hitEl = document.querySelector(".hit"); //hit button
const standEl = document.querySelector(".stand"); //stand button
const betEl = document.querySelector(".bet"); //bet button
const c1CardEl = document.createElement("div"); //staging for Dealer card 1
const c2CardEl = document.createElement("div"); //staging for Dealer card 2
const p1CardEl = document.createElement("div"); //staging for Player card 1
const p2CardEl = document.createElement("div"); //staging for Player card 2
const newCardEl = document.createElement("div"); //staging for new card
const winEl = document.createElement("h2"); //current winner
const suits = ["s", "c", "d", "h"]; //for tracking type of suit
const ranks = [
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "J",
  "Q",
  "K",
  "A",
]; //for tracking card number
const masterDeck = buildMasterDeck();

//state variables
let pot, //for tracking pot
  pBank, //for tracking Player bank
  cBank, //for tracking Dealer bank
  pScore, //for tracking Player current score
  cScore, //for tracking Dealer current score
  shuffledDeck, //for tracking deck
  p1Hand, //for tracking Player curret hand
  p2Hand, // for tracking Dealer current hand
  money, //for tracking how much player bets
  turn; //for tracking whose turn it is

//event listeners
hitEl.addEventListener("click", addToHand); //adds functionality to hit button
standEl.addEventListener("click", dealerTurn); //adds functionality to stand button
betEl.addEventListener("click", addToPot); //adds functionality to bet button
round.addEventListener("click", newRound); //add functionality to new round button
//functions
init();
function init() {
  //inital state of game
  shuffledDeck = getNewShuffledDeck(); //shuffled deck
  p1Hand = [shuffledDeck.pop(), shuffledDeck.pop()]; //Player hand
  p2Hand = [shuffledDeck.pop(), shuffledDeck.pop()]; //Dealer hand
  pScore = p1Hand[0].value + p1Hand[1].value; //Player Score
  cScore = p2Hand[0].value + p2Hand[1].value; //Dealer Score
  pBank = 2000; //Player Bank
  cBank = 2000; //Dealer bank
  pot = 0; //inital state of pot
  turn = true; //starts on Player turn
  money = 0; //reset bet tracker
  turnOffButtons(standEl);
  turnOffButtons(hitEl);
  turnOffButtons(round);
  render();
}

function addToPot() {
  if (pBank !== 0) {
    pBank -= 500; //take 500 from Player Bank
    pot += 500; //put 500 in pot
    money += 500; //adds 500 to money
  }
  if (pBank === 0) {
    betEl.setAttribute("disabled", "true"); //turn off button when bank is empty
  }
  turnOnButton(hitEl); //turn on hit button
  turnOnButton(standEl); //turn on stand button
  render();
}

function dealerTurn() {
  //changes it to Dealer turn
  if (turn === true) {
    turn = false;
  }
  //Dealer logic
  if (turn === false) {
    //betting logic
    if (cBank >= money) {
      //match Player bet
      cBank -= money;
      pot += money;
    } else {
      //All in
      cBank -= cBank;
      pot += cBank;
    }
    //Dealer Hand logic
    if (cScore <= 17) {
      newCard = shuffledDeck.pop(); //grabs new card
      cScore += newCard.value; //adds new card score to Dealer score
      newCardEl.setAttribute("class", `card ${newCard.face}`); //adding card to stage
      cCardsEl.appendChild(newCardEl); //pushing card to browser
    }
    //turns off buttons
    if (hitEl.disabled === false) {
      turnOffButtons(hitEl);
    }
    if (betEl.disabled === false) {
      turnOffButtons(hitEl);
    }
    turnOffButtons(standEl);

    //checks for winner
    if (pBank === 0 && pot === 0) {
      winEl.innerText = "Dealer has won";
      banner.appendChild(winEl);
    } else if (cBank === 0 && pot === 0) {
      winEl.innerText = "Player has won";
      banner.appendChild(winEl);
    }
    //back to Player turn
    if (pBank !== 0 && cBank !== 0) {
      round.removeAttribute("disabled"); //to end round
    }
    turn = true; //ends Dealer turn
    render(); //sends to browser
  }
}

function addToHand() {
  //new card logic
  newCard = shuffledDeck.pop(); //pulls card from deck
  newCardEl.setAttribute("class", `card ${newCard.face}`); //sets up new card
  pScore += newCard.value; //new Player score
  pCardsEl.appendChild(newCardEl); //adds card to hand
  turnOffButtons(hitEl); // turn off hit button
  turnOffButtons(betEl); //turn off bet button
  render();
}

function newRound() {
  //get rid of excess cards for both Dealer and Player
  if (pCardsEl.childNodes.length > 2) {
    pCardsEl.removeChild(pCardsEl.firstChild);
  }
  if (cCardsEl.childNodes.length > 2) {
    cCardsEl.removeChild(cCardsEl.firstChild);
  }
  //win/lose pot logic
  if (cScore < 21 && cScore > pScore) {
    console.log(`Dealer score: ${cScore}`);
    //if Dealer wins pot
    cBank += pot; //adds pot to Dealer Bank
    pot = 0; //resets pot
  }
  if (pScore < 21 && cScore < pScore) {
    //If Player wins pot
    console.log(`Player score: ${pScore}`);
    pBank += pot; //adds pot to Dealer Bank
    pot = 0; //resets pot
  }
  //if either dealer or player gets over 21
  if (cScore > 21 && pScore < 21) {
    pBank += pot;
    pot = 0;
  }
  if (pScore > 21 && cScore < 21) {
    cBank += pot;
    pot = 0;
  }
  //new Hands and score
  p1Hand = [shuffledDeck.pop(), shuffledDeck.pop()]; //player Hand
  p2Hand = [shuffledDeck.pop(), shuffledDeck.pop()]; //Dealer Hand
  pScore = p1Hand[0].value + p1Hand[1].value; //Player score
  cScore = p2Hand[0].value + p2Hand[1].value; //Dealer score
  //buttons
  betEl.removeAttribute("disabled"); // turn on bet button
  round.setAttribute("disabled", "true"); // turn off new round button
  render();
}

function render() {
  pushCards(pCardsEl, p1CardEl, p2CardEl, cCardsEl, c1CardEl, c2CardEl);
  pBankEl.innerHTML = pBank; //push Player bank
  cBankEl.innerHTML = cBank; //push Dealer bank
  potEl.innerHTML = pot; //pushing pot to browser
}

function buildMasterDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === "A" ? 11 : 10),
      });
    });
  });
  return deck;
}

function getNewShuffledDeck() {
  // Create a copy of the masterDeck (leave masterDeck untouched!)
  const tempDeck = [...masterDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}
//Helper Functions
function turnOnButton(btn) {
  btn.removeAttribute("disabled");
}
function pushCards(el1, div1, div2, el2, div3, div4) {
  div1.setAttribute("class", `card ${p1Hand[0].face}`);
  div2.setAttribute("class", `card ${p1Hand[1].face}`);
  div3.setAttribute("class", `card ${p2Hand[0].face}`);
  div4.setAttribute("class", `card ${p2Hand[1].face}`);
  el1.appendChild(div1);
  el1.appendChild(div2);
  el2.appendChild(div3);
  0;
  el2.appendChild(div4);
}

function turnOffButtons(btn) {
  btn.setAttribute("disabled", "true");
}
