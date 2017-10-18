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
            var $submitBtn = $(e.target).find('[type=submit]');
            var $comments = $post.find('.post-comments');
            placeComment(postKey, $(quill.container).find('.ql-editor'),  $submitBtn.get(0));
        });

        populateForumPost($formPost.get(0), postSnapshotVal);
        var comments = propToArr(postSnapshotVal.comments);
        createForumPostComments($formPost.get(0), comments || []);
        var quill = new Quill('#editor', {
            modules: { toolbar: '#toolbar' },
            theme: 'snow',
            placeholder: 'Write a comment',
        });

        // characters remaining
        $formPost.on('keyup', '.ql-editor', function(e) {
            var length = $(e.target).text().length || 0;
            $formPost.find('.currchars').text(length);
            if (length > 400) {
                $formPost.find('.remaining').addClass('text-danger');
                $formPost.find('.remaining').removeClass('text-muted');
            }
            else {
                $formPost.find('.remaining').removeClass('text-danger');
                $formPost.find('.remaining').addClass('text-muted');
            }
        });
        $formPost.addClass('ready');

    });

    function setupFormPostEventHandlers() {

    }

    function populateForumPost(root, post) {
        $(root).find('.post-content').html(sanitizeHtml(post.content));
        $(root).find('.post-title').text(post.title);
        // $(root).find('.post-likes').text(average(propToArr(post.likes).map(l => l.rating)).toString().slice(0, 3));
        $(root).find('.post-time').text(new Date(post.timestamp).toLocaleString());
        $(root).find('.post-user').text(post.user);
        // $(root).find('.post-views').text(post.views);
    }
    function createForumPostComments(root, comments) {
        // TODO change comments real time when the database changes ("could have" feature)
        (comments || []).forEach(function(c) {
            createSingleForumPostComment(root, c);
        });
    }
    function createSingleForumPostComment(root, comment) {
        var $postCommentRoot = $(root).find('.post-comments');
        function template(content) { return [
            '<li class="comment">',
            '<div class="panel panel-default">',
            '<div class="panel-body">',
            '<span class="comment-content">',
            sanitizeHtml(content),
            '</span>',
            '</div>',
            '</div>',
            '</li>'
        ].join('')};
        // TODO make comments orderable. (popular, recent, etc)
        // TODO add tSime to comment
        // TODO add user to comment
        $postCommentRoot.prepend(template(comment.content));
    }


    function placeComment(postKey, contentContainer, submitBtn) {
        var htmlContent = $(contentContainer).html();
        var textContent = $(contentContainer).text();
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
            content: sanitizeHtml(htmlContent),
            userId: user.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        }
        var result = checkValid(
            validator(validator.exists(comment.content), 'A comment requires content'),
            validator(validator.exists(comment.userId), 'A comment requires a user id'),
            validator(validator.exists(comment.timestamp), 'A comment requires a timestamp'),
            validator(textContent.length <= 400, 'A commment cannot have more than 400 characters'),
            validator(textContent.length >= 5, 'A comment content requiers at least 5 characters'),
            validator(comment.content.length <= 2000, 'A comment content contains more than 2000 html entities'),
        );
        if (result !== true) {
            console.error(result);
            // TODO notify the user.
            return;
        }
        console.log('submitting comment:', comment);
        var commentRef = firebase.database().ref('posts/' + postKey + '/comments').push(comment);
        $(submitBtn).button('loading');
        console.log(submitBtn);
        commentRef
        .catch(function(err) {
            setTimeout(function() {
                $(submitBtn).button('reset');
            }, 200);
            // TODO err handling and user notification.
            console.error(err);
        })
        .then(function(ref) {
            setTimeout(function() {
                $(submitBtn).button('reset');
            }, 200);
            console.log('done');
        });
        var commentKey = commentRef.key;
        console.log('comment key:', commentKey);
        var $formPost = $('.forumpost');
        createSingleForumPostComment($formPost.get(0), comment);
    }
})();

