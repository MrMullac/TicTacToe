let table = document.querySelector("table");

function generateTable(table, data) {
  console.log("Generating Table")
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }

    // add a button control.
    var button = document.createElement('input');

    // set the attributes.
    button.setAttribute('type',  'button');

    // add button's "onclick" event.         
    button.addEventListener("click", function(){ joinLobby(this, LOBBY); });
    let cell = row.insertCell();
    cell.appendChild(button);
  }
}

//generateTable(table, lobbyArray);

function createLobby(){
  console.log("Creating a Lobby For the User")
  fb_writeRec(LOBBY, userDetails.uid, lobby);
  fb_readOnJoin(LOBBY, userDetails.uid)

  $("#s_lobbyP").fadeOut(400, function() { }); // Fading out Landing
  setTimeout(function() {
    $("#s_gamePttt").fadeIn(500, function() { }); // fading Game page in
  }, 1500);
}

function joinLobby(_row, _path){
  var i = _row.parentNode.parentNode.rowIndex - 1;
  var key = document.getElementById("myTable").rows[i].cells;

  // Getting users uid
  var uidP1 = lobbyArray[i].uid
  console.log("Joining User:", uidP1, " lobby")

  active.uidP1 = lobbyArray[i].uid
  active.uidP2 = userDetails.uid
  active.userNameP1 = lobbyArray[i].username
  active.userNameP2 = userDetails.userName
  //active.winsP1 = lobby[i].wins
  //active.losesP1 = lobbyArray[i].loses
  //active.drawsP1 = lobbyArray[i].draws
  activeUid = lobbyArray[i].uid
  
  playerArray[0].name = lobbyArray[i].username
  playerArray[1].name = active.userNameP2

  // Html stuff
  const playerOnename = document.getElementById("playerOneUserName")
  const playerTwoname = document.getElementById("playerTwoUserName")

  playerOnename.innerText = playerArray[0].name + " | " + playerArray[0].symbol
  playerTwoname.innerText = playerArray[1].symbol + " | " + playerArray[1].name
    
  isGameActive = false

  fb_writeRec(ACTIVE, lobbyArray[i].uid, active)
  playerNum = 1;
  fb_readOnMove(ACTIVE, activeUid + "/" + "movesP1");

    var dbRef = firebase.database().ref(_path + '/' + uidP1);
  dbRef.remove().then(function() {
      console.log("ad_dbDelRec: Remove succeeded for " + _path + '/' + uidP1);
    })
    .catch(function(error) {
      console.log("ad_dbDelRec: Remove failed for " +
        _path + '/' + uidP1 + ': ' + error.message);
    });


  $("#s_lobbyP").fadeOut(400, function() { }); // Fading out Landing
  setTimeout(function() {
    $("#s_gamePttt").fadeIn(500, function() { }); // fading Game page in
  }, 1500);
}

function quitLobby(){
  
}