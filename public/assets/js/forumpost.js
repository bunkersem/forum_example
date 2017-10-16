(function () {
    var $formListsArray = $('.forumpost');
    if ($formListsArray.length === 0)
        return;
    var postKey = getParameterByName('key', window.location.href);
    firebase.database().ref('posts/' + postKey).once('value').then(function (snapshot) {
        var postSnapshotVal = snapshot.val();

        var $formPost = $('.forumpost');

        var postCommentsRef = firebase.database().ref('posts/' + postKey + '/comments');
        $(document).on('submit', '.commentcreate', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $post = $(e.target).closest('.forumpost');
            var $comments = $post.find('.post-comments');
            var content = e.target.elements['content'].value;
            // TODO do validation
            placeComment(postKey, content);
        });

        populateForumPost($formPost.get(0), postSnapshotVal);
        var comments = propToArr(postSnapshotVal.comments);
        populateForumPostComments($formPost.get(0), comments || []);

        $formPost.addClass('ready');

    });
    function populateForumPost(root, post) {
        $(root).find('.post-content').text(post.content);
        $(root).find('.post-title').text(post.title);
        // $(root).find('.post-likes').text(average(propToArr(post.likes).map(l => l.rating)).toString().slice(0, 3));
        $(root).find('.post-time').text(new Date(post.timestamp).toLocaleString());
        $(root).find('.post-user').text(post.user);
        // $(root).find('.post-views').text(post.views);
    }
    function populateForumPostComments(root, comments) {
        var $postCommentRoot = $(root).find('.post-comments');
        function template(content) { return [
            '<li class="list-group-item">',
            '<span class="comment-content">',
            content,
            '</span>',
            '</li>'
        ].join('')};
        // TODO change comments real time when the database changes ("could have" feature)
        (comments || []).forEach(function(c) {
            // TODO make comments orderable. (popular, recent, etc)
            // TODO add tSime to comment
            // TODO add user to comment
            var $newComment = $postCommentRoot.append(template(c.content));
        });

    }


    function placeComment(postKey, content) {
        var user = firebase.auth().currentUser;
        var prerequisites = checkValid(
            validator(App.connection.firebase === true, 'Sorry, we could not establish a connection to the server. We are not able to process your request'),
            validator(user !== null, 'Sorry, we were not able to verify that you are currently logged in. Please login if your not already.'),
        );
        if (prerequisites !== true) {
            console.error(result);
            // TODO notify the user.
            return;
        }
        var comment = {
            content: content,
            userId: user.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        }
        var result = checkValid(
            validator(validator.exists(comment.content), 'A comment requires content'),
            validator(validator.exists(comment.userId), 'A post requires a user id'),
            validator(validator.exists(comment.timestamp), 'A post requires a timestamp'),
            validator(comment.content.length >= 5, 'A posts\'s content requiers at least 5 characters'),
            validator(comment.content.length <= 100, 'A posts\'s content cannot be longer than 100 characters'),
        );
        if (result !== true) {
            console.error(result);
            // TODO notify the user.
            return;
        }
        var commentRef = firebase.database().ref('posts/' + postKey + '/comments').push(comment);
        var commentKey = commentRef.key;
        console.log('comment key:', commentKey);
    }
    

})();

