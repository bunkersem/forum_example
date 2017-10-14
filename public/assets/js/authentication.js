

$(document).ready(function () {
    $(document).on('submit', 'form.create.emailandpassword', function (e) {
        var $loginForm = $(e.target);
        e.preventDefault();
        e.stopPropagation();

        var email = e.target.elements['email'].value;
        var password = e.target.elements['password'].value;

        // Create
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log('succesfull account createion');
                setConditional('loggedin', true);
                // TODO show result to user
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                // TODO create error catching
                console.error(errorCode, errorMessage);
            });
    });

    $(document).on('submit', 'form.signin.emailandpassword', function (e) {
        var $signinForm = $(e.target);
        e.preventDefault();
        e.stopPropagation();

        var email = e.target.elements['email'].value;
        var password = e.target.elements['password'].value;

        // Signin
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log('succesfull sigin');
                setConditional('loggedin', true);
                // TODO show result to user
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // TODO create error catching
                console.error(errorCode, errorMessage);
            });
    });
});

// Conditional
firebase.auth().onAuthStateChanged(function (user) {
    console.log('onAuthStateChanged', user);
    setConditional('loggedin', user);
});
function setConditional(name, isTrue) {
    if (isTrue)
        $(document.documentElement).addClass(name);
    else
        $(document.documentElement).removeClass(name);
}

function userSignOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('Sign-out successful')
        // TODO make dialog appear
      }).catch(function(error) {
          // An error happened.
          console.log('An error happened.');
        // TODO make dialog appear
      });
}