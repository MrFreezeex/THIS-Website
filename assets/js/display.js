$(document).ready(function() {

	/*
	*	INIT
	*/
	var widthSlide = $('.slide').width(),
	heightChevron = $('#slider .glyphicon-chevron-left').outerHeight(),
	widthSlider = $('#slider').width(),
	indexWidth,
	slideReady = true,
	slidePos = 0,
	slideTrans = 5000,
	slideNbr = $('#slider #slideContainer .slide').length,
	slideTimeout,
	slideDuration = 1000,
	totalSidebarHeight = 0;

	/*
	*	FUNCTIONS
	*/

	function updateFakeNav() {
		$("#fakeNav").height($("nav").height());
	}
	updateFakeNav();

	function slidePropManager() {
		var heightSlide = widthSlide*(9/16);
		$('.slide').css({'height': heightSlide});

		$('#slider').css({'height': heightSlide + 90 + 20});
		var posChevron = (heightSlide + 90 - heightChevron) / 2;
		$('#slider .glyphicon-chevron-left, #slider .glyphicon-chevron-right').css({ 'top' : posChevron });
		indexWidth = $('#slider #slideIndex').width();
		$('#slider #slideIndex').css({ 'left': (widthSlider - indexWidth)/2 });
	}
	function sliderInit() {
		$('#slider #slideContain').css({'width': 100*slideNbr + '%'});
		$('#slider #slideContainer .slide').css({ 'width': 100/slideNbr + '%' });
		for ( i = 1; i < slideNbr; i++) 
			$('#slider #slideIndex').append("<div class='indexRound inactive'></div>")
		slidePropManager();
	}
	sliderInit();

	function slide() {
		if (slideReady) {
			slideReady = false;
			clearTimeout(slideTimeout);

			if (slidePos < slideNbr - 1) {
				slidePos++;
				$('#slideContain').animate({right:'+=100%'}, slideDuration, 'swing', function() {
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
			} else {
				slidePos = 0;
				$('#slideContain').animate({right:'0'}, slideDuration, 'swing', function() {
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
			}
		}
	}
	slideTimeout = setTimeout(slide, slideTrans);

	function slidePrev() {
		if (slideReady) {
			slideReady = false;
			clearTimeout(slideTimeout);

			if ((slidePos - 1) >= 0) {
				slidePos--;
				$('#slideContain').animate({right:'-=100%'}, slideDuration, 'swing', function() {
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
			} else {
				slidePos = slideNbr - 1;
				$('#slideContain').animate({right:(100*(slideNbr - 1))+'%'}, slideDuration, 'swing', function() {
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
				$('#slideContain').animate({right:(100*(slideNbr - 1))+'%'}, slideDuration, 'swing', function() {
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
			}
		}
	}
	function slideTo(slide) {
		if (slideReady) {
			slideReady = false;
			clearTimeout(slideTimeout);

			if (slidePos - slide < 0) {
				$('#slideContain').animate({right:'+=' + (-100 * (slidePos - slide)) + '%'}, slideDuration, 'swing', function() {
					slidePos = slide;
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
			} else if (slidePos - slide > 0) {
				$('#slideContain').animate({right:'-=' + (100 * (slidePos - slide)) + '%'}, slideDuration, 'swing', function() {
					slidePos = slide;
					indexManager();
					slideReady = true;
					slideTimeout = setTimeout(slide, slideTrans);
				});
			}
		}
	}

	function indexManager() {
		var activeSlide = $('#slider #slideIndex .indexRound:nth-child('+(slidePos+1)+')');
		var oldActiveSlide = $('#slider #slideIndex .indexRound.active');
		oldActiveSlide.removeClass('active').addClass('inactive');
		activeSlide.removeClass('inactive').addClass('active')
	}

	function updateNav() {
		var active = $("nav ul li:first-child");
		$("nav ul li").each(function(index, el) {
			if ($(window).scrollTop() >= $($(el).children("a").attr("href")).offset().top - $("#fakeNav").height() - 100)
				active = el;
		});

		$("nav ul li").each(function(index, el) {
			if (el == active)
				$(el).addClass('active');
			else
				$(el).removeClass('active');
		});
	}
	updateNav();

	/*
	*	LISTENERS
	*/

	$('.scrollTo').click( function(event) {
		event.preventDefault();
		window.location.hash = $(this).attr('href');
		var page = $(this).attr('href');
		var speed = 750;
		$('html, body').animate( { scrollTop: $(page).offset().top - $(".fakeNav").height() }, speed );
		return false;
	});

	$('#slideIndex').on('click', '.indexRound', function() {
		var slide = $(this).index();
		if (slide != slidePos && slideReady) {
			clearTimeout(slideTimeout);
			slideTo(slide);
		}
	});

	$("nav").on("click", ".navbar-toggle", function() {
		updateFakeNav();
	});

	$('#slider').on('click', '.glyphicon', function (event) {
		if (slideReady) {
			if ($(this).hasClass('glyphicon-chevron-left')) {
				slidePrev();
			} else {
				slide();
			}
		}
	});

	$(window).resize(function() {
		widthContainer = $('nav .container').width();
		widthSlider = $('#slider').width();
		widthSlide = $('.slide').width();
		heightChevron = $('#slider .glyphicon-chevron-left').outerHeight();
		indexWidth = $('#slider #slideIndex').width();
		slidePropManager();
		updateFakeNav();

		totalSidebarHeight = 0;
		$("#sidebarContainer > div").each(function(){
			totalSidebarHeight += $(this).height() + 50 + 14;
		});
	});

	$(window).scroll(function() {
		updateNav();
	});
});