// Define game state variables
let deck, playerHand, dealerHand, playerMoney, dealerMoney, pot;
let winCount = 0,
  lossCount = 0,
  drawCount = 0,
  turnCount = 1;
let lose = false,
  win = false,
  draw = false;

// DOM Elements
const playerCards = document.querySelector(".pCards");
const dealerCards = document.querySelector(".cCards");
const playerBank = document.querySelector(".pBank");
const dealerBank = document.querySelector("#cBank");
const potEl = document.getElementById("pot");
const hitButton = document.querySelector(".hit");
const standButton = document.querySelector(".stand");
const betButton = document.querySelector(".bet");
const newRoundButton = document.querySelector(".round");
const betAmountEl = document.getElementById("betAmount");
const playerSection = document.querySelector(".player-info");
const draws = document.getElementById("draws");
const wins = document.getElementById("playerWins");
const losses = document.getElementById("playerLosses");

// Initialize game
function init() {
  playerMoney = 2000;
  dealerMoney = 2000;
  pot = 0;
  resetRound();
  updateUI();
  hitButton.setAttribute("disabled", "true");
  newRoundButton.setAttribute("disabled", "true");
  standButton.setAttribute("disabled", "true");
  newRoundButton.textContent = "New Round";
}

// Reset for a new round
function resetRound() {
  deck = createDeck();
  shuffleDeck();
  playerHand = dealInitialCards();
  dealerHand = dealInitialCards();
  enableButton(betButton);
  disableButton(hitButton);
  disableButton(standButton);
  disableButton(newRoundButton);
  turnCount=1
  if (document.querySelector(".bust")) {
    document.querySelector(".bust").remove();
  }
}

// Create and shuffle deck
function createDeck() {
  const suits = ["clubs", "diamonds", "hearts", "spades"];
  const values = [
    "A",
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
  ];
  let deck = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });

  return deck;
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
  }
}

// Deal initial cards to player and dealer
function dealInitialCards() {
  return [deck.pop(), deck.pop()];
}

// Add card to hand
function hit(hand) {
  hand.push(deck.pop());
  return hand;
}

// Player decides to hit
hitButton.addEventListener("click", function () {
  hit(playerHand); // Add new card to player's hand
  updateUI(); // This will check if player's score is over 21 and update button states
  if (calculateScore(playerHand) > 21) {
    disableButton(standButton);
    disableButton(hitButton);
    disableButton(betButton);
    bust();
    potWinnings();
  }
  setTimeout(() => {
    if (playerMoney == 0 && calculateScore(playerHand) > 21) {
      newRoundButton.textContent = "GAME OVER";
    }
  }, 200);
});

// Player decides to stand
standButton.addEventListener("click", function () {
  disableButton(standButton)
  disableButton(hitButton)
  dealerTurn();
  potWinnings();
});

// New round setup
newRoundButton.addEventListener("click", function () {
  if (playerMoney == 0) {
    init();
  } else {
    resetRound();
    updateUI();
  }
});

// Player places a bet
betButton.addEventListener("click", function () {
  const betAmount = parseInt(betAmountEl.value, 10);
  if (playerMoney >= betAmount && betAmount > 0) {
    playerMoney -= betAmount;
    dealerMoney -= betAmount;
    pot += betAmount * 2;
    disableButton(betButton);
    updateUI();

    if (hitButton.disabled && standButton.disabled && newRoundButton.disabled) {
      enableButton(standButton);
      enableButton(newRoundButton);
      enableButton(hitButton);
    }
  } else {
    alert("Invalid bet amount or insufficient funds.");
  }
});

// Dealer's turn logic
function dealerTurn() {
  if (turnCount == 1) {
    dealerCards.innerHTML=""
    
    // Show the full dealer's hand
    dealerCards.innerHTML = dealerHand
    .map((card) => createCardHTML(card)) // Render all dealer cards face up
    .join("")
  }
  turnCount++
  while (calculateScore(dealerHand) < 17) {
    hit(dealerHand);
  }
}

