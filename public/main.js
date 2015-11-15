$(document).ready(function() {

	// compile handlebars template
    var source = $("#blogs-template").html();
    var template = Handlebars.compile(source);

    // array of test data
    var allPosts  = [
    	{ post: 'Post #1', description: 'description' },
    	{ post: 'Post #2', description: 'description' }

    ];

    var postsHtml = template({ posts: allPosts });
    $('#posts-list').append(postsHtml);

});

