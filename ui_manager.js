/**************************************************************/
// interface.js
// Written by Callum  2021
/**************************************************************/

// Database Variables
const DETAILS = "userDetails"; // User Details Database Variable.
const BBSCORES = "bbScores"; // Bounce Ball game Database Variable.
const ADMIN = "admin" // Admin Database Variable.   
const LOBBY = "lobby" // Lobby Database Variable.
const ACTIVE = "active" // Active Database Variable.
const TTTSCORES = "tttScores" // TicTacToe Scores Database Variable.
var activeUid = ""

var loginStatus = ' ';
var readStatus = ' ';
var writeStatus = ' ';

var userDetails = {
  uid: '',
  email: '',
  name: '',
  photoURL: '',
  userName: '',
  age: '',
  phone: '',
  gender: '',
  country: '',
  city: '',
  suburb: '',
  postCode: '',
  streetNum: '',
  streetName: '',
};

var bbScores = {
  userName: '',
  bb_highScore: '',
}

var tttScores = {
  userName: '',
  ttt_wins: '',
  ttt_loses: '',
  ttt_draws: '',
}

var lobby = {
  uid: '',
  userName: '',
  wins: '',
  loses: '',
  draws: '',
}

var active = {
  uidP1: '',
  userNameP1: '',
  winsP1: '',
  losesP1: '',
  drawsP1: '',
  movesP1: '',
  uidP2: '',
  userNameP2: '',
  winsP2: '',
  losesP2: '',
  drawsP2: '',
  movesP2: '',
}

var dbArray = [];
var lobbyArray = [];
/*dbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdbdb*/

/**************************************************************/
// setup
/**************************************************************/

var loginFlag = false;
function setup() {
  fb_initialise();           // connect to firebase

  dummy = createCanvas(0, 0);  // position the canvas
}

/**************************************************************/
// draw
/**************************************************************/
function draw() {

  if (bb_startFlag == true) {
    bb_gameManager();
  }
}

function bbChosen() {
  bb_enterGame()
  $("#s_chooseGame").fadeOut(400, function() { }); // Fading out Landing

  setTimeout(function() {
    $("#s_gamePbb").fadeIn(500, function() { }); // fading Game page in
  }, 1500); // Waiting for a certain of time before fading.
}

function tttChosen() {
  $("#s_chooseGame").fadeOut(400, function() { }); // Fading out Landing

  ttt_lobby();
  
  setTimeout(function() {
    $("#s_lobbyP").fadeIn(500, function() { }); // fading Game page in
  }, 1500); // Waiting for a certain of time before fading.
}

/**************************************************************/
// login()
// Input event; called when user clicks LOGIN button
// Logs user into firebase using Google login
// Input:
// Return:
/**************************************************************/
function login() {
  fb_login(userDetails);
}

/**************************************************************/
// readAll()
// Input event; called when user clicks READ ALL button
// Read all firebase records
// Input:
// Return:
/**************************************************************/
function readAll() {
  // CALL YOUR READ ALL FUNCTION        <=================
  fb_readAll(DETAILS, dbArray);
}

/**************************************************************/
// readRec()
// Input event; called when user clicks READ A RECORD button
// Read a specific firebase record
// Input:
// Return:
/**************************************************************/
function readRec() {
  // CALL YOUR READ A RECORD FUNCTION    <=================
  fb_readRec(DETAILS, userDetails.uid, userDetails);
}

/**************************************************************/
// writeRec()
// Input event; called when user clicks WRITE A RECORD button
// Write a record to firebase
// Input:
// Return:
/**************************************************************/
function writeRec() {
  if (userDetails.uid != '') {
    //userDetails.score = Number(prompt("enter the user's score"));
    userDetails.age = Number(prompt("Enter your age."))
    // CALL YOUR WRITE A RECORD FUNCTION    <=================
    //            path     key                  details
    fb_writeRec(DETAILS, userDetails.uid, userDetails);
  }
  else {
    dbScore = '';
    writeStatus = '';
    loginStatus = 'not logged in';
  }
}

/**************************************************************/
// logout()
// Input event; called when user clicks LOGOUT button
// Logs user out of firebase 
// Input:
// Return:
/**************************************************************/
function logout() {
  fb_logout();
}


function ttt_lobby() {
  fb_readAll(LOBBY, fb_processLobby, lobbyArray)
}

function adminBtn() {
  ad_admin();
}

function windowResized() {
  bb_windowResized();
}
/**************************************************************/
//    END OF PROG
/**************************************************************/