// Helper function to show pot amount above bank
function showPotAmountAboveBank(winner) {
  const potAmountDiv = document.createElement("div");
  potAmountDiv.textContent = `+$${pot}`;
  potAmountDiv.className = "pot-amount-animation";
  if (winner === "player") {
    playerBank.parentElement.insertBefore(potAmountDiv, playerBank.nextSibling);
  } else if (winner === "dealer") {
    dealerBank.parentElement.insertBefore(potAmountDiv, dealerBank.nextSibling);
  }

  setTimeout(() => {
    potAmountDiv.remove();
  }, 3000);
}

// End the current round and determine the winner
function potWinnings() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);
  console.log("player score: ", playerScore);
  console.log("Dealer Score: ", dealerScore)
  if (win) {
    winCount++
  }
  if (lose) {
    lossCount++
  }
  if (draw) {
    drawCount++
  }

  if (playerScore > 21) {
    showPotAmountAboveBank("dealer");
    dealerMoney += pot;
    lose = true
    console.log("player bust")
  } else if (dealerScore > 21) {
    showPotAmountAboveBank("player");
    playerMoney += pot;
    win = true
    console.log("dealer bust")
  } else if (playerScore < dealerScore) {
    showPotAmountAboveBank("dealer");
    dealerMoney += pot;
    lose = true
    console.log("dealer wins")
  } else if (playerScore > dealerScore) {
    showPotAmountAboveBank("player");
    playerMoney += pot;
    win = true
    console.log("player wins")
   } 
  else if (playerScore === dealerScore) {
    // Draw condition, show pot amount for both
    const splitPot = pot / 2;
    playerMoney += splitPot;
    dealerMoney += splitPot;
    drawCount++;
    console.log("draw")
    // Optional: Show pot split for draw
  }

  pot = 0;

  setTimeout(() => {
    updateUI(); 
  },1000)
}

// Calculate the score of a given hand
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (card.value === "A") {
      score += 11;
      aces += 1;
    } else if (["J", "Q", "K"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

// Update the game UI
function updateUI() {
  playerCards.innerHTML = playerHand.map(createCardHTML).join("");
  if (turnCount == 1) {
    const dealerHandDisplay = dealerHand.slice(); // Copy dealer's hand
    dealerHandDisplay[0] = { ...dealerHand[0], faceDown: true }; // Set first card facedown
    
    dealerCards.innerHTML = dealerHandDisplay
    .map((card) => createCardHTML(card, card.faceDown))
    .join("");
  } else {
    dealerCards.innerHTML=dealerHand.map(createCardHTML).join("")
  }
  playerBank.textContent = `Player Bank: $${playerMoney}`;
  dealerBank.textContent = `Dealer Bank: $${dealerMoney}`;
  potEl.textContent = `Pot: $${pot}`;
  wins.innerHTML = winCount;
  losses.innerHTML = lossCount
  draws.innerHTML = drawCount
}

// Generate HTML for a card based on its suit and value
function createCardHTML(card, faceDown = false) {
  if (faceDown === true) {
    return `<div class="card back-red"></div>`;
  }
  const cardClass =
    parseInt(card.value) > 1 && parseInt(card.value) < 11
      ? `card ${card.suit} r${card.value}`
      : `card ${card.suit} ${card.value}`;
  return `<div class="${cardClass}"></div>`;
}

// Enable or disable action buttons based on game state
function disableButton(btn) {
  btn.setAttribute("disabled", "true");
  btn.setAttribute("style", "background-color: grey;");
}

function enableButton(btn) {
  btn.removeAttribute("disabled");
  btn.setAttribute("style", "background-color: aqua;");
}

function bust() {
  const div = document.createElement("div");
  div.textContent = playerMoney > 0 ? "BUST!" : "GAME OVER!";
  div.setAttribute("class", "bust");
  playerSection.append(div);
}

init();
