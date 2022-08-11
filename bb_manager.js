/*************************************************************/
// bb_manager.js
//
// Bouncing Ball Game
// Written by Callum Watson 2021
// v01 Code used from my mini skills
// v02 Code updated to fit with firebase
/**************************************************************/ 

let ballsArray = [];
const NUMOFBALLS = 5;
const VELRANDOM = [11, 10, 9, 8, -8, -9, -10, -11];
const BB_MIND = 100;
const BB_MAXD = 200;


var bb_gameCnv;
var bb_level = 1;
var bb_gameTimer = 60;
var bb_misses = 0;
var bb_score = 0;
var bb_newHighScore;
var bb_interval;
var bb_gameEnteredFlag = false;
var bb_startFlag = false;
var bb_checkBallHitFlag = false;
var balls2Add = NUMOFBALLS;


/***************************/
// Class b_ball
/***************************/
class b_ball {
  constructor(_velRandom, _minD, _maxD) {
    this.x = width / 2;
    this.y = height / 2;
    this.spdX = random(_velRandom);
    this.spdY = random(_velRandom);
    this.red = random(0, 255);
    this.green = random(0, 255);
    this.blue = random(0, 255);
    this.ransparency = random(0, 255);
    this.diameter = random(_minD, _maxD);
  }
  display() {
    fill(this.red, this.green, this.blue, this.transparency)
    ellipse(this.x, this.y, this.diameter);
  }
  move() {
    this.x = this.x + this.spdX;
    this.y = this.y + this.spdY;
  }
  bounce() {
    //Movement speed of 1st ball xPos
    if (this.x >= (width - (this.diameter / 2))) {
      this.spdX = this.spdX * -1;
      this.x = width - (this.diameter / 2);
    } else if (this.x <= (this.diameter / 2)) {
      this.spdX = this.spdX * -1;
      this.x = this.diameter / 2;
    }
    // Movement speed of 1st ball yPos
    if (this.y >= (height - (this.diameter / 2))) {
      this.spdY = this.spdY * -1;
      this.y = height - (this.diameter / 2);
    } else if (this.y <= (this.diameter / 2)) {
      this.spdY = this.spdY * -1;
      this.y = this.diameter / 2;
    }
  }
  // Checking to see if the user has clicked on the ball, returning true or false.
  clicked(x, y) {
    var dist2Ball = dist(x, y, this.x, this.y)
    if (dist2Ball < (this.diameter / 2)) {
      return true;
    } else {
      return false;
    }
  }
}


/*************************************************************
// bb_enterGame();
// Run to set everything up for the user, runs when the landing page is hidden.
*************************************************************/

function bb_enterGame() {
  // if user login successful send them to s_bbGameP and reads their Rec
  if (loginFlag == true) {
    console.log("User has logged in ready to play.")
    //Flag of bb_gameEnteredFlag to true so canvas can be drawn
    bb_gameEnteredFlag = true;
    //Calls function to read user's bb records of fb
    fb_readRec(BBSCORES, userDetails.uid, bbScores, fb_readBbDetails);
    //Sets gameName for the bbGame
    //fb_readRec() 
    //Creates canvas based on div size
    bb_gameCnv = createCanvas(0, 0);
    var elmnt = document.getElementById("d_gameCnv");
    console.log("Height/width" + elmnt.offsetHeight +
      '/' + elmnt.offsetWidth
      + "xPos/yPos" + "/"
      + elmnt.offsetLeft + "/"
      + elmnt.offsetTop);

    bb_gameCnv.resize(elmnt.offsetWidth, elmnt.offsetHeight)
    bb_gameCnv.position(elmnt.offsetLeft, elmnt.offsetTop)
    bb_gameCnv.parent('d_gameCnv')
    
    // Displaying the users Level, time, misses, and score.
    //Level
    document.getElementById('p_bbLevel').innerHTML = "Level: " + bb_level;
    //Timer
    document.getElementById('p_bbTimer').innerHTML = "Timer: " + bb_gameTimer;
    //Misses
    document.getElementById('p_bbMisses').innerHTML = "Misses: " + bb_misses;
    //Score
    document.getElementById('p_bbScore').innerHTML = "Score: " + bb_score;   
  } else {
    console.log("User Hasn't logged in") // Logging that the user hasn't logged in.
  }

}

/*************************************************************
// bb_exit();
*************************************************************/
function bb_exit() {
  //Calls bb_gameReset(); to reset the game
  bb_gameReset();
  bb_startFlag = false; // Changing the starting flag.
  clearInterval(bb_interval);
}

/*************************************************************
// bb_startGame();
*************************************************************/
function bb_startGame() {
  if (bb_startFlag == false) {
    bb_windowResized() // Setting the width and height of the game.
    bb_startFlag = true;
    bb_interval = setInterval(bb_timer, 200)
    for (i = 0; i < NUMOFBALLS; i++) { // Creating the array of balls.
      ballsArray.push(new b_ball(VELRANDOM, BB_MIND, BB_MAXD))
    }
  }
}

