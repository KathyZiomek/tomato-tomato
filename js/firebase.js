function firebaseApp() {
    var registerButton = document.getElementById("register");
    registerButton.addEventListener("click", registerInFirebase, false);

    var loginButton = document.getElementById("login");
    loginButton.addEventListener("click", loginWithFirebase, false);

    //var signoutButton = document.getElementById("signout");
    //signoutButton.addEventListener("click", signoutWithFirebase, false);

    //var saveButton = document.getElementById("save-data-button");
    //saveButton.addEventListener("click", saveDataWithFirebase, false);

    // hide content when page is first loaded
    //document.getElementById('login').style.display = 'block';
    //document.getElementById('register').style.display = 'block';
    //document.getElementById('main-page').style.display = 'none';
}

function registerInFirebase() {
    var email = $gel('email').value;
    var password = $gel('password').value;

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }

    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
            alert('Thank you for registering!\nPlease log in:'); 

            //save the user to the Firebase Database
            saveDataWithFirebase();

            $gel('username').value = '';
            $gel('email').value = '';
            $gel('password').value = '';

        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } 
            else if (errorCode === 'auth/email-already-exists') {
                alert('This email and/or username is already associated with an account.\nWould you like to login instead?');
            } 
            else {
                alert(errorMessage);
            }
            console.log(error);
        }
    );
}

function loginWithFirebase() {
    var username = $gel('email').value;  
    var email = $gel('email').value;
    var password = $gel('password').value;

    if (username.length < 4) {
      alert('Please enter a username.');
      return;
    }
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
            
            // load data 
            retrieveDataFromFirebase();
            $gel('choose-study-options').classList.remove("hiddenClass");
            alert('Login successful!'); 


        })
        //add validation depending on the error message
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } 
            else if (errorCode === 'auth/user-not-found') {
                alert('This account does not exist. Would you like to register instead?');
            } 
            else {
                alert(errorMessage);
            }
        }
    );
}

/*
function signoutWithFirebase() {
    firebase.auth().signOut().then(function() {
        // if logout was successful
        if (!firebase.auth().currentUser) {
            document.getElementById('login').style.display = 'block';
            document.getElementById('register').style.display = 'block';
            document.getElementById('main-page').style.display = 'none';
            document.getElementById('some-data-textarea').value = '';
        }
    });
    alert('user was logged out!');
}
*/

function saveDataWithFirebase() {
    // *********************************************************************
    // When saving data, to create a new collection you can use SET 
    // and when updating you can use UPDATE (refer to docs for more info)
    // -- https://firebase.google.com/docs/firestore/manage-data/add-data
    // *********************************************************************

    var userId = firebase.auth().currentUser.uid;

    // SAVE DATA TO REALTIME DB
    // Get a reference to the database service
    var database = firebase.database();

    database.ref('users/' + userId).set({
        //test: "test"
        username: $gel('username').value
        //whenever I want to add something to the Firebase database for storage, add it here
        //could get information from a textbox and add it with a UID
        //text: $gel('uid').value
    });
}

/*create a function that will store the amount of time a user has spent studying in the Firebase database*/
function saveTimeStudiedWithFirebase() {
    var userId = firebase.auth().currentUser.uid;

    // SAVE DATA TO REALTIME DB
    // Get a reference to the database service
    var database = firebase.database();

    database.ref('studyData/' + userId).set({
        timeStudied: totalTimeStudied
    });
}


function retrieveDataFromFirebase() {
    // *********************************************************************
    // When loading data, you can either fetch the data once like in these examples 
    // -- https://firebase.google.com/docs/firestore/query-data/get-data
    // or you can listen to the collection and whenever it is updated on the server
    // it can be handled automatically by your code
    // -- https://firebase.google.com/docs/firestore/query-data/listen
    // *********************************************************************
    var userId = firebase.auth().currentUser.uid;
        
    // LOAD DATA FROM REALTIME DB
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        //$gel('uid').value = snapshot.val().text;
        $gel('loginForm').innerHTML = "Welcome back, " + snapshot.val().username + "!";
    });
}