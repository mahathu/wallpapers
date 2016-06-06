$(document).foundation()

var resize;
var img_max_width = 480;
var img_min_width = 300;
var fade_in_time = 75;
var active_category;

function add_images(img_arr){
	var container = $("#wp-container");
	var i=0;
	var imageAddInterval = setInterval(function(){
		var thumb_url = img_arr[i].substring(1);
		var img_url = thumb_url.replace('/thumbs', '');

		var element = $("<div>", {class: "image-wrapper"});

		element.html("<div class='img-menu-bg'><div class='img-menu-btn'><a href='javascript:preview(\""+img_url+"\")'><i class='fa fa-eye' aria-hidden='true'></i> <span class='btn-text'>preView</span></a></div><div class='img-menu-btn'><a href='" + img_url + "' download='background.jpg'><i class='fa fa-download' aria-hidden='true'></i> <span class='btn-text'>Download</span></a></div></div>");
		// element.width(image_width);
		// element.height(image_height);

		element.css('background-image', 'url(' + encodeURI(thumb_url) + ')');

		console.log("Loading thumbnail: "+thumb_url);

		element.css('display', 'none');
		container.append(element);
		element.fadeIn(fade_in_time*2);
		resize_images();
		i++;
		if(i>=img_arr.length){
			clearInterval(imageAddInterval);
		}
	}, fade_in_time);

	/*for(var i=0; i<amount; i++){
		var thumb_url = folder+image_titles[Math.floor(Math.random() * image_titles.length)]+file_ending;
		
		var element = $("<div>", {class: "image-wrapper"});

		element.html("<div class='img-menu-bg'><div class='img-menu-btn'><i class='fa fa-eye' aria-hidden='true'></i> <span class='btn-text'>View</span></div><div class='img-menu-btn'><i class='fa fa-download' aria-hidden='true'></i> <span class='btn-text'>Download</span></div></div>");
		// element.width(image_width);
		// element.height(image_height);

		element.css('background-image', 'url(' + thumb_url + ')');

		container.append(element);
		setTimeout(function(){element.fadeIn(4000)}, 400);
		resize_images();
	}*/

}

function fetch_images(){
	var img_arr = [];

	var container = $("#wp-container");
	container.empty();

	$.ajax({
	    url: "getImages.php?c="+active_category,
	    dataType: "json",
	    success: function (data) {

	        $.each(data, function(i,filename) {
	            img_arr.push(filename);
	        });
	        add_images(img_arr);
	    }
	});
}

function preview(img_url){
	var preview_box = $("#img-preview");
	var preview_bg = $("#img-preview-background");

	preview_box.attr('src', img_url);
	preview_box.attr('margin-top', preview_box.height()*-1);
	preview_box.attr('margin-left', preview_box.width()*-1);

	preview_box.fadeIn(100);
	preview_bg.fadeIn(100);

	$( "html" ).click(function() {
	  preview_box.fadeOut(150);
	  preview_bg.fadeOut(150);
	});
}

function resize_images(){
	var images_per_line = 1;
	while( $( document ).width() / images_per_line > img_max_width ){
		images_per_line++;
	}

	var image_width = $( document ).width() / images_per_line;

	if(image_width<img_min_width)
		image_width = $( document ).width();

	var image_height = Math.floor(image_width / (16/9));

	console.log($( document ).width() + ", "+images_per_line+" images per line | ", image_width + " image width");

	$('#wp-container').children('.image-wrapper').each(function(i) { 
		$(this).width(image_width);
		$(this).height(image_height);
	});

	return images_per_line;
}

function load_categories(){
	var navbar = $(".menu-navigation");

	$.ajax({
	    url: "getCategories.php",
	    dataType: "json",
	    success: function (data) {
	        $.each(data, function(i,filename) {
	            var element = $("<li>");
	            element.html("<a href='javascript:set_category(\""+filename+"\")'>"+filename+"</a>");

	            navbar.append(element);
	        });

	        $('li:nth-child(4)').first().addClass('active');

	        active_category = navbar.find('.active a').html();

			//fetch_images('nature');
			fetch_images();
	    }
	});
}

function set_category(category){
	if(category == $(".menu-navigation").find(".active a").html())
		return;

	$(".menu-navigation").find(".active").removeClass("active");

	var obj = ($("li:contains('"+category+"')"));
	obj.addClass('active');

	active_category = category;
	fetch_images();
}

$( window ).resize(function() {
	clearTimeout(resize);
    resize = setTimeout(resize_images, 500);
});

$( document ).ready(function() {
	load_categories();
});