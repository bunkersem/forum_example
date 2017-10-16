### special classes/attributes/ids/tags:


#### Loggedin
This class is only added the html element if a user is logged in.
```HTML 
<html class="loggedin">
```
This element is visible when we are logged in
```HTML 
<div class="conditional loggedin">
    ...
</div>
```

This element is visible when not logged in
```HTML 
<div class="conditional notloggedin">
    ...
</div>
```

#### Form used to create user with email and password:
(Works with dynamic content)
```HTML 
<form class="create emailandpassword">
  ...
</form> 
```

#### Form used to sign in with email and password:
(Works with dynamic content)
```HTML 
<form class="signin emailandpassword">
  ...
</form> 
```

#### Forum Posts Component:
(Only works with static content)
```HTML 
<div class="forumpostscomponent">
    (skeletion form post)
</div>
```

#### Account profile Component:
(Only works with static content)
```HTML 
<div class="accountprofilecomponent">
    (skeletion form post)
</div>
```

#### Forum post essential classes.
The essential classes for a post:
```HTML
<div class="forumpost">
    <div class="post-title"></div>
    <div class="post-content"></div>
    <!-- WIP: -->
    <span class="post-time"></span>
    <span class="post-likes"></span>
    <span class="post-views"></span>
    <span class="post-user"></span>
    <button class="commentcreate">Create</button>
    <!-- ^^^^^^^^^^^^^^^^^^^ -->
    <div class="post-comments"></div>
    <div>
</div>

```

### common authentication methods

```javascript
firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
});


firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
});


firebase.auth().signOut().then(function () {
    // Sign-out successful.
}).catch(function (error) {
    // An error happened.
});
```

#### userSignOut()
This function is the common method of loggin out a user. When the logout fails a model should appear to alert the user (WIP)
```javascript
function userSignOut() 
```
