/* Uppgift U1b */

// Globala konstanter och variabler
const wordList = ["BLOMMA", "LASTBIL", "SOPTUNNA", "KÖKSBORD", "RADIOAPPARAT", "VINTER", "SOMMAR", "DATORMUS", "LEJON", "ELEFANT", "JULTOMTE", "SKOGSHYDDA", "BILNUMMER", "BLYERTSPENNA", "SUDDGUMMI", "KLÄDSKÅP", "VEDSPIS", "LJUSSTAKE", "SKRIVBORD", "ELDGAFFEL", "STEKPANNA", "KASTRULL", "KAFFEBRYGGARE", "TALLRIK", "SOFFBORD", "TRASMATTA", "FLYGPLAN", "FLYGPLATS", "TANGENTBORD", "DATORSPEL", "WEBBPLATS", "TELEFON", "STJÄRNA", "KANELBULLE", "SEMLA", "ÄPPELPAJ", "BLÅBÄR", "LINGONSYLT", "TRAKTOR", "CYKELKEDJA", "BOKHYLLA", "BOKSTAV", "GRILLPLATS", "SOLSTOL", "BADPLATS", "SNÖGUBBE", "PARAPLY"]; // Lista (array) med ord som ska väljas slumpmässigt
let randomWord;	        // Textsträng med det ord som slumpmässigt väljs ur wordList
let boxElems;	        // Array med span-element för bokstäverna i ordet
let startBtn;	        // button-element för startknappen
let letterButtons;	    // Array med button-element för bokstavsknapparna
let hangmanImg;		    // img-elementet för bilder på galgen och gubben
let hangmanNr;		    // Nummer för aktuell bild som visas (0-6)
let msgElem			    // div-element för meddelanden
let startTime;		    // Tid då spelet startas
// --------------------------------------------------
// Initiering då webbsidan laddats in
function init() {
    startBtn = document.querySelector("#startBtn");
    letterButtons = document.querySelectorAll("#letterButtons button");
    hangmanImg = document.querySelector("#hangman");
    msgElem = document.querySelector("#message");
    

    startBtn.addEventListener("click", startGame)

    letterButtons.forEach((letter) => {
        letter.addEventListener("click", guessLetter);
        letter.disabled = true;
    });

    
} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Initiera ett nytt spel. Visa första bilden (h0.png),
// sätt bildnummer till 0, inaktivera startknapp och aktivera bokstavsknappar.
function startGame() {
    startTime = new Date().getTime();
    console.log(new Date().getTime())
    document.querySelector("#message").innerText = "";
    hangmanImg.src = "img/h0.png";
    startBtn.disabled = true;
    letterButtons.forEach((letter) => letter.disabled = false);
    selectRandomWord();
} // Slut startGame
// --------------------------------------------------
// Ett ord väljs slumpmässigt. Visa en ruta för varje bokstav i ordet
function selectRandomWord() {
    var word = ""
    while (word == "" || word == randomWord) {
        word = wordList[Math.floor(Math.random() * wordList.length)]
    }
    randomWord = word;

    console.log(randomWord)
    
    var text = ""
    //boxElems.append(letter)
    
    randomWord.split("").forEach((letter) => {
        text += "<span data-letter = " + letter + "></span>";
    });
    //console.log(boxElems);

    letterCon = document.querySelector("#letterBoxes");

    letterCon.innerHTML = text;

    

    letterBoxes = letterCon.querySelectorAll("span");
    console.log(letterBoxes)
} // selectRandomWord
// --------------------------------------------------
// Kontrollera om bokstaven finns i ordet och skriv i så fall ut den.
// Om bokstaven ej finns, uppdateras bilden med galgen och gubben
// Om alla bokstäver är gissade eller om den sista bilden visades, avslutas spelet
function guessLetter(data) {
    console.log(data)
    data.target.disabled = true;

    var correct = false;

    letterBoxes.forEach(span => {
        if (data.target.innerText == span.getAttribute("data-letter")) {
            span.innerText = span.getAttribute("data-letter");
            span.className = "correctLetter";
            correct = true;
        }
    });
    if (correct) {
        var win = true;
        letterBoxes.forEach(span => {
            if (span.innerText == "") {
                win = false;
            }
        });
        if (win) {
            console.log("win")
            endGame(false);
        }
    } else {
        var current = parseInt(hangmanImg.src.split("/").pop().replace(/\D/g, "")) + 1;
        if (current >= 6) {
            console.log("lose")
            
            endGame(true);
        } 
        if (current <= 6) {
            hangmanImg.src = "img/h" + current + ".png";
        }
        
        
    }

} // Slut guessLetter
// --------------------------------------------------
// Avsluta spelet genom att skriva ut ett meddelande och
// sedan aktivera startknappen och inaktivera bokstavsknapparna
function endGame(manHanged) { // manHanged är true eller false
    console.log(parseInt((new Date().getTime() - startTime) / 1000))
    startBtn.disabled = false;
    letterButtons.forEach((letter) => letter.disabled = true);
    var message = document.querySelector("#message")
    if (manHanged) {
        message.innerText = "Tyvär, gubben hängdes. Rätt svar är " + randomWord + "\nDet tog " + ((new Date().getTime() - startTime) / 1000).toFixed(1) + " sekunder.";
    } else {
        message.innerText = "Gratulerar. Du har kommit fram till rätt ord." + "\nDet tog " + ((new Date().getTime() - startTime) / 1000).toFixed(1) + " sekunder.";
    }
    
} // Slut endGame
// --------------------------------------------------
