function App() {

};

App.connection = {
    firebase: false
};



(function () {
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function (snap) {
        if (snap.val() === true) {
            App.connection.firebase = true;
        } else {
            App.connection.firebase = false;
        }
    });
})();