(function () {
    $(document).ready(function () {
        function createNewForumPost(title, content) {
            var prerequisites = checkValid(
                validator(App.connection.firebase === true, 'Sorry, we could not establish a connection to the server. We are not able to process your request'),
            );
            if (prerequisites !== true) {
                return { result: false, err: prerequisites };
            }
            var user = firebase.auth().currentUser;
            var post = {
                title: title,
                content: sanitizeHtml(content),
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                userId: user.uid,
            }
            var result = checkValid(
                validator(user !== null, 'Sorry, we were not able to verify that you are currently logged in. Please login if your not already.'),
                validator(validator.exists(post.title), 'A post requires a title'),
                validator(validator.exists(post.content), 'A post requires content'),
                validator(validator.exists(post.userId), 'A post requires a user id'),
                validator(validator.exists(post.timestamp), 'A post requires a timestamp'),
                validator(post.title.length <= 1000, 'A post\'s title cannot have more than 1000 html entities'),
                validator(post.content.length <= 20000, 'A posts\'s content cannot have more than 20000 html entities'),
            );
            if (result !== true) {
                return { result: false, err: result };
            }
            var postRef = firebase.database().ref('posts').push(post);
            var key = postRef.key
            console.log('newpost key', key);
            // TODO add post key to user's posts.
            // TODO redirect to posts page.
            return { result: true, promise: postRef };
        }

        $(document).on('submit', 'form.newforumpost', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $newForumPost = $(e.target);
            var title = $newForumPost.get(0).elements['title'].value;
            var dirtyContent = $(quill.container).find('.ql-editor').html();
            var outcome = createNewForumPost(title, dirtyContent);
            if (outcome.result === false) {
                console.error(outcome.err);


                // TODO notify user
                return;
            } // else
            try {
                $newForumPost.find('[type=submit]').button('loading');
                $('#forumpostsubmitteddialog')
                    .css('top', '-100vh')
                    .modal('show')
                    .animate({ top: '0' }, 'slow');
            } catch (err) { }
            outcome.promise
                .catch(function (error) {
                    $('#forumpostsubmitteddialog').modal('hide');
                    $newForumPost.find('[type=submit]').button('reset');
                    // TODO handle error.
                })
                .then(function (postRef) {
                    setTimeout(function () {
                        window.location.replace('post?key=' + encodeURIComponent(postRef.key));
                    }, 0);
                })

        })
    });
    // Check page
    if ($('form.newforumpost').length > 0) {
        var quill = new Quill('#editor', {
            modules: { toolbar: '#toolbar' },
            theme: 'snow',
            placeholder: 'New post',
        });

        var $newForumPost = $('.newforumpost')

        // characters remaining
        $newForumPost.on('keyup', '.ql-editor', function (e) {
            var length = $(e.target).text().length || 0;
            $newForumPost.find('.currchars').text(length);
            if (length > 1000) {
                $newForumPost.find('.remaining').addClass('text-danger');
                $newForumPost.find('.remaining').removeClass('text-muted');
            }
            else {
                $newForumPost.find('.remaining').removeClass('text-danger');
                $newForumPost.find('.remaining').addClass('text-muted');
            }
        });
    }

    /* firebase.database.ServerValue.TIMESTAMP */
})();