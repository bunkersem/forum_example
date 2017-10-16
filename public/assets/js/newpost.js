$(document).ready(function() {
    function createNewForumPost(title, content) {
        var user = firebase.auth().currentUser;
        var post = {
            title: title,
            content: content,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userId: user.uid,
        }
        var result = checkValid(
            validator(App.connection.firebase === true, 'Sorry, we could not establish a connection to the server. We are not able to process your request'),
            validator(user !== null, 'Sorry, we were not able to verify that you are currently logged in. Please login if your not already.'),
            validator(validator.exists(post.title), 'A post requires a title'),
            validator(validator.exists(post.content), 'A post requires content'),
            validator(validator.exists(post.userId), 'A post requires a user id'),
            validator(validator.exists(post.timestamp), 'A post requires a timestamp'),
            validator(post.title.length >= 5, 'A post title requires at least 5 characters'),
            validator(post.title.length <= 100, 'A post title cannot be longer than 100 characters'),
            validator(post.content.length >= 5, 'A posts\'s content requiers at least 5 characters'),
            validator(post.content.length <= 1000, 'A posts\'s content cannot be longer than 100 characters'),
        );
        if (result !== true) {
            console.error(result);
            // TODO notify the user.
            return;
        }
        var postRef = firebase.database().ref('posts').push(post);
        var key = postRef.key
        console.log('newpost key', key);
        // TODO add post key to user's posts.
    }

    $(document).on('submit', 'form.newforumpost', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $newForumPost = $(e.target);
        var title = $newForumPost.get(0).elements['title'].value;
        var content = quill.getText();

        createNewForumPost(title, content);
    })
});

/* firebase.database.ServerValue.TIMESTAMP */
