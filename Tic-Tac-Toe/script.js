//VARIABLES
const gameOver = document.querySelector(".gameOver-container");
const grid = document.querySelector(".grid");
const iconO = "<i class='fas fa-circle'></i>";
const iconX = "<i class='fas fa-times'></i>";
const playerOneName = document.querySelector("#player1 em");
const playerTwoName = document.querySelector("#player2 em");
const score1 = document.querySelector("#player1 b");
const score2 = document.querySelector("#player2 b");

let isX = true;
let playerOne = document.querySelector(".playerOne-input").value;
let playerTwo = document.querySelector(".playerTwo-input").value;
let playerOneScore = 0;
let playerTwoScore = 0;
let turn = document.querySelector(".turn b");

//EVENTS
document.addEventListener("DOMContentLoaded", gameStart);
document.querySelector(".playerOne-input").addEventListener("focus", nameSelectOnFocus);
document.querySelector(".playerTwo-input").addEventListener("focus", nameSelectOnFocus);
document.querySelector(".play-btn").addEventListener("click", playerNames);
document.querySelector(".nextGame-btn").addEventListener("click", nextGame);

//Clears the sessionStorage and refreshes the page
document.querySelector(".restart-btn").addEventListener("click", () => {
    sessionStorage.removeItem("players");
    sessionStorage.removeItem("scores");
    window.location.reload(true);
})

//FUNCTIONS

//To Check after every move if either player has won
function checkWin() {
    const squares = grid.children;
    const allX = [];
    const allO = [];
    let size;

    //Counts the number of X's and O's on the board
    for (let square of squares) {
        if (square.classList.contains("X")) {
            allX.push(square.classList[1]);
        } else if (square.classList.contains("O")) {
            allO.push(square.classList[1]);
        }
    }

    //Size helps determine if there is anymore space on the board
    size = allX.concat(allO).length;

    if (didWin(allX, "X", size) === 0) {
        didWin(allO, "O", size);
    }

    //Changes the icon to show whose turn it is
    turn.innerHTML = isX === true ? iconX : iconO;

}

//To Check after every move if either player has won
//Returns a boolean determining if the game is over or not
function didWin(icon, symbol, size) {

    let done = 0;

    //Conditions to check if the game is over
    if (icon.includes("1") && icon.includes("2") && icon.includes("3")) {
        done = gameOverAlert(symbol, ["1", "2", "3"]);
    } else if (icon.includes("4") && icon.includes("5") && icon.includes("6")) {
        done = gameOverAlert(symbol, ["4", "5", "6"]);
    } else if (icon.includes("7") && icon.includes("8") && icon.includes("9")) {
        done = gameOverAlert(symbol, ["7", "8", "9"]);
    } else if (icon.includes("1") && icon.includes("4") && icon.includes("7")) {
        done = gameOverAlert(symbol, ["1", "4", "7"]);
    } else if (icon.includes("2") && icon.includes("5") && icon.includes("8")) {
        done = gameOverAlert(symbol, ["2", "5", "8"]);
    } else if (icon.includes("3") && icon.includes("6") && icon.includes("9")) {
        done = gameOverAlert(symbol, ["3", "6", "9"]);
    } else if (icon.includes("1") && icon.includes("5") && icon.includes("9")) {
        done = gameOverAlert(symbol, ["1", "5", "9"]);
    } else if (icon.includes("3") && icon.includes("5") && icon.includes("7")) {
        done = gameOverAlert(symbol, ["3", "5", "7"]);
    }
    //Condition for A Draw 
    else if (size === 9) {
        done = gameOverAlert();
    }

    return done;
}

//Create the Grid of 3*3
function gameStart() {
    for (let i = 1; i < 10; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        grid.appendChild(square);
        square.classList.add(i);

        square.addEventListener("click", ticOrTac);

        //Adding borders according to the position of the square
        if (i >= 1 && i <= 3) {
            square.style.borderTop = 'none';
        } else if (i >= 7 && i <= 9) {
            square.style.borderBottom = 'none';
        }

        if (i == 1 || i == 4 || i == 7) {
            square.style.borderLeft = 'none';
        } else if (i == 3 || i == 6 || i == 9) {
            square.style.borderRight = 'none';
        }

    }

    document.querySelector(".input-container").classList.remove("hide");
    turn.innerHTML = isX === true ? iconX : iconO;

    getPlayers();
    getScore();

}

