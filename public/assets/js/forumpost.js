(function () {
    var $formListsArray = $('.forumpost');
    if ($formListsArray.length === 0)
        return;
    firebase.database().ref('posts/' + getParameterByName('key', window.location.href)).once('value').then(function (snapshot) {
        var postSnapshotVal = snapshot.val();
        
        $('.forumpost').each(function (index, element) {
            $formPost = $(element);
            renderFormPost($formPost.get(0), postSnapshotVal);
            $formPost.addClass('ready');
        })
    });
    function renderFormPost(root, post) {
        $(root).find('.post-content').text(post.content);
        $(root).find('.post-title').text(post.title);
        $(root).find('.post-likes').text(average(propToArr(post.likes).map(l => l.rating)).toString().slice(0, 3));
        $(root).find('.post-time').text(new Date(post.timestamp).toLocaleString());
        $(root).find('.post-user').text(post.user);
        $(root).find('.post-views').text(post.views);
    }
})();