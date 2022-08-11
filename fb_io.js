/**************************************************************/
// fb_io.js
// Written by Callum Watson 2021
/**************************************************************/

/**************************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {
  console.log('fb_initialise: ');
  // PLACE YOUR CONFIG FROM THE FIREBASE CONSOLE BELOW <========
  var firebaseConfig = {
    apiKey: "AIzaSyABg982kQeQs1QYOFNuXUZjWw07XKngVqE",
    authDomain: "comp-2022-callum-watson.firebaseapp.com",
    databaseURL: "https://comp-2022-callum-watson-default-rtdb.firebaseio.com",
    projectId: "comp-2022-callum-watson",
    storageBucket: "comp-2022-callum-watson.appspot.com",
    messagingSenderId: "437068715743",
    appId: "1:437068715743:web:ea2670585ea0c4813cfb6a",
    measurementId: "G-RJ43G526NK"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);
  console.log("Firebase Initialized")

  database = firebase.database();

}

/**************************************************************/
// fb_login(_dataRec)
// Login to Firebase
// Input:  to store user info in
// Return: n/a
/**************************************************************/
function fb_login(_dataRec) {
  console.log('fb_login: dataRec = ' + _dataRec);
  firebase.auth().onAuthStateChanged(newLogin);

  function newLogin(user) {
    if (user) {
      // user is signed in
      _dataRec.uid = user.uid;
      _dataRec.email = user.email;
      _dataRec.name = user.displayName;
      _dataRec.photoURL = user.photoURL;
      loginStatus = 'logged in';

      fb_readRec(DETAILS, user.uid, _dataRec, fb_processDetails);
      loginFlag = true
    }
    else {
      // user NOT logged in, so redirect to Google login
      _dataRec = {};
      loginStatus = 'logged out';
      console.log('fb_login: status = ' + loginStatus);

      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    }
  }

}

/**************************************************************/
// fb_logout()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_logout() {
  console.log('fb_logout: ');
  firebase.auth().signOut();
  window.location.reload();
}

/**************************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_writeRec(_path, _key, _data) {
  console.log('fb_WriteRec: path= ' + _path + '  key= ' + _key +
    '  data= ' + _data.name + '/' + _data.score);

  writeStatus = "Waiting";
  firebase.database().ref(_path + '/' + _key).set(_data,
    function(error) {
      if (error) {
        writeStatus = "Failure";
        console.log(error);
      }
      else {
        writeStatus = "Good";
      }
    }
  );
  console.log("fb_writeRec exit");
}

/**************************************************************/
// fb_readAll(_path, _data, _save)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/**************************************************************/
function fb_readAll(_path, _processData, _save) {
  console.log('fb_readAll')
  firebase.database().ref(_path).once("value", gotRecord, readErr)
  function gotRecord(snapshot) {
    let _dbData = snapshot.val();
    if (_dbData == null) {
      readStatus = "No record"
      //Calls function if there's no record and the readStatus
      _processData(readStatus, _dbData, _save)
    } else {
      readStatus = "OK"
      //Calls function to pass the data from firebase and the readStatus
      _processData("OK", _dbData, _save)
      console.log(_dbData)
    }
  }
  //If read has a error show error msg in console
  function readErr(error) {
    console.log(error + "Error");
    readStatus = 'fail';
  }
}

function fb_adReadAll(_path, _processData, _save) {
  console.log('fb_readAll')
  firebase.database().ref(_path).once("value", gotRecord, readErr)
  function gotRecord(snapshot) {
    let _dbData = snapshot.val();
    if (_dbData == null) {
      readStatus = "No record"
      //Calls function if there's no record and the readStatus
      _processData(readStatus, _dbData, _save)
    } else {
      readStatus = "OK"
      //Calls function to pass the data from firebase and the readStatus
      _processData("OK", snapshot)
      console.log(_dbData)
    }
  }
  //If read has a error show error msg in console
  function readErr(error) {
    console.log(error + "Error");
    readStatus = 'fail';
  }
}

function fb_processLobby(_status, _dbData, _save) {
  console.log("Process Lobby")
  lobby.userName = userDetails.userName
  lobby.uid = userDetails.uid
  // console.log(_dbData)

  if (_status != "OK") {
    console.log("No Record")
  } else {
    let dbKeys = Object.keys(_dbData);
    for (i = 0; i < dbKeys.length; i++) {
      let key = dbKeys[i];
      console.log(key)
      _save.push({
        username: _dbData[key].userName,
        wins: _dbData[key].wins,
        uid: _dbData[key].uid,
      })
    }
  }

  generateTable(table, lobbyArray);
}


