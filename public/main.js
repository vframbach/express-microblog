$(document).ready(function() {

    // compile handlebars template
    var source = $("#blogs-template").html();
    var template = Handlebars.compile(source);

    var postsCollection = [];
    function refreshList() {

        // AJAX call to GET all posts
        $.get('/api/posts', function(data) {
            postsCollection = data.posts;
            var postsHtml = template({
                posts: postsCollection
            });
            $('#posts-list').html(postsHtml);
        });
	}

	refreshList();

	// When the modal is opened, check if it was opened by an edit button.
	// If it's opened by an edit button, then fill in post data
    $('#myModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var postId = button.data('post-id'); // Extract info from data-* attributes
        
        $('#new-post-id').val(postId);
        // if modal wasn't opened by edit button, no post to edit/pre-fill
        if (!postId) {
        	$('#new-post-title').val("");
        	$('#new-post-text').val("");
        	return;
        }
        var post = postsCollection.find(function(post) {
            return post._id == postId;
        });
        $('#new-post-title').val(post.post);
        $('#new-post-text').val(post.description);
    });

    // after fields are filled in, clicking button saves text to db
    $('.save-text-button').on('click', function() {
        console.log('saving!');

        var newPostTitle = $('#new-post-title').val();
        var newPostText = $('#new-post-text').val();
        var postId = $('#new-post-id').val();
        var newPostImage;

        console.log(newPostTitle, newPostText);
        // title of post gets added to page as gif

        $.get('http://api.giphy.com/v1/gifs/random', {
            tag: newPostTitle,
            rating: 'pg',
            api_key: 'dc6zaTOxFJmzC' // your request
        }).done(function(res) {
            console.log(res);
            // giphy responded ok
            newPostImage = res.data.image_url;
            // set gif on post here
        }).always(function(response) {
            // always runs after request is complete, or failed
            // save the post here
            console.log('gify is complete!');

            // if there's no post id, create one and post text to page
            if (!postId) {
                $.ajax({
                    type: 'POST',
                    url: '/api/posts',
                    data: {
                        post: newPostTitle,
                        description: newPostText,
                        image: newPostImage
                    },
                    success: function(data) {
                        console.log('success!');
                        $('#myModal').modal('hide');
                        refreshList();
                    }
                });

                // if there was a post id, edit/replace text on page	
            } else {

                $.ajax({
                    type: 'PUT',
                    url: '/api/posts/' + postId,
                    data: {
                        post: newPostTitle,
                        description: newPostText,
                        image: newPostImage
                    },
                    success: function(data) {
                        console.log('post has been edited!');
                        $('#myModal').modal('hide');
                        refreshList();
                    }
                });
            }
        });
    });

    // delete blog posts
     $('#posts-list').on('click', '.delete', function() {
        var postId = $(this).data('post-id');
        $.ajax({
            type: 'DELETE',
            url: '/api/posts/' + postId,
            success: function(data) {
                console.log('post has been deleted!');
                refreshList();
            }
        });
        console.log(postId);
    });
});