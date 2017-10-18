(function () {
    var $formListsArray = $('.forumpostscomponent');
    if ($formListsArray.length === 0)
        return;
    firebase.database().ref('posts').once('value').then(function (snapshot) {
        var postsSnapshotVal = snapshot.val();
        var posts = propToArr(postsSnapshotVal);
        $('.forumpostscomponent').each(function (index, element) {
            var $formList = $(element);
            $formList.removeClass('ready');
            if (!$formList.attr('data-props'))
                console.error('data-props attribute not defined on: ', $formList.get(0));
            var props = JSON.parse($formList.attr('data-props').replace(/'/gm, '"'));
            console.log(posts, props);
            var $formListPosts = $(element).children('.posts');
            var listPosts = posts.slice(0).sort(sortPostsByType(props.sortBy))
            posts.slice(0, props.amount || 12).forEach(function (p) {
                $formListPosts.append(generateForumPost(p));
            });
            $formList.addClass('ready');
        })
    });
    function generateForumPost(post) {
        console.log(post)
        var html = [
            '<li class="forumpostlist-item list-group-item">',
            '<a href="post?key=' + encodeURIComponent(post._key) + '">',
            '<h1>' + escapeHtml(post.title) + '</h1>',
            '</a>',
            '<div class="forumpostlist-itemcontent">',
            sanitizeHtml(post.content),
            '</div>',
            '</li>'
        ].join('');
        return html;
    }

    function sortPostsByType(type) {
        switch (type) {
            case 'popular':
                return (a, b) => b.views - a.views;
            case 'recent':
                return (a, b) => b.timestamp - b.timestamp;
            case 'rated':
                return (a, b) => b.rating - a.rating;
            case 'alphabetical':
                return (a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0);
            default:
                return sortPostsByType('popular');
        }
    }
})();

