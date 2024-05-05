/* Uppgift U2a */

// Globala konstanter och variabler
const roomPrice = [600, 800, 950];		// Pris för rumstyperna
const facilityPrice = [40, 80, 100];    // Pris för tilläggen
let formElem;   // Elementet med hela formuläret (form-elementet)
// --------------------------------------------------
// Initiera globala variabler och händelsehanterare. Lägg till info om pris.
function init() {
	formElem = document.querySelector("#booking");
	for (let i = 0; i < formElem.roomType.length; i++) { /* Gå igenom alla radioknappar för rumstyp */
        let priceInfo =  "(" + roomPrice[i] + " kr)";
        // Referera till övre element (label) och inom det, elementet med class ".price"
        formElem.roomType[i].parentElement.querySelector(".price").innerText = priceInfo; // Lägg till prisuppgift
        // Händelsehanterare för radioknapparna
		
	}
	for (let i = 0; i < formElem.facility.length; i++) { /* Gå igenom alla kryssrutor för tillägg */
        let priceInfo = "(" + facilityPrice[i] + " kr)";
        // Referera till övre element (label) och inom det, elementet med class ".price"
        formElem.facility[i].parentElement.querySelector(".price").innerText = priceInfo; // Lägg till prisuppgift
        // Händelsehanterare för kryssrutorna
		
	}
	formElem.nrOfNights.addEventListener("change", calculateCost);
	formElem.roomType.forEach(type => {
		type.addEventListener("change", calculateCost);
		type.addEventListener("change", checkIfFamilyRoom);
	});
	formElem.facility.forEach(faci => {
		faci.addEventListener("change", calculateCost);
	});
	formElem.zipcode.addEventListener("blur", checkField);
    formElem.telephone.addEventListener("blur", checkField);

	formElem.campaigncode.addEventListener("focusin", checkCampaign);
	formElem.campaigncode.addEventListener("input", checkCampaign);
	formElem.campaigncode.addEventListener("focusout", endCheckCampaign);
	checkIfFamilyRoom();
	calculateCost();
	// Händelsehanterare för textfält som ska kontrolleras
	
	// Händelsehanterare för kampanjkod
	
} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Beräkna total kostnad för valda alternativ
function calculateCost() {
	var cost = 0;

	var i = 0;
	formElem.roomType.forEach(type => {
		if (type.checked) {
			cost += roomPrice[i];
		}
		i += 1;
	});
	i = 0;
	formElem.facility.forEach(faci => {
		if (faci.checked) {
			cost += facilityPrice[i];
		}
		i += 1;
	});

	document.querySelector("#totalCost").innerText = cost * formElem.nrOfNights.value;
} // Slut calculateCost
// --------------------------------------------------
// Kontrollera om familjerum är valt och ändra tillgänglighet till andra val
function checkIfFamilyRoom() {
	formElem.persons.disabled = !formElem.roomType[2].checked
} // Slut checkIfFamilyRoom
// --------------------------------------------------
// Kontrollera innehållet i de fält som namnges i fieldNames
// Exakt kopia av funktionen i exempel 4-2
function checkField(e, field) {
    if (!field) {
        field = this;
    }
    const fieldNames = ["zipcode", "telephone"];
    const re = [ // Array med reguljära uttryck för fälten
        /^\d{3} ?\d{2}$/,			// Postnummer
        /^0\d{1,3}[-/ ]?\d{5,8}$/	// Telefonnummer
    ];
    const errMsg = [ // Array med felmeddelanden
        "Postnumret måste bestå av fem siffror.",
        "Telnr måste börja med en 0:a och följas av 6-11 siffror."
    ];
    let ix = fieldNames.indexOf(field.name);    // Index till re och errMsg
    let errMsgElem = field.nextElementSibling;  // Element för felmeddelande
    if (!re[ix].test(field.value)) {
        errMsgElem.innerText = errMsg[ix];
        return false; // Fel i fältet
    }
    else {
        errMsgElem.innerText = "";
        return true; // Fältet är OK
    }
} // Slut checkField
// --------------------------------------------------
// Kontrollera kampanjkoden för varje tecken som skrivs i fältet
function checkCampaign() {
	var correct = true;
	var roles = ["l", "l", "l", "-", "n", "n", "-", "l", "n"];
	if (formElem.campaigncode.value.length == roles.length) {
		i = 0
		formElem.campaigncode.value.split("").forEach((letter) => {
			if (roles[i] == "l") {
				if (!/^[a-zA-Z]+$/.test(letter)) {
					correct = false;
				}
			} else if (roles[i] == "n") {
				if (isNaN(letter)) {
					correct = false;
				}
			} else if (roles[i] == "-") {
				if (letter != "-") {
					correct = false;
				}
			}
			i += 1;
   		});
	}
	else{
		correct = false;
	}
	console.log(correct);
	if (correct) {
		formElem.campaigncode.style.backgroundColor = "#6F9";
	} else {
		formElem.campaigncode.style.backgroundColor = "#F99";
	}


} // Slut checkCampaign
// --------------------------------------------------
// Avsluta kontroll av kampanjkod
function endCheckCampaign() {
	formElem.campaigncode.style.backgroundColor = "";
	formElem.campaigncode.value = formElem.campaigncode.value.toUpperCase();
} // Slut endCheckCampaign
// --------------------------------------------------