/*************************************************************
// bb_gameManager();
*************************************************************/
function bb_gameManager() {
  background(220)
  bb_gameCnv.mousePressed(bb_checkBallHit); //Checking if ball is hit on the canvas

  for (i = 0; i < ballsArray.length; i++) {
    ballsArray[i].move();
    ballsArray[i].bounce();
    ballsArray[i].display();
  }
  
  if (ballsArray.length == 0) { // If the ball array is down to 0 run the level function.
    bb_levelControl();
  }
  
}

/***************************/
// bb_checkBallHit()
/***************************/
function bb_checkBallHit() {
  if(bb_startFlag == true){
  var bb_checkBallHitFlag = false;

  for (i = ballsArray.length - 1; i >= 0; i--) {
    if (bb_checkBallHitFlag == false) {
      if (ballsArray[i].clicked(mouseX, mouseY)) {
        ballsArray.splice(i, 1)
        bb_checkBallHitFlag = true;
      }
    }
  }
  // Adding score when the player hits the ball
  if (bb_checkBallHitFlag == true) {
    console.log("Ball has been hit.")
    bb_score = bb_score + 2;

    if (bb_score > bbScores.bb_highScore) {
      bb_writeNewHighScore();
    }
  }
  // Takes 1 score away if user misses and misses++
  if (bb_checkBallHitFlag == false) {
    bb_misses++
    bb_score--
    // Makes sure bb_score =! < 0
    if (bb_score < 0) {
      bb_score = 0;
    }
  }
  //Shows new score/misses
  document.getElementById('p_bbScore').innerHTML = "Score: " + bb_score;
  document.getElementById('p_bbMisses').innerHTML = "Misses: " + bb_misses;
  console.table(bbScores)
  }
}
/***************************/
// bb_writeNewHighScore()
// Checking if the user has got a new high score.
/***************************/
function bb_writeNewHighScore() {

  bb_newHighScore = bb_score // Setting the new highscore to the users score from the game.
  document.getElementById('p_bbHighScore').innerHTML = "Highscore: " + bb_newHighScore // Displaying the highscore.
  bbScores.bb_highScore = bb_newHighScore; // Writing the new high score.
  fb_updateRec(BBSCORES, userDetails.uid, bbScores) // Updating the score to the firebase.

}

/*************************************************************
// bb_levelControl();
*************************************************************/
function bb_levelControl() {

  bb_level = bb_level + 1; // Adding level.
  document.getElementById('p_bbLevel').innerHTML = "Level: " + bb_level;
  bb_gameTimer = 60;

  balls2Add = NUMOFBALLS * bb_level; // Adding more balls on a new level
  for (i = 0; i < balls2Add; i++) {
    ballsArray.push(new b_ball(VELRANDOM, BB_MIND, BB_MAXD))
    ballsArray[i].move();
    ballsArray[i].bounce();
    ballsArray[i].display();
  }
}

/*************************************************************
// bb_timer();
*************************************************************/
function bb_timer() {
  console.log("bb_timer")
  bb_gameTimer--; // Setting the timer to go down.
  document.getElementById('p_bbTimer').innerHTML = "Timer: " + bb_gameTimer; // Displaying the timer.


  if (bb_gameTimer <= 0) { // Checking if the timer is set to 0.
    bb_gameReset(); // Calling the game reset funciton, to reset the game.
    clearInterval(bb_interval);
    console.log("Timer reaches 0")
    clear(bb_gameCnv)
  }
}

/*************************************************************
// bb_windowResized();
*************************************************************/

function bb_windowResized() {

  if (bb_gameEnteredFlag == true) { // Activates when the user enters the game.
    // Setting the canvas to the correct sizing.
    elmnt = document.getElementById("d_gameCnv");
    console.log("Height/width" + elmnt.offsetHeight +
      '/' + elmnt.offsetWidth
      + "xPos/yPos" + "/"
      + elmnt.offsetLeft + "/"
      + elmnt.offsetTop);

    bb_gameCnv.parent('d_gameCnv')
    bb_gameCnv.position(elmnt.offsetLeft, elmnt.offsetTop)
    bb_gameCnv.resize(elmnt.offsetWidth, elmnt.offsetHeight);
  }
}

/*************************************************************
// bb_gameReset();
// Reseting the game once the game has finished.
*************************************************************/

function bb_gameReset() {
console.log("game Reset")
  clearInterval(bb_interval);
  bb_level = 1; // Reseting the level back to 0.
  bb_gameTimer = 60; // Reseting the game timer to 60.
  bb_misses = 0; // Reseting Misses to 0.
  bb_score = 0; // Reseting the score back to 0.
 
  // Setting the level in html.
  document.getElementById('p_bbLevel').innerHTML = "Level: " + bb_level;
  // Setting the timer in html
  document.getElementById('p_bbTimer').innerHTML = "Timer: " + bb_gameTimer;
  // Setting the misses in html
  document.getElementById('p_bbMisses').innerHTML = "Misses: " + bb_misses;
  // Setting the users score in html
  document.getElementById('p_bbScore').innerHTML = "Score: " + bb_score;

  // Splicing the left over balls.
   for (i = ballsArray.length - 1; i >= 0; i--){
    ballsArray.splice(i);
  }

  bb_startFlag = false; // Setting the flag back to false so the user can restart the game.
}

/*************************************************************
// END OF PROGRAM
*************************************************************/