/**************************************************************/
// fb_processDetails()
// Processing the users details.
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_processDetails(_results, _dbData, _saveData) {
  if (_results == 'OK') {
    loginFlag = true;
    //Saves all the data from firebase of userDetails into variables for my program
    _saveData.name = _dbData.name
    _saveData.email = _dbData.email
    _saveData.photoURL = _dbData.photoURL
    _saveData.phone = _dbData.phone
    _saveData.country = _dbData.country
    _saveData.postcode = _dbData.postCode
    _saveData.city = _dbData.city
    _saveData.userName = _dbData.userName
    _saveData.uid = _dbData.uid
    _saveData.age = _dbData.age
    _saveData.streetNum = _dbData.streetNum
    _saveData.streetName = _dbData.streetName
    console.table(_saveData)

    //Checks for if user is admin
    fb_readRec(ADMIN, userDetails.uid, "", fb_checkIfAdmin);

    console.log("User is Registered, Now showing game page.")
    console.log("Reading Admin Rec")

    document.getElementById('p_userName').innerHTML = "User: " + _saveData.userName; // setting the user name to show. // setting the user name to show.

    if (loginFlag == true) {
      $("#s_landingP").fadeOut(400, function() { }); // Fading out Landing

      setTimeout(function() {
        $("#s_chooseGame").fadeIn(500, function() { }); // fading Game page in
      }, 1500); // Waiting for a certain of time before fading.
    }
  } else {
    console.log("User is not Registered. Now showing register page.")

    $("#s_landingP").fadeOut(400, function() { }); // Fading Out Landing

    setTimeout(function() {
      $("#s_registerP").fadeIn(500, function() { }); // fading Register Page
    }, 1500); // Waiting for a certain of time before fading.
  }
}

/**************************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/

function fb_readRec(_path, _key, _saveData, _processFunc) {
  console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

  firebase.database().ref(_path + '/' + _key).once("value", gotRecord, readErr)
  readStatus = "Waiting"
  function gotRecord(snapshot) {
    if (snapshot.val() == null) {
      readStatus = "No record";
      //Calls function if user has no rec and passes the readStatus
      _processFunc(readStatus, '', '')
      console.log("No record")
    } else {
      readStatus = 'OK'
      //Let the data from the path and key be dbData
      let dbData = snapshot.val();
      console.log(dbData)
      //Calls functions if user has record passes the readStatus firebase data, and where to save data.
      _processFunc(readStatus, dbData, _saveData)
      console.log(dbData)
      return dbData;
    }
  }
  //If read has a error show error msg in console
  function readErr(error) {
    console.log(error + "Error");
    readStatus = 'fail';
  }
}


/**************************************************************/
// fb_updateRec()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_updateRec(_path, _key, _dataToUpdate) {
  console.log('fb_updateRec: path= ' + _path + '  key= ' + _key)
  console.log(_dataToUpdate)
  //Updates the records in data of an entire path
  updateStatus = 'waiting;'
  firebase.database().ref(_path + '/' + _key).update(_dataToUpdate,
    function(error) {
      if (error == null) {
        updateStatus = 'failure'
        console.log(error)
      }
      else {
        updateStatus = 'OK'
      }
    });
  console.log('UPDATEREC: exit')
}

/**************************************************************/
// fb_readBbDetails()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_readBbDetails(_results, _detailsToSave, _saveData) {
  console.log("fb_readBbDetails")

  if (_results == 'OK') {
    console.log("Results have come in.")
    _saveData.bb_highScore = _detailsToSave.bb_highScore; // Setting High score from database to users high score.
    console.log(_saveData.bb_highScore)
    // Displaying to the user their bb_highscore
    document.getElementById('p_bbHighScore').innerHTML = "Highscore: " + _saveData.bb_highScore;


    if (_saveData.bb_highScore == "") { // If the user doesn't have a highscore set the score to 0.
      _saveData.bb_highScore = 0;
      console.log("No record of highScore")
      document.getElementById('p_bbHighScore').innerHTML = "Highscore: " + _saveData.bb_highScore;

      fb_updateRec(BBSCORES, userDetails.uid, bbScores) // Updating this score.
    }
  } else {
    console.log('error')
  }
}

