/* Uppgift U3 */


// variabler
let startBtn;
let newBricksBtn;
let newBricks;
let board;
let numbers;
let bricksLeft;
let refilsLeft;

let message;
let total = 0;
let totalPointsBox;
let totalRoundsBox;

let interval;
let timer;

let ghostImg;


let bricks=[]

// Initiera globala variabler och händelsehanterare och addar event liseners. hämtar data från local starage
function init() {

   

    total = JSON.parse(localStorage.getItem("data"))
    if (total == null) {
        total = {points:0, rounds:0};
    } 
    console.log(total);
    

    

    
    startBtn = document.getElementById("newGameBtn");
    newBricksBtn = document.getElementById("newTilesBtn");
    newBricks = document.getElementById("newTiles");

    board = document.getElementById("board");

    message = document.getElementById("message");
    totalPointsBox = document.getElementById("totPoints");
    totalRoundsBox = document.getElementById("countGames");

    ghostImg = document.getElementById("ghost");

    startBtn.addEventListener("click", startGame);
    newBricksBtn.addEventListener("click", newBrick);


    newBricksBtn.disabled = true;


    totalPointsBox.innerText = total.points;
    totalRoundsBox.innerText = total.rounds;

} 
window.addEventListener("load", init);

//nollställer föregående spel och startar ett spel 
function startGame() {
    startBtn.disabled = true;
    bricksLeft = newBricks.children.length;
    

    numbers = [...Array(40).keys()].map( i => i += 1)
    numbers.sort(() => Math.random() - 0.5);
    console.log(numbers)

    for (let i = 0; i < board.children.length; i++) {
        if (!board.children[i].className.includes("mark")) {
            board.children[i].classList.remove("ghostTile");
            board.children[i].innerText = "";
        } else {
            board.children[i].classList.remove("check");
            board.children[i].classList.remove("cross");
        }
    }

    newBrick()

    interval = setInterval(ghost, (Math.random() * 15 + 15) * 1000);
}

//skapar en ny bricka
function newBrick() {
    newBricksBtn.disabled = true;
    
    for (let i = 0; i < newBricks.children.length; i++) {
            var brick = newBricks.children[i];
            brick.innerText = numbers.pop();
            brick.draggable = true;
            brick.addEventListener("dragstart", dragStart);
    }
}



// innehåller drag funtionalitet
function dragStart(e) {
    console.log(this)

    let dragElem = this


    dragElem.addEventListener("dragend", dragEnd);
    for (let i = 0; i < board.children.length; i++) {
        if (!board.children[i].className.includes("mark")) {
            board.children[i].addEventListener("dragover", dropZone);
            board.children[i].addEventListener("dragenter", dropZone);
            board.children[i].addEventListener("dragleave", dropZone);
            board.children[i].addEventListener("drop", dropZone);
        }


    }
    //styr vad som händer när man släpper en bricka
    function dragEnd(e) {
        dragElem.removeEventListener("dragend", dragEnd);
        for (let i = 0; i < board.children.length; i++) {
            if (!board.children[i].className.includes("mark")) {
                board.children[i].removeEventListener("dragover", dropZone);
                board.children[i].removeEventListener("dragenter", dropZone);
                board.children[i].removeEventListener("dragleave", dropZone);
                board.children[i].removeEventListener("drop", dropZone);
            }
        }
    } 
    //funtionaliteten för om en bricka släps över en dropzone på brädet
    function dropZone(e) {
        e.preventDefault(); 
        let dropElem = this;
        if (dropElem.innerText == "") {
            switch (e.type) {
                case "dragenter": 
                    dropElem.style.backgroundColor = "#6C9";
                    break;
                case "dragleave": 
                    dropElem.style.backgroundColor = "";
                    break;
                case "drop": 
                    dropElem.style.backgroundColor = "";
                    dropElem.innerText = dragElem.innerText;
                    dragElem.innerText = "";
                    dragElem.draggable = false;
                    bricksLeft--;
                    console.log(bricksLeft)


                    var fullSquares = 0;
                    for (let i = 0; i < board.children.length; i++) {
                        if (!board.children[i].className.includes("mark") && board.children[i].innerText != "") {
                            fullSquares++;
                        }
                    }


                    console.log(fullSquares);

                    if (fullSquares >= 16) {
                        console.log("its 0")
                        endGame()




                    } else if (bricksLeft == 0) {
                        newBricksBtn.disabled = false;
                        bricksLeft = 4;
                    }

            } 
        }
    } 
}







//avslutar spelet
function endGame() {
    console.log("end")

    clearInterval(interval);
    clearTimeout(timer);

    startBtn.disabled = false;

    score()

}



//räknar ut poängen
function score() {
    var points = 0;
    console.log("score")
    var squares = board.children;
    for (let i = 0; i < 20; i += 5) {
        var lstOld = [squares[i].innerText, squares[i + 1].innerText, squares[i + 2].innerText, squares[i + 3].innerText]
        var lstNew = [squares[i].innerText, squares[i + 1].innerText, squares[i + 2].innerText, squares[i + 3].innerText]
        lstNew.sort((a, b) => a - b);
        if (JSON.stringify(lstOld) == JSON.stringify(lstNew)) {
            squares[i + 4].classList.add("check")
            points++
        } else {
            squares[i + 4].classList.add("cross")
        }
    }
    for (let i = 0; i < 4; i += 1) {
        var lstOld = [squares[i].innerText, squares[i + 5].innerText, squares[i + 10].innerText, squares[i + 15].innerText]
        var lstNew = [squares[i].innerText, squares[i + 5].innerText, squares[i + 10].innerText, squares[i + 15].innerText]
        lstNew.sort((a, b) => a - b);
        if (JSON.stringify(lstOld) == JSON.stringify(lstNew)) {
            squares[i + 20].classList.add("check")
            points++
        } else {
            squares[i + 20].classList.add("cross")
        }
    }
    message.innerText = "Du fick " + points + " poäng"


    total.points += points;
    total.rounds++;

    
    totalPointsBox.innerText = total.points;
    totalRoundsBox.innerText = total.rounds;

    localStorage.setItem("data", JSON.stringify(total))
}

//styr alla spökerna 
function ghost() {

    ghostImg.style.visibility="visible";

    var squares = [];
    for (let i = 0; i < board.children.length; i++) {
        if (!board.children[i].className.includes("mark") && board.children[i].innerText != "") {
            squares.push(i);
        }
    }



    console.log(squares);

    squares.sort(() => Math.random() - 0.5);
    console.log(squares);
    var iter;

    if (squares.length >= 4) {
        iter = 4
    } else {
        iter = squares.length;
    }
    var ghostTiles = [];

    for (let i = 0; i < iter; i++) {
        ghostTiles.push(squares.pop());
        console.log(ghostTiles)
        board.children[ghostTiles[i]].classList.add("ghostTile");
        
    }
    console.log(ghostTiles);
    
    timer = setTimeout(removeGhost, 2000, ghostTiles);

}

//tar bort spöken när de har gjort sin upgift
function removeGhost(ghostTiles) {
    console.log("here")
    for (let i = 0; i < ghostTiles.length; i++) {

        numbers.push(parseInt(board.children[ghostTiles[i]].innerText));

        board.children[ghostTiles[i]].classList.remove("ghostTile");
        board.children[ghostTiles[i]].innerText = "";
    }
    numbers.sort(() => Math.random() - 0.5);
    ghostImg.style.visibility="hidden";
}