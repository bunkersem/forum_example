firebase.auth().onAuthStateChanged(function (user) {
    console.log('onAuthStateChanged', user);
    setConditional('ready', true);
});