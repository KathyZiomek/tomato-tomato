function firebaseApp() {
    var registerButton = document.getElementById("register");
    registerButton.addEventListener("click", registerInFirebase, false);

    var loginButton = document.getElementById("login");
    loginButton.addEventListener("click", loginWithFirebase, false);
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

            //save the new user to the Firebase Database
            saveDataWithFirebase();

            //re-set the fields so the user has to input them again for security
            $gel('username').value = '';
            $gel('email').value = '';
            $gel('password').value = '';

        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            //validation for the entered fields
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
    //get the user's information from the form fields
    var username = $gel('username').value;  
    var email = $gel('email').value;
    var password = $gel('password').value;

    //have validation for the entered fields
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

            //unhide the logout button now that the user has logged in
            $gel('logoutButton').classList.remove("hiddenClass");

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

/*Save the user's username to Firebase*/
function saveDataWithFirebase() {
    //get the userID
    var userId = firebase.auth().currentUser.uid;

    // SAVE DATA TO REALTIME DB
    // Get a reference to the database service
    var database = firebase.database();

    database.ref('users/' + userId).set({
        //save the username to Firebase
        username: $gel('username').value
    });
}

/*store the amount of time a user has spent studying in the Firebase database*/
function saveTimeStudiedWithFirebase() {
    var userId = firebase.auth().currentUser.uid;

    // SAVE DATA TO REALTIME DB
    // Get a reference to the database service
    var database = firebase.database();

    database.ref('studyData/' + userId).set({
        timeStudied: totalTimeStudied
    });
}

/*Retrieve the user's username to display to the screen once they have successfully logged in, and display a button that they can click to begin selecting their studying options*/
function retrieveDataFromFirebase() {

    var userId = firebase.auth().currentUser.uid;
        
    // LOAD DATA FROM REALTIME DB
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        //$gel('uid').value = snapshot.val().text;
        $gel('loginForm').innerHTML = "<br><p class='mt-3'>Welcome back, " + snapshot.val().username + "!</p>";

        //create a button that will allow the user to input their study options
        //var buttonsDiv = $gel("buttons");
        var studyOptionsButton = document.createElement("button");
        studyOptionsButton.innerText = "Choose Study Options";
        studyOptionsButton.type = "submit";
        studyOptionsButton.setAttribute("id", "choose-study-options");
        studyOptionsButton.setAttribute("onclick", "chooseStudyOptions();");
        studyOptionsButton.setAttribute("class", "btn btn-danger mt-1");
        $gel('loginForm').appendChild(studyOptionsButton);
    });
}

//create two functions to return information from the Firebase database that will be used along with the local storage
//return the user's username
function returnUsernameFromFirebase() {
    //get the user ID
    var userId = firebase.auth().currentUser.uid;

    // LOAD DATA FROM REALTIME DB
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        username = snapshot.val().username;
    });
}

//return the user's total study time as entered in the prompts
function returnStudyTimeFromFirebase() {
    //get the user ID
    var userId = firebase.auth().currentUser.uid;

    // LOAD DATA FROM REALTIME DB
    firebase.database().ref('/studyData/' + userId).once('value').then(function(snapshot) {
        studyTime = parseInt(snapshot.val().timeStudied);
    });
}