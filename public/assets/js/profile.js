// Conditional
firebase.auth().onAuthStateChanged(function (user) {
    if (user) 
        onAuthStateLogin(user);
    else 
        onAuthStateLoggedOut();
    
});
function onAuthStateLogin(user) {
    $('.accountprofilecomponent').each(function (index, elem) {
        var $profile = $(elem);
        $profile.html(createProfileHtml(user));
    })
}
function onAuthStateLoggedOut() {
    $('.accountprofilecomponent').each(function (index, elem) {
        var $profile = $(elem);
        $profile.html('');
    })
}

function createProfileHtml(user) {
    var profileHtml = '<ul class="list-group">'
    + (user.displayName
        ? '<li class="list-group-item displayname">' + 'Display Name: ' + user.displayName + '</li>'
        : '')
    + '<li class="list-group-item email">Email: ' + user.email + '</li>'
    + '<li class="list-group-item emailverified">Email Verified? <span class="glyphicon ' 
    + (user.emailVerified 
        ? 'glyphicon-ok' 
        : 'glyphicon-remove')
    + '"></span></li>'
    + (user.phoneNumber
        ? '<li class="list-group-item phone-number">Phone Number: ' + user.phoneNumber + '</li>'
        : '')
    + (user.photoURL 
        ? '<img class="list-group-item photourl" src="' + user.photoURL + '" alt="profile picture">'
        : '')
    + '</ul>';
    return profileHtml;
}