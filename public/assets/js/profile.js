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
        
        populateProfile(user, elem);
        $profile.addClass('ready');
    })
}
function onAuthStateLoggedOut() {
    $('.accountprofilecomponent').each(function (index, elem) {
        var $profile = $(elem);
        // TODO redirect to login page 
    })
}

function populateProfile(user, elem) {
    $(elem).find('.displayname').text(user.displayName);
    $(elem).find('.email').text(user.email);
    $(elem).find('.email-verified').addClass('glyphicon glyphicon-' + (user.emailVerified ? 'ok' : 'remove'));
    $(elem).find('.phone-number').text(user.phoneNumber);
    $(elem).find('.phone-photoURL').text(user.photoURL);
}
