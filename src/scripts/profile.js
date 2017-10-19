// Conditional
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        onAuthStateLogin(user);
    }

});
function onAuthStateLogin(user) {
    $('.accountprofilecomponent').each(function (index, elem) {
        var $profile = $(elem);
        if ($profile.hasClass('ready'))
            return;
        // else
        populateProfile(user, elem);

        // Verify Email Event Handler
        $profile.on('click', 'button.verifymailbtn', function (e) {
            $(e.target).button('loading');
            user.sendEmailVerification().then(function () {
                // Email sent.
                setTimeout(function () {
                    $(e.target).button('reset');
                    setTimeout(function () {
                        $(e.target).addClass('disabled');
                        $(e.target).text('Email Sent (please check your email)');
                    }, 0);
                }, 200);
                console.log(e.target);
                console.log('email sent');
            }, function (error) {
                // An error happened.
                setTimeout(function () {
                    $(e.target).button('reset');
                    setTimeout(function () {
                        $(e.target).removeClass('btn-primary');
                        $(e.target).addClass('btn-danger');
                        $(e.target).text('Unable to send email');
                        $(e.target).addClass('disabled');
                    }, 0);
                }, 200);

                console.log('an error happened');
            });
        });
        $profile.addClass('ready');
    })
}

function populateProfile(user, elem) {
    console.log(elem);
    var $container = $(elem).find('.profile-props');
    if (user.photoURL) {
        var $profImg = $('<img width="200px" class="img-rounded profile-pic" alt="Profile Picture">');
        $profImg.attr('src', user.photoURL);
        $container.append($profImg);
    }
    if (user.displayName) {
        var $displayName = $('<p class="displayname lead"></p>');
        $displayName.text('User Name: ' + user.displayName || '').addClass('displayname');
        $container.append($displayName);
    }
    if (user.email) {
        var $email = $('<p class="email"></p>');
        $email.text('Email: ' + user.email || '');
        $container.append($email);
    }
    var $emailVerified = $('<div>Email Verified: &nbsp;<span class="glyphicon glyphicon-'
        + (user.emailVerified ? 'ok">' : 'remove' + '"></span><p></p>'
            + '<button class="btn btn-sm btn-primary verifymailbtn"'
            + 'data-loading-text="<i class=\'fa fa-circle-o-notch fa-spin\'></i> Sending Email" href="signup">'
            + 'Verify Email</button>') + '</div>').addClass('email-verified');
            $container.append($emailVerified);
    if (user.phoneNumber) {
        $phoneNumber = $('<p></p>');
        $phoneNumber.text('Phone Number: ' + user.phoneNumber);
        $container.append($phoneNumber);
    }
    $container.append('<div class="clearfix" />');
    $container.append('<div class="clearfix" />');
    
}
