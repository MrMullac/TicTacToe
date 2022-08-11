/*************************************************************/
// app.js
//
// Noughts and Crosses
// Written by Callum Watson 2022
/**************************************************************/
console.log("Loaded Noughts and Crosses app.js")

// Players
playerArray = [] // Creating a Array for the players details.
playerArray[0] = { // First Player
  name: "Player One", // Player One's name
  //wins: 0,
  //draws: 0,
  symbol: 'X', // Player ones symbol.
}
playerArray[1] = { // Second Player
  name: "Player Two", // Player Two's name
  //wins: 0,
  //draws: 0,
  symbol: 'O', // Player twos symbol.
}

// Variables
var playerNum = 0 //Math.floor(Math.random() * 2); // This is for the math that changes turns. Using random math to randomize who starts.
// var currentPlayer = 'X'; // Choosing the current player.
var isGameActive = true; // This will need to be changed to false when implementing database.
var gameBoard = ["", "", "", "", "", "", "", "", ""]; // This is the gameboard variable. Essientally its whats in the 9 boxes.
var userWins = 0; // The users wins.
var userLoses = 0
var p2Wins = 0;
var p2Loses = 0;


// Tables
const winCombos = [ // Choosing the combinations that players can win from.
  [0, 1, 2], // Top 3 Tiles
  [3, 4, 5], // Second Row tiles
  [6, 7, 8], // Third Row Tiles
  [0, 3, 6], // Left Lane Tiles
  [1, 4, 7], // Middle lane tiles
  [2, 5, 8], // Right Lane tiles
  [0, 4, 8], // Diagonal top left to bottom right
  [2, 4, 6], // Diagonal Top right to bottom left
];

const tiles = document.querySelectorAll('.tile'); // Storing all the tiles in a variable that are found on the html.

/*************************************************************
// resultValidation();
// This handles the the results, to determine if a user has won/draw/loss.
*************************************************************/
function resultValidation() {
  let roundWon = false;

  for (let i = 0; i <= 7; i++) {
    const winCombinations = winCombos[i];
    let a = gameBoard[winCombinations[0]];
    let b = gameBoard[winCombinations[1]];
    let c = gameBoard[winCombinations[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true; // Setting the local variable to true.
      break
    }
    if (roundWon) { // If the game is won.
      console.log("Game Won") // Logging this for debug, It will be displayed on the gui.
      isGameActive = false; // Setting game to not be active

      return;
    }
    let roundDraw = !gameBoard.includes("");
    if (roundDraw) { // If the game is a draw
      console.log("Game Draw") // Just logging this for now debug, It will be displayed on the gui.
      isGameActive = false; // Change the game to not be active
      return;
    }

  }

  for (let i = 0; i < 2; i++){
    console.log("Current Player is" + i)
    if (roundWon == true) {
      console.log("Game was won need to restart.")
      roundWinner = i;
      playerHasWon(roundWinner);
      isGameActive = false;
      break;
    }

    if(roundWon == false){
      continue;
    }
  }

  changeTurn(); // Running the change turn function.
};

function playerHasWon(roundWinner) {
  if (roundWinner == playerNum) {
    tttScores.ttt_wins++
    p2Loses++
  } else {
    p2Wins++
    tttScores.ttt_loses++
  }

  if (playerNum == 0) {
    fb_updateRec(TTTSCORES, activeUid, tttScores)
  } else {
    fb_updateRec(TTTSCORES, userDetails.uid, tttScores)
  }
}

/*************************************************************
// validClick();
// This is checking if the tiles have a symbol or not.
*************************************************************/
function validClick(tile) {
  if (tile.innerText === 'O' || tile.innerText === 'X') { // Checking if a user has already taken the spot.
    console.log("Not a Valid Spot") // Just debugging.
    return false;
  }
  console.log("Valid Spot") // Debugging.
  return true;
}

/*************************************************************
// clickHandler();
// This is the function that is ran when someone clicks a tile.
*************************************************************/

function clickHandler(tile, index) {
  if (validClick(tile) && isGameActive == true) { // Checking if valid tile and if the game is still active.
    tile.innerText = playerArray[playerNum].symbol // Setting the tiles inner text to the players Symbol.
    updateBoard(index); // This is updating the gameBoard table.
    resultValidation(); // This is running the function to check that the game hasn't finished yet

    var turnsObject = {};
    if (playerNum == 0) {
      turnsObject.movesP1 = index;
    } else {
      turnsObject.movesP2 = index;
    }
    isGameActive = false
    fb_updateRec(ACTIVE, activeUid, turnsObject);
  }
}

/*************************************************************
// updateBoard();
// This will update the board when user places a X/O.
*************************************************************/
function updateBoard(index) {
  gameBoard[index] = playerArray[playerNum].symbol; // Updating the game board with the symbol.
}

/*************************************************************
// changeTurn();
  // This handles the users turns.
*************************************************************/
function changeTurn() {
  //if(currentPlayer == 'X'){ // If the current player is set to X
  //  currentPlayer = 'O'; // Change current player to O
  //  console.log("Current player has been switched to O");
  //} else if(currentPlayer == 'O'){ // If current player is set to O
  //  currentPlayer = 'X'; // Change current player to X
  //  console.log("Current player has been switched to X");
  //}; // Dunno if this is the best way to handle this, Might be a faster way then If statements.

  // currentPlayer = currentPlayer == 'X'? 'X': 'O'; // Trying Ternary Operators instead of If statements.
  // console.log("Changed turns! It is now " + currentPlayer)

  //playerNum = 1 - playerNum // Math that switches the players
};


/*************************************************************
// THIS IS IMPORTANT TO MAKE THE GAME WORK
// This will listen for clicks on the tiles.
*************************************************************/
tiles.forEach((tile, index) => { // Getting all the tiles.
  tile.addEventListener('click', () => clickHandler(tile, index)); // Adding a event listner for each tile, also running the clickHandler function. 
});

function readTurnP2(data) {
  console.log("Other player has clicked a spot " + data)
  document.getElementById(data).textContent = playerArray[1 - playerNum].symbol
  gameBoard[data] = playerArray[1 - playerNum].symbol
  console.log(gameBoard)
  isGameActive = true
  resultValidation();
}

/*************************************************************
// resetGame();
// This is to reset the game and remove all the old turns.
*************************************************************/
function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""]; // Reseting the gameboard
  document.querySelectorAll('.tile').forEach(tile => tile.innerHTML = ""); // Removing all X and Os in html.
  isGameActive = true; // Setting the game active to true.

  tiles.forEach((tile, index) => { // Getting all the tiles.
    tile.addEventListener('click', () => clickHandler(tile, index)); // Adding a event listner for each tile, also running the clickHandler function. 
  });
};