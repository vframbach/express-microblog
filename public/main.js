$(document).ready(function() {

    // compile handlebars template
    var source = $("#blogs-template").html();
    var template = Handlebars.compile(source);

    var postsCollection = [];

    // AJAX call to GET all posts
    $.get('/api/posts', function(data) {
        postsCollection = data.posts;

        var postsHtml = template({
            posts: postsCollection
        });
        $('#posts-list').append(postsHtml);
    });

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
        post.post = prompt('New post post:', post.post);
        post.description = prompt('New description:', post.description);
        
        // updates edits posts without refreshing page
        var postHtml = template({
            posts: postsCollection
        });
        $('#posts-list').html(postHtml);
        
        console.log(postHtml);
        $.ajax({
            type: 'PUT',
            url: '/api/posts/' + postId,
            data: post,
            success: function(data) {
                console.log('post has been edited!');
            }
        });
        //console.log(postId);
    });


});