/**************************************************************/
// fb_checkIfAdmin()
// Checking if user is admin.
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_checkIfAdmin(_results) {
  if (_results == "OK") {
    //Sets admin flag to true so admin can have access to admin page
    adminFlag = true;
    //Shows admin btn 
    setTimeout(function() {
      $("#b_lpAdmin").fadeIn(500, function() { }); // fading Game page in
    }, 1500); // Waiting for a certain of time before fading.

    console.log("Show admin btn")
  } else {
    console.log("user is not admin")
  }

}


/**************************************************************/
// fb_readOnJoin(_path, _key, _saveData)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readOnJoin(_path, _key, _saveData) {
  console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

  firebase.database().ref(_path + '/' + _key).on("value", gotRecord, readErr)
  readStatus = "Waiting"
  function gotRecord(snapshot) {
    if (snapshot.val() == null) {
      console.log("User has Joined.")
      activeUid = userDetails.uid
      fb_readRec(ACTIVE, activeUid, active, fb_processActive);
      fb_readRec(TTTSCORES, userDetails.uid, tttScores, fb_readTTTDetails);
      playerNum = 0;
      fb_readOnMove(ACTIVE, activeUid + "/" + "movesP2")
    } else {
      console.log("Waiting for user to Join.")
    }
  }
  //If read has a error show error msg in console
  function readErr(error) {
    console.log(error + "Error");
    readStatus = 'fail';
  }
}

/**************************************************************/
// fb_readOnMove(_path, _key, _saveData)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/

function fb_readOnMove(_path, _key, _saveData) {
  console.log('fb_readOnMove: path= ' + _path + '  key= ' + _key);

  firebase.database().ref(_path + '/' + _key).on("value", gotRecord, readErr)
  readStatus = "Waiting"
  function gotRecord(snapshot) {
    if (snapshot.val() == null) {
      console.log("No Record")

    } else {
      console.log("Ignore first Record")
      let dbData = snapshot.val();
      console.log(dbData)
      readTurnP2(dbData)
    }
  }
  //If read has a error show error msg in console
  function readErr(error) {
    console.log(error + "Error");
    readStatus = 'fail';
  }
}

/**************************************************************/
// fb_readBbDetails()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_readTTTDetails(_results, _detailsToSave, _saveData) {
  console.log("fb_readTTTDetails")

  if (_results == 'OK') {
    console.log("Results have come in.")
    _saveData.ttt_wins = _detailsToSave.ttt_wins; // Setting High score from database to users high score.
    console.log(_saveData.ttt_wins)
    // Displaying to the user their bb_highscore
    document.getElementById('p_bbHighScore').innerHTML = "Highscore: " + _saveData.bb_highScore;


    if (_saveData.ttt_wins == "") { // If the user doesn't have a highscore set the score to 0.
      _saveData.ttt_wins = 0;
      console.log("No record of wins")
      document.getElementById('p_bbHighScore').innerHTML = "Highscore: " + _saveData.bb_highScore;

      fb_updateRec(TTTSCORES, userDetails.uid, tttScores) // Updating this score.
    }
  } else {
    console.log('error')
  }
}


/**************************************************************/
// fb_processDetails()
// Processing the users details.
// Input:  n/a
// Return: n/a
/**************************************************************/

function fb_processActive(_results, _dbData, _saveData) {
  if (_results == 'OK') {
    //Saves all the data from firebase of userDetails into variables for my program
    _saveData.drawsP1 = _dbData.drawsP1
    _saveData.drawsP2 = _dbData.drawsP2
    _saveData.losesP1 = _dbData.losesP1
    _saveData.losesP2 = _dbData.losesP2
    _saveData.movesP1 = _dbData.movesP1
    _saveData.movesP2 = _dbData.movesP2
    _saveData.uidP1 = _dbData.uidP1
    _saveData.uidP2 = _dbData.uidP2
    _saveData.userNameP1 = _dbData.userNameP1
    _saveData.userNameP2 = _dbData.userNameP2
    _saveData.winsP1 = _dbData.winsP1
    _saveData.winsP2 = _dbData.winsP2
    console.table(_saveData)

    playerArray[0].name = _saveData.userNameP1
    playerArray[1].name = _saveData.userNameP2

    // Html stuff
    const playerOnename = document.getElementById("playerOneUserName")
    const playerTwoname = document.getElementById("playerTwoUserName")

    playerOnename.innerText = playerArray[0].name + " | " + playerArray[0].symbol
    playerTwoname.innerText = playerArray[1].symbol + " | " + playerArray[1].name

  }
}

/**************************************************************/
//    END OF MODULE
/**************************************************************/