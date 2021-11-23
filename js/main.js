//constants
const headEl = document.querySelector("header");
const cTotalEl = document.querySelector(".computer");
const pTotalEl = document.querySelector(".player");
const hitEl = document.querySelector(".hit");
const standEl = document.querySelector(".stand");
const betEl = document.querySelector(".bet");
const input = document.querySelector("input");
const btns = document.querySelectorAll("button");
const suits = ["s", "c", "d", "h"];
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
];
const masterDeck = buildMasterDeck();
const cCard1 = document.createElement("div");
const cCard2 = document.createElement("div");
const pCard1 = document.createElement("div");
const pCard2 = document.createElement("div");
//app state (variables)
let pBank,
  cBank,
  pot,
  pTotal,
  cTotal,
  turn,
  shuffledDeck,
  p1Hand,
  p2Hand,
  winner;
//cached element refrences
const money = {
  potEl: document.querySelector("#pot"),
  pBank: document.querySelector(".play"),
  cBank: document.querySelector(".com"),
};
const turns = ["p", "c"];
//event Listeners
hitEl.addEventListener("click", addCards);
standEl.addEventListener("click", endRound);
betEl.addEventListener("click", addToPot);
//functions
mainInit();
function mainInit() {
  pBank = 20000;
  cBank = 20000;
  pot = 0;
  pTotal = 0;
  cTotal = 0;
  turn = turns[0];
  shuffledDeck = getNewShuffledDeck();
  p1Hand = [shuffledDeck.pop(), shuffledDeck.pop()];
  p2Hand = [shuffledDeck.pop(), shuffledDeck.pop()];
  pCard1.setAttribute("class", `card ${shuffledDeck.pop().face}`);
  pCard2.setAttribute("class", `card ${shuffledDeck.pop().face}`);
  cCard1.setAttribute("class", `card ${shuffledDeck.pop().face}`);
  cCard2.setAttribute("class", `card ${shuffledDeck.pop().face}`);
  cTotalEl.appendChild(cCard1);
  cTotalEl.appendChild(cCard2);
  pTotalEl.appendChild(pCard1);
  pTotalEl.appendChild(pCard2);
  render();
}

function addCards(evt) {
  //add card to hand if opponent doesnt already have it in his hand
  if (turn === turns[0]) {
    const newCard = document.createElement("div");
    newCard.setAttribute("class", `card ${shuffledDeck.pop().face}`);
    pTotalEl.appendChild(newCard);
    console.log(pTotalEl);
  }
}
function endRound() {
  //change players

  if (turn === turns[0]) {
    turn = turns[1];
    console.log(turn);
  } else {
    turn = turns[0];
    console.log(turn);
  }
  if (turn === "c") {
    if (cBank > pot) {
      cBank -= pot;
      console.log("hello");
      pot += pot;
    }
  }
  if (pTotal > cTotal && pTotal <= 21) {
    pBank += pot;
    pot = 0;
  } else if (cTotal > pTotal && cTotal <= 21) {
    cBank += pot;
    pot = 0;
  }

  render();
}
function addToPot(evt) {
  //add what you bet to pot
  pot += parseInt(input.value);
  pBank -= pot;
  render();
}

function render() {
  money.potEl.innerText = pot;
  money.pBank.innerHTML = pBank;
  money.cBank.innerHTML = cBank;
  if (winner === "c") {
    headEl.childNodes[0].innerHTML = "Dealer has won";
    btns.forEach(function (btn) {
      btn.setAttribute("disabled", "true");
    });
  } else if (winner === "p") {
    headEl.childNodes[0].innerHTML = "You have won";
    btns.forEach(function (btn) {
      btn.setAttribute("disabled", "true");
    });
  }
}

function loseWin() {
  if (cBank === 0) {
    winner = turns[0];
  } else if (pBank === 0) {
    winner = turns[1];
  }
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
