$(document).ready(function() {

	// compile handlebars template
    var source = $("#blogs-template").html();
    var template = Handlebars.compile(source);

 var allPosts  = [
    	{ post: 'Post #1', description: 'description' },
    	{ post: 'Post #2', description: 'description' }
    ];
  
    // AJAX call to GET all posts
    $.get('/api/posts', function(data) {
    	allPosts = data.posts;
    	
    	var postsHtml = template({ posts: allPosts });
    	$('#posts-list').append(postsHtml);
    });

    
});