//Get the names of the player from inside the sessionStorage
function getPlayers() {
    let players;
    if (sessionStorage.getItem("players") === null) {
        players = [];
    } else {
        players = JSON.parse(sessionStorage.getItem("players"));
        playerOneName.innerHTML = players[0];
        playerTwoName.innerHTML = players[1];
        document.querySelector(".input-container").classList.add("hide");
    }
}

//Get the score of the player from inside the sessionStorage
function getScore() {
    let scores;

    if (sessionStorage.getItem("scores") === null) {
        scores = [];
    } else {
        scores = JSON.parse(sessionStorage.getItem("scores"));
        score1.innerHTML = scores[0];
        playerOneScore = scores[0];
        score2.innerHTML = scores[1];
        playerTwoScore = scores[1];
    }
}

//Shows the player who won or if it is a draw
function gameOverAlert(symbol = "D", winning) {
    console.log("gameOver");
    const winner = document.querySelector(".gameOver-container h1 em");
    const squares = grid.children;
    let scores;
    let done = 0;

    if (symbol !== "D") {
        if (symbol === "X") {
            winner.innerText = playerOne;
            playerOneScore++;
            isX = true;
            done = 1;
        } else if (symbol === "O") {
            winner.innerText = playerTwo;
            playerTwoScore++;
            isX = false;
            done = 1;
        }

        document.querySelector(".gameOver-container h1 span").innerText = " WON THE GAME";

        //Shows the winning move in green
        for (let square of squares) {
            if (square.classList.contains(winning[0]) || square.classList.contains(winning[1]) || square.classList.contains(winning[2])) {
                square.style.color = "green";
            }
        }

    } else {
        document.querySelector(".gameOver-container h1 span").innerText = "DRAW";
        done = 2;
    }

    //Makes furthur changes to the grid impossible
    //until a new game is started
    grid.style.pointerEvents = "none";
    grid.style.opacity = "0.5";

    score1.innerText = playerOneScore;
    score2.innerText = playerTwoScore;
    gameOver.classList.remove("hide");

    if (sessionStorage.getItem("scores") === null) {
        scores = [0, 0];
    } else {
        scores = JSON.parse(sessionStorage.getItem("scores"));
    }

    scores[0] = playerOneScore;
    scores[1] = playerTwoScore;

    sessionStorage.setItem("scores", JSON.stringify(scores));
    return done;
}

//Focuses on the name in the input box
function nameSelectOnFocus(e) {
    e.target.select();
}

//Displaying the player's name according to the input
function playerNames() {
    let players;
    let player1 = document.querySelector(".playerOne-input").value;
    let player2 = document.querySelector(".playerTwo-input").value;

    playerOneName.innerHTML = player1 !== "" ? player1 : "Player 1";
    playerTwoName.innerHTML = player2 !== "" ? player2 : "Player 2";

    if (sessionStorage.getItem("players") === null) {
        players = [];
    } else {
        players = JSON.parse(sessionStorage.getItem("players"));
    }

    playerOne = playerOneName.innerHTML;
    playerTwo = playerTwoName.innerHTML;

    players.push(playerOne);
    players.push(playerTwo);

    sessionStorage.setItem("players", JSON.stringify(players));
    document.querySelector(".input-container").classList.add("hide");
}

//Makes everyting ready for the next round
function nextGame() {
    const squares = grid.children;

    for (let square of squares) {
        square.style.color = "#000";
        square.innerHTML = "";
        if (square.classList.contains("X")) {
            square.classList.remove("X");
        } else if (square.classList.contains("O")) {
            square.classList.remove("O");
        }
    }

    grid.style.pointerEvents = "all";
    grid.style.opacity = "1";

    gameOver.classList.add("hide");
}

function ticOrTac(event) {

    if (event.target.innerHTML === "" && isX === true) {
        event.target.innerHTML = iconX;
        event.target.classList.add("X");
        isX = false;
    } else if (event.target.innerHTML === "" && isX === false) {
        event.target.innerHTML = iconO;
        event.target.classList.add("O");
        isX = true;
    }

    checkWin();
}