(function() {
    var $formListsArray = $('.forumpostscomponent');
    if ($formListsArray.length === 0)
        return;
    firebase.database().ref('posts').once('value').then(function(snapshot) {
        var postsSnapshotVal = snapshot.val();
        var posts = Object.keys(postsSnapshotVal).map(function(k) { return postsSnapshotVal[k] });
        $('.forumpostscomponent').each(function(index, element) {
            var $formList = $(element);
            if (!$formList.attr('data-props'))
                console.error('data-props attribute not defined on: ', $formList.get(0));
            var props = JSON.parse($formList.attr('data-props').replace(/'/gm, '"'));
            console.log(posts, props);
            posts.slice(0, props.amount || 12).forEach(function(p) {
                $formList.append(generateBlogPost(p));
            })
        })
    });
})();

function generateBlogPost(post) {
    var html = '<div class="forumpost panel panel-default">'
    + '<div class="panel-body">'
    + '<h1>' + post.title + '</h1>'
    + '<p>' + post.content + '</p>'
    + '</div>'
    + '</div>';
    return html;
}