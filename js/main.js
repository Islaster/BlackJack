"use strict";
//constants
const headEl = document.querySelector("header");
const cTotalEl = document.querySelector(".computer");
const pTotalEl = document.querySelector(".player");
const hitEl = document.querySelector(".hit");
const standEl = document.querySelector(".stand");
const betEl = document.querySelector(".bet");
const input = document.querySelector("input");
//app state (variables)
let pBank, cBank, pot, pTotal, cTotal, turn, Cbet;
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
  render();
}

function addCards(evt) {
  //add card to hand if opponent doesnt already have it in his hand
}
function endRound(evt) {
  //change players
  if (turn === turns[0]) {
    turn = turns[1];
  } else {
    turn = turns[0];
  }
}
function addToPot(evt) {
  //add what you bet to pot
  pot = pot + parseInt(input.value);
  pBank -= input.value;
  //opponent must match bet at least the same amount as you
  if (turn === "c") {
    if (cBank >= parseInt(input.value)) {
      let count = parseInt(input.value) * 2;
      if (count < cBank) {
        pot += Math.random(Math.floor() * count);
      }
    } else {
      pot += cBank;
    }
  }
}

function render() {
  money.potEl.innerText = pot;
  money.pBank.innerHTML = pBank;
  money.cBank.innerHTML = cBank;
}

function loseWin() {}
