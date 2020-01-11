$(window).scroll(function(){
	if ($(window).scrollTop() >= 10) {

        $('.navbar').addClass('fixed-header');
    }
    else {
        $('.navbar').removeClass('fixed-header');
    }
})
