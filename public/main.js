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

	// When the modal is opened, check if it was opened by a edit button.
	// If it's opened by an edit button, then fill in post data
    $('#myModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var postId = button.data('post-id'); // Extract info from data-* attributes
        
        // if modal wasn't opened by edit button, no post to edit/pre-fill
        if (!postId) {
        	return;
        }
        var post = postsCollection.find(function(post) {
            return post._id == postId;
        });
        var modal = $(this);
        $('#new-post-title').val(post.post);
        $('#new-post-text').val(post.description);
    });

    // after fields are filled in, clicking button saves text to db
    $('.save-text-button').on('click', function() {
    	console.log('saving!');

    	var newPostTitle = $('#new-post-title').val();
    	var newPostText = $('#new-post-text').val();
    	console.log(newPostTitle, newPostText);

    	$.ajax({
			type: 'POST',
			url: '/api/posts',
			data: { post: newPostTitle, description: newPostText},
			success: function(data) {
				console.log('success!');
				$('#myModal').modal('hide');
				refreshList();
			}
		});

    });

       // create form that allows edit blog post
    $('#posts-list').on('click', '.edit', function() {
        var postId = $(this).data('post-id');
        console.log(postId);
        var post = postsCollection.find(function(post) {
            return post._id == postId;
        });
        console.log(post);
        
        $.ajax({
            type: 'PUT',
            url: '/api/posts/' + postId,
            data: post,
            success: function(data) {
                console.log('post has been edited!');
                refreshList();
            }
        });
        //console.log(postId);
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