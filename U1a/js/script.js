/* Uppgift U1 */

// Globala variabler
let optionsDialog;	    // Element för inställningsdialog
let rollElem;           // Element för utskrift av antal omkast som återstår
let resElem;	        // Element för resultat
let stopBtn;            // Knapp för att stanna
let playerName = "Du";  // Spelarens namn
let maxNrOfRolls = 3;   // Valt max antal omkast av tärningar
let nrOfRolls = 0;      // Antal omkast som återstår
let sum = 0;            // Summan av kastade tärningar

// --------------------------------------------------
// Ta fram referenser till element i gränssnittet och lägg till händelselyssnare.
function init() {
    optionsDialog = document.getElementById("options");
    rollElem = document.getElementById("rollCounter");
    resElem = document.getElementById("result");
    stopBtn = document.getElementById("stopBtn");

    document.getElementById("optionsBtn").addEventListener("click", showOptionsDialog);
    document.getElementById("optionsOkBtn").addEventListener("click", closeOptionsDialog);
    document.getElementById("newBtn").addEventListener("click", newGame);
    document.getElementById("stopBtn").addEventListener("click", endGame);

    stopBtn.disabled = true;

    document.getElementById("die1").addEventListener("click", throwOneDie);
    document.getElementById("die2").addEventListener("click", throwOneDie);
    document.getElementById("die3").addEventListener("click", throwOneDie);
    document.getElementById("die4").addEventListener("click", throwOneDie);
    document.getElementById("die5").addEventListener("click", throwOneDie);

} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------

function showOptionsDialog() {//öppna dialogen
    optionsDialog.open = true;
}

function closeOptionsDialog() {//sparar och stänger dialågen
    playerName = document.getElementById("player").value;
    maxNrOfRolls = document.getElementById("nrOfReroll").value;
    optionsDialog.open = false;
}

function newGame() {//startar ett nytt spel
    for (let i = 1; i <= 5; i++) {
        throwDie(document.getElementById("die" + i));
    }
    nrOfRolls = maxNrOfRolls;
    rollElem.innerText = nrOfRolls;
    stopBtn.disabled = false;
}

function endGame() {//avslutar spelet
    stopBtn.disabled = true;
    nrOfRolls = 0;
    rollElem.innerText = nrOfRolls;
    var text = playerName + ", summan blev " + sum + ", så du fick ";
    sum -= 18;
    if (sum < 0 || sum > 3) {
        text += "0 poäng";
    } else {
        text += sum + " poäng";
    }
    resElem.innerText = text;
}

function throwOneDie(die) {//kastar tärnmingen som trycktes på
    if (nrOfRolls > 0) {
        throwDie(die.target)
        nrOfRolls -= 1;
        rollElem.innerText = nrOfRolls;
        if (nrOfRolls == 0) {
            endGame();
        }
    }
    return null;

}

function throwDie(die) {//logik för att karsta tärningar
    var res = Math.floor(Math.random() * 6) + 1;
    die.src = "img/dice/" + res + ".png";
    die.value = res;
    score();
}

function score() {//räknar ut poäng
    sum = 0;
    for (let i = 1; i <= 5; i++) {
        sum += parseInt(document.getElementById("die" + i).src.split("/").pop().replace(/\D/g, ""));
    }
    resElem.innerText = "Summa = " + sum;
}