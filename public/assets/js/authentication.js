

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

    function userSignOut() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log('Sign-out successful')
            // TODO make dialog appear
        }).catch(function (error) {
            // An error happened.
            console.log('An error happened.');
            // TODO make dialog appear
        });
    }
    $(document).on('click', '.authlogout', function(e) {
        userSignOut();
    });

    function signUpWithGoogle() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            'redirect_uri': 'profile',
            'login_hint': 'user@example.com'
        });
        firebase.auth().signInWithRedirect(provider);
    }

    function signUpWithTwitter() {
        var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    function signUpWithFacebook() {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
            'display': 'popup'
        });
        firebase.auth().signInWithRedirect(provider);
    }

    function signUpWithGithub() {
        var provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    $(document).on('click', '.signup-providers .signup-with-google', function(e) {
        signUpWithGoogle();
    });

    $(document).on('click', '.signup-providers .signup-with-facebook', function(e) {
        signUpWithFacebook();
    });

    $(document).on('click', '.signup-providers .signup-with-twitter', function(e) {
        signUpWithTwitter();
    });

    $(document).on('click', '.signup-providers .signup-with-github', function(e) {
        signUpWithGithub();
    });
});

// Add user to the database user list if not already added.
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var userRef = firebase.database().ref('users/' + user.uid);
        setTimeout(function () {
            userRef.once('value').then(function (snapshot) {
                // Check if user already exists.
                if (snapshot.exists() === false) {
                    // Add user to the user list
                    console.log('adding user to the user list');
                    userRef.set({
                        public: {
                            displayName: user.displayName,
                            uid: user.uid,
                        },
                        email: user.email,
                        emailVerified: user.emailVerified,
                        isAnonymous: user.isAnonymous,
                        phoneNumber: user.phoneNumber,
                        photoURL: user.photoURL,
                        providerData: user.providerData,
                        providerId: user.providerId,
                    });
                }
            });
        }, 0);
    }
})

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