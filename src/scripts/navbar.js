$(document).ready(function() {
    var $stickyNavbar = $('.navbar-sticky-top');
    if ($stickyNavbar.length === 0)
        return;
    var $stickyNavbarContainer = $('.sticky-navbar-container');
    $stickyNavbar.addClass('navbar-static-top');
    var navBarViewTop = $stickyNavbar.offset().top;
    $(window).on('scroll', function(e) {
        var docViewTop = $(window).scrollTop();
        if (navBarViewTop <= docViewTop) {
            $stickyNavbar.removeClass('navbar-static-top');
            $stickyNavbar.addClass('navbar-fixed-top');
            $stickyNavbarContainer.addClass('inflate');
        }
        else {
            $stickyNavbar.addClass('navbar-static-top');
            $stickyNavbar.removeClass('navbar-fixed-top');
            $stickyNavbarContainer.removeClass('inflate');
        }
    });
})