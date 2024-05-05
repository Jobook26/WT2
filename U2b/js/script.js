/* Uppgift U2b */

// Globala konstanter och variabler
let carMenu;			    // select-element för menyn för att välja bil
let startBtn;			    // button-element för startknappen
let stopBtn;			    // button-element för stoppknappen
let boardElem;			    // div-element för "spelplanen"

// ----- Bilen -----
const carImgs = ["ferrari.png", "jeep.png", "vw.png"]; // Filnamn för bilderna på bilarna
let carElem;			    // img-element för bilen
let carDir = 0;             // Bilens riktning (0, 1, 2, 3 = höger, nedåt, vänster, uppåt)
let carRot = 0;			    // Rotation av bil(d)en
const xStep = 5;		    // Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		    // eller y-led i varje steg
let carTimer = null;	    // Timern för bilens förflyttning
const carInterval = 15;	    // Tid i ms mellan varje steg i förflyttningen

// ----- Vildsvinet -----
let pigElem;				// img-element för vildsvinet
let pigCounter;			    // Räknare för antal vildsvin
let pigCounterElem;			// Element för utskrift av pigCounter
let pigTimer = null;		// Timern för vildsvinet
const pigDuration = 2000;   // Tid till nytt vildsvin, 2 sek.

// ----- Krockräknare -----
let hitCounter;				// Räknare för antal träffar
let hitCounterElem;			// Element för utskrift av hitCounter
let catchedPig = true;		// Flagga (true/false) för att markera om vildsvinet är träffat eller ej

// ----- Ljudeffekter -----
const punchSound = new Audio("sound/punch.mp3");  // Audio-objekt för krock med vildsvinet
const laughSound = new Audio("sound/laugh.mp3");  // Audio-objekt med skratt
punchSound.preload = "auto";    // Ladda in ljudfilerna till webbläsarens cache
laughSound.preload = "auto";

// --------------------------------------------------
// Denna kod ligger inte i någon funktion, så den utförs, så fort js-filen läses in.
// Koden ligger dock inom klamrar, eftersom de variabler som används inte behöver vara globala.
// Bilderna laddas in i förväg, så att alla bilder finns i webbläsarens cache, när de behövs.
{
    for (let i = 0; i < carImgs.length; i++) {
        let img = new Image();
        img.src = "img/" + carImgs[i];
    }
    let img = new Image();
    img.src = "img/smack.png";
}
// --------------------------------------------------
// Initiera globala variabler och händelsehanterare
function init() {
    // Referenser till element i gränssnittet
    carMenu = document.querySelector("#carMenu");
    startBtn = document.querySelector("#startBtn");
    stopBtn = document.querySelector("#stopBtn");
    boardElem = document.querySelector("#board");
    carElem = document.querySelector("#car");

    pigElem = document.querySelector("#pig");
    pigCounterElem = document.querySelector("#pigCounter");
    hitCounterElem = document.querySelector("#hitCounter");
    // Händelsehanterare för meny och knappar
    carMenu.addEventListener("change", chooseCar);
    startBtn.addEventListener("click", startGame);
    stopBtn.addEventListener("click", stopGame);
    // Händelsehanterare för tangenter för att styra bilen
    document.addEventListener("keydown", checkKey);
    // Aktivera/inaktivera meny och knappar
    carMenu.disabled = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;

    /* === Tillägg i uppgiften === */
    

} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Val av bil genom menyn
function chooseCar() {
    carElem.src = "img/" + carImgs[this.selectedIndex - 1];
    this.selectedIndex = 0;
} // Slut chooseCar
// --------------------------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
    carMenu.disabled = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    document.activeElement.blur(); // Knapparna sätts ur focus, så att webbsidan kommer i fokus igen
    // Detta behövs för att man ska kunna känna av händelsen keydown i Firefox efter att man klickat på en knapp.

    // Sätt bilen i startläge
    carElem.style.left = "10px";
    carElem.style.top = "40px";
    carDir = 0; // Riktning höger
    carRot = 0; // Ingen rotation
    carElem.style.transform = "rotate(0deg)";
    moveCar(); // Starta bilen

    /* === Tillägg i uppgiften === */
    pigCounter = 0;
    hitCounter = 0;
    pigTimer = setTimeout(() => newPig(), pigDuration);
    
} // Slut startGame
// --------------------------------------------------
// Stoppa spelet
function stopGame() {
    if (carTimer != null) clearTimeout(carTimer);
    carMenu.disabled = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;

    /* === Tillägg i uppgiften === */
    if (pigTimer != null) {
        clearTimeout(pigTimer);
    }
    pigElem.style.visibility = "hidden";
    
} // Slut stopGame
// --------------------------------------------------
// Kontrollera tangenter och styr bilen. Anropas vid keydown.
function checkKey(e) {
    switch (e.key) {
        case "ArrowLeft":
        case "z":
            carDir--;
            if (carDir < 0) carDir = 3;
            carRot -= 90;
            carElem.style.transform = "rotate(" + carRot + "deg)";
            break;
        case "ArrowRight":
        case "-":
            carDir++;
            if (carDir > 3) carDir = 0;
            carRot += 90;
            carElem.style.transform = "rotate(" + carRot + "deg)";
            break;
    }
} // Slut checkKey
// --------------------------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
    let b = boardElem.getBoundingClientRect();  // Gränsvärden för spelplanen
    let c = carElem.getBoundingClientRect();    // Gränsvärden för bilen
    let x = parseInt(carElem.style.left);       // x-koordinat (left) för bilen
    let y = parseInt(carElem.style.top);        // y-koordinat (top) för bilen
    switch (carDir) {
        case 0: // Höger
            if (c.right + xStep <= b.right) x += xStep;
            break;
        case 1: // Nedåt
            if (c.bottom + yStep <= b.bottom) y += yStep;
            break;
        case 2: // Vänster
            if (c.left - xStep >= b.left) x -= xStep;
            break;
        case 3: // Uppåt
            if (c.top - yStep >= b.top) y -= yStep;
            break;
    }
    carElem.style.left = x + "px";
    carElem.style.top = y + "px";
    carTimer = setTimeout(moveCar, carInterval);

    /* === Tillägg i uppgiften === */
    
    
} // Slut moveCar
// --------------------------------------------------

/* ===== Tillägg av nya funktioner i uppgiften ===== */

function newPig() {
    if (pigCounter < 10) {

        pigElem.style.left = (Math.floor(Math.random() * (boardElem.offsetWidth - pigElem.offsetWidth - 40)) + 20) + "px";

        pigElem.style.top = (Math.floor(Math.random() * (boardElem.offsetHeight - pigElem.offsetHeight - 40)) + 20) + "px";

        pigElem.style.visibility = "visible";

        pigCounter += 1;
        pigCounterElem.innerText = pigCounter;

        pigTimer = setTimeout(() => newPig(), pigDuration);


    } else {
        stopGame();
    }
    
}

// Kontrollera om två element överlappar varandra
// Det är alltid elementens rektanglar som kontrolleras, även om de har annan stil, t.ex. rundade hörn
function elementsOverlap(elem1, elem2) {
    let r1 = elem1.getBoundingClientRect();
    let r2 = elem2.getBoundingClientRect();
    if (r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom) {
        return false;
    }
    else {
        return true;
    }
} // Slut elementsOverlap
// --------------------------------------------------